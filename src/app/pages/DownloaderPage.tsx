import { useState, useEffect, useRef } from "react";
import { useQueue } from "../lib/QueueContext";
import {
  Download, Video, Music, Image as ImageIcon, Youtube,
  Check, ArrowRight, FileVideo, Instagram, Loader2, AlertCircle, Zap, ImageDown, Copy
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../components/ui/utils";
import {
  fetchVideoInfo,
  startDownload,
  fetchHistory,
  detectPlatform,
  formatDuration,
  formatViews,
  fetchSettings,
  updateSettings,
  type VideoInfo,
  type DownloadEntry,
} from "../lib/api";

/* ─── tiny helpers ─────────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, accent, accentBar,
}: {
  label: string; value: string; sub: string;
  accent?: string; accentBar?: string;
}) {
  return (
    <div className="relative bg-[rgb(9_9_12)] border border-white/[0.07] rounded-xl p-4 overflow-hidden group">
      {/* left accent bar */}
      <div
        className="absolute top-0 left-0 w-[3px] h-full rounded-r-[2px]"
        style={{ background: accentBar ?? "rgba(255,255,255,0.12)" }}
      />
      <div className="pl-1">
        <div className="text-[9px] font-semibold uppercase tracking-[1.5px] text-white/25 mb-2">
          {label}
        </div>
        <div
          className={cn(
            "text-[24px] mono font-semibold leading-none mb-1.5 tabular-nums",
            accent ?? "text-white",
          )}
        >
          {value}
        </div>
        <div className="text-[10px] mono text-white/25">{sub}</div>
      </div>
    </div>
  );
}

/* glow ring that follows the cursor inside the URL bar */
function GlowCursor({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500",
        active ? "opacity-100" : "opacity-0",
      )}
      style={{
        background:
          "radial-gradient(ellipse 60% 80% at 50% -20%, rgba(255,255,255,0.04) 0%, transparent 70%)",
      }}
    />
  );
}

/* ─── main page ─────────────────────────────────────────────────────────── */

