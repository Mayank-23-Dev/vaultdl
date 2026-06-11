import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Folder, Terminal, Loader2 } from "lucide-react";
import { cn } from "../components/ui/utils";
import { fetchSettings, updateSettings } from "../lib/api";
import type { Settings } from "../lib/api";

export function SetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    videoPath: "~/Downloads/VaultDL/Videos",
    audioPath: "~/Downloads/VaultDL/Audio",
    thumbnailPath: "~/Downloads/VaultDL/Thumbnails",
    autoUpdateYtdlp: true,
    saveThumbnails: true,
    autoMerge: true,
    embedSubtitles: false,
    concurrentDownloads: "3",
    speedLimit: "",
    retryAttempts: "3"
  });

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {}) // Ignore errors if settings don't exist yet
      .finally(() => setLoading(false));
  }, []);

  async function handleSelectFolder(key: keyof Settings, current: string) {
    const path = await window.electron?.selectFolder(current.replace(/^~/, ''));
    if (path) setSettings(p => ({ ...p, [key]: path }));
  }

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      await updateSettings(settings);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      navigate("/dashboard"); // Fallback
    } finally {
      setLaunching(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[rgb(4_4_6)] flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[rgb(4_4_6)]"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%),
          url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")`
      }}
    >
      <div className="w-full max-w-[460px] bg-[rgb(7_7_10)] border border-white/[0.07] rounded-2xl p-9">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <img src={`${window.location.origin}/icon.png`} className="w-6 h-6 object-contain" alt="VaultDL Logo" />
          <span className="mono font-semibold text-[15px] text-white tracking-tight">VaultDL</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[9px] font-semibold uppercase tracking-[1.8px] text-white/20 mb-2">
            First Time Setup
          </div>
          <h2 className="text-[20px] font-medium text-white">Configure your workspace</h2>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">

          {/* Video Path */}
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[1.5px] text-white/25 mb-2">
              Video Save Path
            </div>
            <div className="flex gap-2">
              <input
                value={settings.videoPath}
                onChange={(e) => setSettings(p => ({ ...p, videoPath: e.target.value }))}
                className="flex-1 h-9 px-3 rounded-lg bg-[rgb(9_9_12)] border border-white/[0.07] text-[12px] mono text-white/60 focus:outline-none focus:border-white/20 transition-colors"
              />
              <button 
                onClick={() => handleSelectFolder('videoPath', settings.videoPath)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.07] bg-[rgb(9_9_12)] text-white/30 hover:text-white/60 hover:border-white/15 transition-all shrink-0"
              >
                <Folder className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Audio Path */}
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[1.5px] text-white/25 mb-2">
              Audio Save Path
            </div>
            <div className="flex gap-2">
              <input
                value={settings.audioPath}
                onChange={(e) => setSettings(p => ({ ...p, audioPath: e.target.value }))}
                className="flex-1 h-9 px-3 rounded-lg bg-[rgb(9_9_12)] border border-white/[0.07] text-[12px] mono text-white/60 focus:outline-none focus:border-white/20 transition-colors"
              />
              <button 
                onClick={() => handleSelectFolder('audioPath', settings.audioPath)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.07] bg-[rgb(9_9_12)] text-white/30 hover:text-white/60 hover:border-white/15 transition-all shrink-0"
              >
                <Folder className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* yt-dlp Path */}
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[1.5px] text-white/25 mb-2">
              yt-dlp Binary Path
            </div>
            <div className="flex gap-2">
              <input
                placeholder="/usr/local/bin/yt-dlp"
                value="Bundled"
                disabled
                className="flex-1 h-9 px-3 rounded-lg bg-[rgb(9_9_12)] border border-white/[0.07] text-[12px] mono text-white/30 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors cursor-not-allowed"
              />
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.07] bg-[rgb(9_9_12)] text-white/10 shrink-0 cursor-not-allowed">
                <Terminal className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between pt-2 px-1">
            <span className="text-[12px] text-white/40">Auto-update yt-dlp on launch</span>
            <div
              className={cn(
                "w-9 h-5 rounded-full relative cursor-pointer transition-all duration-200",
                settings.autoUpdateYtdlp ? "bg-white" : "bg-white/[0.08] border border-white/[0.10]"
              )}
              onClick={() => setSettings(p => ({ ...p, autoUpdateYtdlp: !p.autoUpdateYtdlp }))}
            >
              <span className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-all duration-200",
                settings.autoUpdateYtdlp ? "bg-black translate-x-4" : "bg-white/40"
              )} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleLaunch}
          disabled={launching}
          className="w-full h-11 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-all mb-4 flex items-center justify-center gap-2"
        >
          {launching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Launch VaultDL"}
          {!launching && <span className="text-black/50">→</span>}
        </button>

        {/* Footer */}
        <p className="text-[10px] mono text-white/20 text-center">
          All settings editable later in Settings
        </p>
      </div>
    </div>
  );
}