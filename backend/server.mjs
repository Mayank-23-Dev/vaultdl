import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const downloads = new Map();
const SETTINGS_FILE = path.join(os.homedir(), 'Downloads', 'VaultDL', 'settings.json');

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
    saveThumbnails: true,
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

let appSettings = loadSettings();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.4.0' });
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
    const child = exec(`yt-dlp --dump-json --no-playlist --extractor-args "youtube:player_client=web,mweb" "${url}"`);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => stdout += d);
    child.stderr.on('data', d => stderr += d);
    child.on('close', (code) => {
      if (code !== 0) return res.status(500).json({ error: stderr || 'yt-dlp failed' });
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
  const ytArgs = `--extractor-args "youtube:player_client=web,mweb"`;

  let cmd = '';
  if (type === 'audio') {
    cmd = `yt-dlp -x --audio-format ${format === 'mp3' ? 'mp3' : 'best'} --no-playlist ${ytArgs} --concurrent-fragments 4 --no-part --buffer-size 16K --newline ${speedFlag} -o "${resolvedPath}/%(title)s.%(ext)s" "${url}"`;
  } else if (type === 'thumbnail') {
    cmd = `yt-dlp --write-thumbnail --skip-download --no-playlist ${ytArgs} --newline -o "${resolvedPath}/%(title)s.%(ext)s" "${url}"`;
  } else {
    const qualityFlag = quality === 'best'
      ? 'bestvideo+bestaudio/best'
      : `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`;
    cmd = `yt-dlp -f "${qualityFlag}" --no-playlist ${ytArgs} --merge-output-format ${format} --concurrent-fragments 4 --no-part --buffer-size 16K --newline ${speedFlag} -o "${resolvedPath}/%(title)s.%(ext)s" "${url}"`;
  }

  const child = exec(cmd);

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

  child.on('close', (code) => {
    const entry = downloads.get(id);
    if (!entry) return;
    entry.status      = code === 0 ? 'complete' : 'error';
    entry.progress    = code === 0 ? 100 : entry.progress;
    entry.completedAt = Date.now();
    entry.process     = null;
    if (code !== 0) entry.error = 'Download failed — check URL or format';
    downloads.set(id, entry);
  });
});

app.get('/api/queue', (req, res) => {
  const safe = [...downloads.values()].map(({ process: _p, ...rest }) => rest);
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
  res.json({ success: true });
});

app.get('/api/history', (req, res) => {
  const completed = [...downloads.values()]
    .filter(d => d.status === 'complete' || d.status === 'error')
    .map(({ process: _p, ...rest }) => rest);
  res.json(completed);
});

app.listen(PORT, () => {
  console.log(`✅ VaultDL backend v2.4.0 running at http://localhost:${PORT}`);
  console.log(`📁 Settings: ${SETTINGS_FILE}`);

  const SELF_URL = process.env.RENDER_EXTERNAL_URL;
  if (SELF_URL) {
    setInterval(async () => {
      try {
        await fetch(`${SELF_URL}/api/health`);
        console.log(`[keep-alive] pinged at ${new Date().toISOString()}`);
      } catch (e) {
        console.warn('[keep-alive] ping failed:', e.message);
      }
    }, 4 * 60 * 1000);
    console.log(`[keep-alive] active → ${SELF_URL}/api/health`);
  }
});