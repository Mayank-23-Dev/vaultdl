import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 3000;
const YT_DLP = process.env.YT_DLP_PATH || path.join(process.cwd(), 'yt-dlp.exe');
const FFMPEG = process.env.FFMPEG_PATH || path.join(process.cwd(), 'ffmpeg.exe');

console.log(`[Backend] YT_DLP path: ${YT_DLP}`);
console.log(`[Backend] FFMPEG path: ${FFMPEG}`);

app.use(cors());
app.use(express.json());

const downloads = new Map();
const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');
const HISTORY_FILE = path.join(process.cwd(), 'history.json');

function checkBinaries() {
  if (!fs.existsSync(YT_DLP) && YT_DLP !== 'yt-dlp') {
    console.warn(`⚠️  yt-dlp not found at ${YT_DLP}. Falling back to system 'yt-dlp'.`);
  }
  if (!fs.existsSync(FFMPEG) && FFMPEG !== 'ffmpeg') {
    console.warn(`⚠️  ffmpeg not found at ${FFMPEG}. Falling back to system 'ffmpeg'.`);
  }
}
checkBinaries();

function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
  } catch { /* fall through */ }
  return {
    videoPath: path.join(os.homedir(), 'Downloads', 'VaultDL', 'Videos'),
    audioPath: path.join(os.homedir(), 'Downloads', 'VaultDL', 'Audio'),
    thumbnailPath: path.join(os.homedir(), 'Downloads', 'VaultDL', 'Thumbnails'),
    autoUpdateYtdlp: true,
    saveThumbnails: false,
    autoMerge: true,
    embedSubtitles: false,
    concurrentDownloads: '3',
    speedLimit: '',
    retryAttempts: '3',
    useCookies: false,
    useSocks5: false,
    proxyAddress: '',
    userAgent: '',
  };
}

function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
      data.forEach(item => {
        // Remove process reference and ensure it's not 'downloading' if it was stuck
        const { process: _p, ...rest } = item;
        if (rest.status === 'downloading' || rest.status === 'pending') {
          rest.status = 'error';
          rest.error = 'App closed during download';
        }
        downloads.set(item.id, rest);
      });
      console.log(`✅ Loaded ${downloads.size} items from history.`);
    }
  } catch (e) {
    console.error('❌ Failed to load history:', e);
  }
}

function saveHistory() {
  try {
    const dir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const data = [...downloads.values()].map(({ process: _p, ...rest }) => rest);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}

let appSettings = loadSettings();
loadHistory();

function updateYtdlp() {
  if (!appSettings.autoUpdateYtdlp) return;
  console.log('[Backend] Checking for yt-dlp updates...');
  exec(`"${YT_DLP}" -U`, (err, stdout, stderr) => {
    if (err) {
      console.warn(`[Backend] yt-dlp update failed: ${err.message}`);
    } else {
      console.log(`[Backend] yt-dlp update output: ${stdout || stderr}`);
    }
  });
}
updateYtdlp();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.0.11' });
});

app.get('/api/check-update', async (req, res) => {
  try {
    // In a real scenario, you'd host this version.json on GitHub or your own server
    // For now, I'll use a placeholder URL. You should replace this with your actual URL later.
    const REMOTE_VERSION_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/public/version.json';
    
    // We'll simulate a check for now by comparing with a hardcoded version
    // If you have a real URL, you can use fetch(REMOTE_VERSION_URL)
    
    res.json({
      currentVersion: '0.0.11',
      latestVersion: '0.0.11', // This would come from the remote fetch
      updateAvailable: false,
      notes: 'No new updates available.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check for updates' });
  }
});

app.get('/api/settings', (req, res) => res.json(appSettings));