export function DownloaderPage() {
  const { items: queueItems, activeCount } = useQueue();
  const [historyItems, setHistoryItems] = useState<DownloadEntry[]>([]);
  
  useEffect(() => {
    fetchHistory().then(setHistoryItems).catch(console.error);
  }, [queueItems]);

  const totalDownloads = historyItems.length;
  const youtubeCount   = historyItems.filter(i => i.url.includes("youtube.com") || i.url.includes("youtu.be")).length;
  const instagramCount = historyItems.filter(i => i.url.includes("instagram.com")).length;
  const [url, setUrl] = useState(() => sessionStorage.getItem("vaultdl_draft_url") ?? "");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(() => {
    const saved = sessionStorage.getItem("vaultdl_draft_info");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"video" | "audio" | "video_only" | "thumbnail">("video");
  const [selectedQuality, setSelectedQuality] = useState("1080");
  const [selectedContainer, setSelectedContainer] = useState("MP4");
  const [barFocused, setBarFocused] = useState(false);
  const [saveThumb, setSaveThumb] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedAudioLang, setSelectedAudioLang] = useState("original");
  const [selectedSubLang, setSelectedSubLang] = useState("none");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings().then(s => setSaveThumb(s.saveThumbnails)).catch(() => {});
  }, []);

  async function handleUrlChange(val: string) {
    setUrl(val);
    if (val.trim()) {
      sessionStorage.setItem("vaultdl_draft_url", val);
    } else {
      sessionStorage.removeItem("vaultdl_draft_url");
      sessionStorage.removeItem("vaultdl_draft_info");
      setVideoInfo(null);
    }
    setError("");
  }

  const platform = detectPlatform(url);
  const isIG = platform === "instagram";
  const platformColor = isIG ? "#c084fc" : "#ff4444";

  const qualities = ["360", "480", "720", "1080", "1440", "2160", "best"];
  const qualityLabels: Record<string, string> = {
    "360": "360p", "480": "480p", "720": "720p",
    "1080": "1080p", "1440": "1440p", "2160": "4K", "best": "Best",
  };
  const containers = ["MP4", "MKV", "WebM"];

  useEffect(() => {
    if (videoInfo?.available_qualities?.length) {
      const best = videoInfo.available_qualities.at(-1);
      if (best) setSelectedQuality(String(best));
    }
    // Default audio/sub reset when info changes
    setSelectedAudioLang("original");
    setSelectedSubLang("none");
  }, [videoInfo]);

  async function handleAnalyze() {
    if (!url.trim()) return;
    
    // Strip playlist params so only the single video is fetched
    const cleanUrl = url.split("&list=")[0].split("?list=")[0];
    setUrl(cleanUrl);
    sessionStorage.setItem("vaultdl_draft_url", cleanUrl);

    setLoading(true);
    setError("");
    setVideoInfo(null);
    setDownloadDone(false);
    try {
      const info = await fetchVideoInfo(cleanUrl);  // use cleanUrl here too
      setVideoInfo(info);
      sessionStorage.setItem("vaultdl_draft_info", JSON.stringify(info));
    } catch (err: any) {
      setError(err.message || "Failed to fetch video info. Is yt-dlp installed?");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!videoInfo) return;
    setDownloading(true);
    setDownloadDone(false);
    try {
      // Sync saveThumb preference to backend before download
      const settings = await fetchSettings();
      await updateSettings({ ...settings, saveThumbnails: saveThumb });

      const fmt =
        selectedFormat === "audio" ? "mp3"
        : selectedFormat === "thumbnail" ? "jpg"
        : selectedContainer.toLowerCase();
      await startDownload(url, fmt, selectedQuality, selectedFormat, videoInfo.title, videoInfo.thumbnail, selectedAudioLang, selectedSubLang);
      setDownloadDone(true);
      sessionStorage.removeItem("vaultdl_draft_url");
      sessionStorage.removeItem("vaultdl_draft_info");
    } catch (err: any) {
      setError(err.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  const containerLabel =
    selectedFormat === "audio" ? "MP3"
    : selectedFormat === "thumbnail" ? "JPG"
    : selectedContainer;

  const formatLabels: Record<string, string> = {
    video: "Video+Audio",
    audio: "Audio only",
    video_only: "Video Only",
    thumbnail: "Thumbnail",
  };

  return (
    <div className="p-6 max-w-[900px] mx-auto">

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        <StatCard label="Total Downloads" value={totalDownloads.toLocaleString()} sub="this session" accentBar="rgba(255,255,255,0.18)" />
        <StatCard label="YouTube" value={youtubeCount.toString()} sub={`${totalDownloads ? Math.round((youtubeCount/totalDownloads)*100) : 0}% of total`} accent="text-[#ff5555]" accentBar="#ff5555" />
        <StatCard label="Instagram" value={instagramCount.toString()} sub={`${totalDownloads ? Math.round((instagramCount/totalDownloads)*100) : 0}% of total`} accent="text-[#c084fc]" accentBar="#c084fc" />
        <StatCard label="Active Queue" value={activeCount.toString()} sub="in progress" accent="text-emerald-400" accentBar="#34d399" />
      </div>

      {/* ── URL Bar ── */}
      <div
        className={cn(
          "relative bg-[rgb(9_9_12)] border rounded-2xl overflow-hidden mb-5 flex items-center transition-all duration-300",
          error
            ? "border-red-500/40"
            : barFocused
              ? "border-white/20"
              : "border-white/[0.07]",
        )}
      >
        <GlowCursor active={barFocused} />

        {/* platform icon pill */}
        <div
          className="w-14 h-14 flex items-center justify-center border-r border-white/[0.07] shrink-0 transition-colors duration-300"
          style={{ color: platformColor }}
        >
          {isIG
            ? <Instagram className="w-[18px] h-[18px]" strokeWidth={1.5} />
            : <Youtube className="w-[18px] h-[18px]" strokeWidth={1.5} />}
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={url}
          onChange={e => handleUrlChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAnalyze()}
          onFocus={() => setBarFocused(true)}
          onBlur={() => setBarFocused(false)}
          placeholder="Paste a YouTube or Instagram URL to get started…"
          className="flex-1 border-none bg-transparent mono text-[13px] h-14 focus-visible:ring-0 focus-visible:ring-offset-0 text-white/80 placeholder:text-white/20 relative z-10"
        />

        <div className="p-2 shrink-0 relative z-10">
          <Button
            size="sm"
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="h-10 bg-white text-black hover:bg-white/90 font-medium text-[13px] px-5 rounded-xl disabled:opacity-30 transition-all"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </>
              )}
          </Button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2.5 mb-5 px-4 py-3 bg-red-500/[0.08] border border-red-500/20 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-[12px] mono text-red-400">{error}</span>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl p-5 mb-4 animate-pulse">
          <div className="flex gap-5">
            <div className="w-[260px] aspect-video bg-white/[0.04] rounded-xl shrink-0" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 bg-white/[0.04] rounded-lg w-3/4" />
              <div className="h-3 bg-white/[0.04] rounded-lg w-2/5" />
              <div className="h-3 bg-white/[0.04] rounded-lg w-1/3 mt-6" />
              <div className="flex gap-2 mt-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-6 w-14 bg-white/[0.04] rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview card ── */}
      {videoInfo && !loading && (
        <div className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl p-5 mb-4 group">
          <div className="flex flex-col md:flex-row gap-5">

            {/* thumbnail */}
            <div className="w-full md:w-[264px] shrink-0">
              <div className="aspect-video bg-white/[0.03] rounded-xl relative overflow-hidden border border-white/[0.06]">
                {videoInfo.thumbnail ? (
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileVideo className="w-10 h-10 text-white/10" strokeWidth={1} />
                  </div>
                )}

                {/* platform badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg mono text-[9px] font-semibold uppercase tracking-wide text-white"
                    style={{ background: `${platformColor}dd` }}
                  >
                    {isIG
                      ? <Instagram className="w-2.5 h-2.5" strokeWidth={2} />
                      : <Youtube className="w-2.5 h-2.5" strokeWidth={2} />}
                    {videoInfo.extractor}
                  </span>
                </div>

                {/* duration chip */}
                {videoInfo.duration > 0 && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-[10px] mono text-white/80">
                    {formatDuration(videoInfo.duration)}
                  </div>
                )}
              </div>
            </div>

            {/* meta */}
            <div className="flex-1 min-w-0 flex flex-col gap-2.5">
              <h3 className="text-[15px] font-medium text-white leading-snug line-clamp-2">
                {videoInfo.title}
              </h3>

              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${platformColor}20` }}
                >
                  {isIG
                    ? <Instagram className="w-3 h-3" style={{ color: platformColor }} strokeWidth={1.5} />
                    : <Youtube className="w-3 h-3" style={{ color: platformColor }} strokeWidth={1.5} />}
                </div>
                <span className="text-[13px] text-white/40">{videoInfo.uploader}</span>
                {videoInfo.view_count > 0 && (
                  <span className="text-[11px] mono text-white/20">
                    · {formatViews(videoInfo.view_count)}
                  </span>
                )}
              </div>

              {/* available quality chips */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {videoInfo.available_qualities.slice(-4).map(q => (
                  <span
                    key={q}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] mono text-[10px] text-white/35"
                  >
                    {q >= 2160 ? "4K" : `${q}p`}
                  </span>
                ))}
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] mono text-[10px] text-white/35">
                  {formatDuration(videoInfo.duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Format + Quality ── */}
      {videoInfo && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

            {/* Format picker */}
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/25 mb-3">
                Format
              </div>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "video" as const,      label: "Video+Audio", Icon: Video     },
                  { id: "audio" as const,      label: "Audio only",  Icon: Music     },
                  { id: "video_only" as const, label: "Video Only",  Icon: FileVideo },
                  { id: "thumbnail" as const,  label: "Thumbnail",   Icon: ImageIcon },
                ] as const).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedFormat(id)}
                    className={cn(
                      "flex items-center gap-3 py-3 px-4 rounded-xl border transition-all duration-200 text-left relative overflow-hidden",
                      selectedFormat === id
                        ? "bg-white/[0.07] border-white/20 text-white"
                        : "bg-[rgb(9_9_12)] border-white/[0.07] text-white/30 hover:text-white/55 hover:border-white/12",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        selectedFormat === id ? "text-white" : "text-white/25",
                      )}
                      strokeWidth={selectedFormat === id ? 2 : 1.5}
                    />
                    <div className="flex-1">
                      <div className="text-[11px] font-medium leading-none">{label}</div>
                    </div>
                    {selectedFormat === id && (
                      <Check className="w-3 h-3 text-white/50" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>

              {/* Container sub-row */}
              {(selectedFormat === "video" || selectedFormat === "video_only") && (
                <div className="mt-2.5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {containers.map(ext => (
                      <button
                        key={ext}
                        onClick={() => setSelectedContainer(ext)}
                        className={cn(
                          "px-3 py-1 rounded-lg mono text-[11px] border transition-all duration-150",
                          selectedContainer === ext
                            ? "bg-white text-black border-transparent font-semibold"
                            : "bg-transparent text-white/30 border-white/[0.07] hover:border-white/15 hover:text-white/55",
                        )}
                      >
                        {ext}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setSaveThumb(!saveThumb)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-200",
                      saveThumb
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-white/[0.03] border-white/[0.05] text-white/20 hover:text-white/40",
                    )}
                  >
                    <ImageDown className="w-3 h-3" />
                    <span className="text-[9px] font-semibold uppercase tracking-wider">Save Thumb</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quality picker */}
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/25 mb-3">
                Quality
              </div>
              <div className="flex flex-wrap gap-1.5">
                {qualities.map(q => {
                  const avail = videoInfo.available_qualities.map(String);
                  const ok = q === "best" || avail.includes(q);
                  return (
                    <button
                      key={q}
                      onClick={() => ok && setSelectedQuality(q)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg mono text-[12px] border transition-all duration-150",
                        selectedQuality === q
                          ? "bg-white text-black border-transparent font-semibold"
                          : ok
                            ? "bg-[rgb(9_9_12)] text-white/35 border-white/[0.07] hover:border-white/15 hover:text-white/60"
                            : "bg-[rgb(9_9_12)] text-white/12 border-white/[0.04] line-through cursor-not-allowed",
                      )}
                    >
                      {qualityLabels[q]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Audio & Subtitles Selection ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Audio Track */}
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/25 mb-3 flex items-center gap-2">
                <Music className="w-3 h-3" /> Audio Track
              </div>
              <select
                value={selectedAudioLang}
                onChange={(e) => setSelectedAudioLang(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[rgb(9_9_12)] border border-white/[0.07] text-[13px] text-white/70 focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
              >
                <option value="original">Default / Original</option>
                {videoInfo.audio_tracks && videoInfo.audio_tracks.length > 0 && (
                  <option value="all">All Available Tracks ({videoInfo.audio_tracks.length})</option>
                )}
                {videoInfo.audio_tracks?.map(track => (
                  <option key={`audio-${track.id}`} value={track.language}>{track.label}</option>
                ))}
              </select>
            </div>

            {/* Subtitles */}
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/25 mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Subtitles
              </div>
              <select
                value={selectedSubLang}
                onChange={(e) => setSelectedSubLang(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[rgb(9_9_12)] border border-white/[0.07] text-[13px] text-white/70 focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
              >
                <option value="none">None</option>
                {videoInfo.subtitles && videoInfo.subtitles.length > 0 && (
                   <option value="all">All Available Subtitles ({videoInfo.subtitles.length})</option>
                )}
                {videoInfo.subtitles?.map(track => (
                  <option key={`sub-${track.id}`} value={track.language}>{track.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Download button ── */}
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className={cn(
              "w-full h-12 mb-2.5 font-medium text-[14px] transition-all duration-300 rounded-2xl",
              downloadDone
                ? "bg-emerald-500 text-white hover:bg-emerald-500"
                : "bg-white text-black hover:bg-white/90",
            )}
          >
            {downloading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Starting download…</>
            ) : downloadDone ? (
              <><Check className="w-4 h-4 mr-2" /> Added to Queue!</>
            ) : (
              <><Download className="w-4 h-4 mr-2" strokeWidth={2} /> Download Now</>
            )}
          </Button>

          <div className="text-center text-[11px] mono text-white/20 mb-8">
            {containerLabel} · {qualityLabels[selectedQuality]} · Saves to ~/Downloads/VaultDL
          </div>

          {/* ── Download Manifest ── */}
          <div className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl p-5">

            {/* header row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center">
                <Zap className="w-3 h-3 text-white/40" strokeWidth={2} />
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/25">
                Download Manifest
              </div>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: "Source URL",   value: url,                                     hi: false },
                { label: "Platform",     value: videoInfo.extractor,                     hi: true  },
                { label: "Title",        value: videoInfo.title,                          hi: false },
                { label: "Channel",      value: videoInfo.uploader,                      hi: false },
                { label: "Duration",     value: formatDuration(videoInfo.duration),      hi: false },
                { label: "Views",        value: formatViews(videoInfo.view_count),       hi: false },
                { label: "Format",       value: formatLabels[selectedFormat],            hi: true  },
                { label: "Quality",      value: qualityLabels[selectedQuality],          hi: true  },
                { label: "Container",    value: containerLabel,                          hi: true  },
                { label: "Output Path",  value: "~/Downloads/VaultDL",                  hi: false },
              ].map(({ label, value, hi }) => (
                <div key={label} className="flex flex-col gap-1">
                  <div className="text-[9px] mono font-medium text-white/20 uppercase tracking-[1px]">
                    {label}
                  </div>
                  <div
                    className={cn(
                      "text-[12px] mono break-all leading-snug",
                      hi ? "text-white/70 font-medium" : "text-white/40",
                    )}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}