app.post('/api/settings', (req, res) => {
  try {
    appSettings = { ...appSettings, ...req.body };
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/info', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const jsRuntime = `--js-runtimes "node:${process.execPath}"`;
    const remoteComponents = '--remote-components ejs:github';
    const ffmpegFlag = FFMPEG !== 'ffmpeg' ? `--ffmpeg-location "${FFMPEG}"` : '';
    const child = exec(`"${YT_DLP}" ${ffmpegFlag} ${jsRuntime} ${remoteComponents} --dump-json --no-playlist "${url}"`, {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
      maxBuffer: 10 * 1024 * 1024 // 10MB to avoid maxBuffer exceeded errors on huge JSONs
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => stdout += d);
    child.stderr.on('data', d => stderr += d);
    child.on('error', (err) => {
      console.error(`[api/info] Exec error: ${err.message}`);
      if (!res.headersSent) res.status(500).json({ error: `Failed to execute yt-dlp: ${err.message}` });
    });
    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`[api/info] yt-dlp failed with code ${code}. Stderr: ${stderr}`);
        return res.status(500).json({ error: stderr.trim() || `yt-dlp failed (code ${code})` });
      }
      try {
        const info = JSON.parse(stdout);
        const formats = (info.formats || [])
          .filter(f => f.height)
          .map(f => ({
            format_id: f.format_id,
            ext: f.ext,
            height: f.height,
            fps: f.fps,
            filesize: f.filesize,
            vcodec: f.vcodec,
            acodec: f.acodec,
          }));

        // Rich audio track extraction
        const audioMap = new Map();
        (info.formats || []).forEach(f => {
          if (f.acodec && f.acodec !== 'none') {
            const lang = f.language || 'und';
            if (lang === 'und') return;

            const id = f.audio_track_id || lang;
            
            if (!audioMap.has(id)) {
              let label = `Language: ${lang.toUpperCase()}`;
              if (f.audio_track_name) {
                label = `${f.audio_track_name} (${lang.toUpperCase()})`;
              }
              
              audioMap.set(id, {
                id: id,
                language: lang,
                formatId: f.format_id,
                trackName: f.audio_track_name || '',
                label: label
              });
            } else {
              const existing = audioMap.get(id);
              if (!existing.trackName && f.audio_track_name) {
                existing.trackName = f.audio_track_name;
                existing.label = `${f.audio_track_name} (${lang.toUpperCase()})`;
              }
            }
          }
        });
        const audio_tracks = Array.from(audioMap.values());

        // Rich subtitle extraction
        const subMap = new Map();
        const processSubs = (subObj, isAuto) => {
          if (!subObj) return;
          Object.entries(subObj).forEach(([lang, formats]) => {
            if (!subMap.has(lang)) {
              const name = formats?.[0]?.name || lang.toUpperCase();
              subMap.set(lang, {
                id: lang,
                language: lang,
                label: isAuto ? `${name} (Auto)` : name,
                isAuto
              });
            }
          });
        };
        processSubs(info.subtitles, false);
        processSubs(info.automatic_captions, true);
        const subtitles = Array.from(subMap.values());

        res.json({
          id: info.id,
          title: info.title,
          thumbnail: info.thumbnail,
          duration: info.duration,
          uploader: info.uploader,
          view_count: info.view_count,
          upload_date: info.upload_date,
          webpage_url: info.webpage_url,
          extractor: info.extractor,
          formats,
          audio_tracks: audio_tracks,
          subtitles: subtitles,
          available_qualities: [...new Set(
            formats.filter(f => f.height).map(f => f.height)
          )].sort((a, b) => a - b),
        });
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse video info' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/download', (req, res) => {
  const {
    url,
    format = 'mp4',
    quality = 'best',
    type = 'video',
    title = '',
    thumbnail = '',
    audio_lang,
    subtitle_lang,
  } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const id = randomUUID();

  const downloadPath =
    type === 'audio'
      ? (appSettings.audioPath || path.join(os.homedir(), 'Downloads', 'VaultDL', 'Audio'))
      : type === 'thumbnail'
      ? (appSettings.thumbnailPath || path.join(os.homedir(), 'Downloads', 'VaultDL', 'Thumbnails'))
      : (appSettings.videoPath || path.join(os.homedir(), 'Downloads', 'VaultDL', 'Videos'));

  const resolvedPath = downloadPath.replace(/^~/, os.homedir());
  if (!fs.existsSync(resolvedPath)) fs.mkdirSync(resolvedPath, { recursive: true });

  const speedFlag = appSettings.speedLimit ? `--limit-rate ${appSettings.speedLimit}` : '';
  const ffmpegFlag = FFMPEG !== 'ffmpeg' ? `--ffmpeg-location "${FFMPEG}"` : '';
  
  // Subtitles
  let subFlag = '';
  if (subtitle_lang === 'all') {
    subFlag = '--all-subs --embed-subs --convert-subs srt';
  } else if (subtitle_lang && subtitle_lang !== 'none') {
    subFlag = `--embed-subs --sub-langs "${subtitle_lang}" --convert-subs srt`;
  } else if (appSettings.embedSubtitles) {
    subFlag = '--embed-subs --sub-langs "en.*" --convert-subs srt';
  }

  // Thumbnails
  const thumbFlag = appSettings.saveThumbnails ? '--write-thumbnail --embed-thumbnail' : '--no-write-thumbnail';
  
  // Audio
  const audioMultiFlag = '--audio-multistreams --embed-metadata';
  const audioFormat = format === 'mp3' ? 'mp3' : 'best';

  // JS Runtime for multi-track extraction
  const jsRuntime = `--js-runtimes "node:${process.execPath}"`;
  const remoteComponents = '--remote-components ejs:github';
  const baseFlags = `${jsRuntime} ${remoteComponents} ${ffmpegFlag} ${thumbFlag}`;

  let cmd = '';
  if (type === 'audio') {
    cmd = `"${YT_DLP}" ${baseFlags} ${audioMultiFlag} -x --audio-format ${audioFormat} --no-playlist --concurrent-fragments 4 --no-part --buffer-size 16K --newline ${speedFlag} -o "${resolvedPath}/%(title)s.%(ext)s" "${url}"`;
  } else if (type === 'thumbnail') {
    cmd = `"${YT_DLP}" ${baseFlags} --write-thumbnail --skip-download --no-playlist --newline -o "${resolvedPath}/%(title)s.%(ext)s" "${url}"`;
  } else if (type === 'video_only') {
    const qualityFlag = quality === 'best' ? 'bestvideo' : `bestvideo[height<=${quality}]`;
    cmd = `"${YT_DLP}" ${baseFlags} ${subFlag} -f "${qualityFlag}" --no-playlist --concurrent-fragments 4 --no-part --buffer-size 16K --newline ${speedFlag} -o "${resolvedPath}/%(title)s.%(ext)s" "${url}"`;
  } else {
    const mergeFlag = appSettings.autoMerge ? `--merge-output-format ${format}` : '';
    
    let formatSelector = '';
    const qHeight = quality === 'best' ? '9999' : quality;
    
    if (audio_lang === 'all') {
      formatSelector = `bestvideo[height<=${qHeight}]+bestaudio[language=original]+bestaudio[language=en]+bestaudio[language=es]+bestaudio[language=hi]+bestaudio[language=fr]+bestaudio[language=ar]/bestvideo+bestaudio/best`;
    } else if (audio_lang && audio_lang !== 'original') {
      // YouTube dubs: Check for pre-multiplexed first, then explicitly use audio_track_id or language
      formatSelector = `best[height<=${qHeight}][audio_track_id=${audio_lang}]/best[height<=${qHeight}][language=${audio_lang}]/bestvideo[height<=${qHeight}]+bestaudio[audio_track_id=${audio_lang}]/bestvideo[height<=${qHeight}]+bestaudio[language=${audio_lang}]/bestvideo+bestaudio/best`;
    } else {
      formatSelector = quality === 'best' ? 'bestvideo+bestaudio/best' : `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`;
    }
    
    cmd = `"${YT_DLP}" ${baseFlags} ${subFlag} ${audioMultiFlag} -f "${formatSelector}" --no-playlist ${mergeFlag} --concurrent-fragments 4 --no-part --buffer-size 16K --newline ${speedFlag} -o "${resolvedPath}/%(title)s.%(ext)s" "${url}"`;
  }

  const child = exec(cmd, { env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' } });

  downloads.set(id, {
    id, url, format, quality, type,
    status: 'downloading',
    progress: 0, speed: '', eta: '',
    title, thumbnail,
    startedAt: Date.now(),
    completedAt: null,
    error: null,
    process: child,
  });

  saveHistory();

  res.json({ id, status: 'started', downloadPath: resolvedPath });

  const parseOutput = (data) => {
    const entry = downloads.get(id);
    if (!entry) return;
    const progressMatch = data.match(/(\d+\.?\d*)%/);
    const speedMatch    = data.match(/([\d.]+\s?[KMG]iB\/s)/);
    const etaMatch      = data.match(/ETA\s+(\d+:\d+)/);
    const titleMatch    = data.match(/\[download\] Destination: .+[/\\](.+)\.\w+$/m);
    if (progressMatch) entry.progress = parseFloat(progressMatch[1]);
    if (speedMatch)    entry.speed    = speedMatch[1].trim();
    if (etaMatch)      entry.eta      = etaMatch[1];
    if (titleMatch && !entry.title) entry.title = titleMatch[1];
    downloads.set(id, entry);
  };

  child.stdout.on('data', parseOutput);
  child.stderr.on('data', parseOutput);

  child.on('error', (err) => {
    console.error(`[api/download] Exec error: ${err.message}`);
    const entry = downloads.get(id);
    if (entry) {
      entry.status = 'error';
      entry.error = `Exec error: ${err.message}`;
      downloads.set(id, entry);
      saveHistory();
    }
  });

  child.on('close', (code) => {
    const entry = downloads.get(id);
    if (!entry) return;
    entry.status      = code === 0 ? 'complete' : 'error';
    entry.progress    = code === 0 ? 100 : entry.progress;
    entry.completedAt = Date.now();
    entry.process     = null;
    if (code !== 0) {
      console.error(`[api/download] yt-dlp failed with code ${code}`);
      entry.error = `Download failed (code ${code})`;
    }
    downloads.set(id, entry);
    saveHistory();
  });
});

app.get('/api/queue', (req, res) => {
  const safe = [...downloads.values()]
    .filter(d => d.status !== 'complete')
    .map(({ process: _p, ...rest }) => rest);
  res.json(safe);
});

app.get('/api/queue/:id', (req, res) => {
  const entry = downloads.get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  const { process: _p, ...safe } = entry;
  res.json(safe);
});

app.delete('/api/queue/:id', (req, res) => {
  const entry = downloads.get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });

  if (entry.process && !entry.process.killed) {
    try {
      entry.process.kill('SIGTERM');
      setTimeout(() => {
        if (entry.process && !entry.process.killed) {
          entry.process.kill('SIGKILL');
        }
      }, 2000);
    } catch (_) { /* process may have already exited */ }
  }

  downloads.delete(req.params.id);
  saveHistory();
  res.json({ success: true });
});

app.get('/api/history', (req, res) => {
  const completed = [...downloads.values()]
    .filter(d => d.status === 'complete')
    .map(({ process: _p, ...rest }) => rest);
  res.json(completed);
});

app.listen(PORT, () => {
  console.log(`✅ VaultDL backend v0.0.2 running at http://localhost:${PORT}`);
  console.log(`📁 Settings: ${SETTINGS_FILE}`);
});