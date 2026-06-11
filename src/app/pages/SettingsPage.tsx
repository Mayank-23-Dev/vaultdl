import { useState, useEffect } from "react";
import { Folder, Sliders, Cpu, Save, FolderOpen, Loader2, Check, Sparkles, DownloadCloud, RefreshCw } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { cn } from "../components/ui/utils";
import { fetchSettings, updateSettings, checkUpdate, type UpdateInfo } from "../lib/api";
import type { Settings } from "../lib/api";

function SettingsCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5 border-b border-white/[0.03] pb-4">
        <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center">
          <Icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
        </div>
        <h3 className="text-[14px] font-semibold text-white/90 tracking-tight">{title}</h3>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[1.5px] text-white/20 mb-2">
      {children}
    </label>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <div className="text-[13.5px] font-medium text-white/70">{label}</div>
        {description && (
          <div className="text-[11px] text-white/25 mt-1 leading-relaxed">{description}</div>
        )}
      </div>
      <div
        className={cn(
          "w-10 h-5.5 rounded-full relative cursor-pointer transition-all duration-300 shrink-0",
          checked ? "bg-white" : "bg-white/[0.06] border border-white/[0.08]"
        )}
        onClick={() => onChange(!checked)}
      >
        <span className={cn(
          "absolute top-0.75 left-0.75 w-4 h-4 rounded-full transition-all duration-300 ease-out",
          checked ? "bg-black translate-x-4.5" : "bg-white/30"
        )} />
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  
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
      .catch(console.error)
      .finally(() => setLoading(false));
    
    // Also check for updates on page load
    checkUpdate().then(setUpdateInfo).catch(() => {});
  }, []);

  const handleCheckUpdate = async () => {
    setCheckingUpdate(true);
    try {
      const info = await checkUpdate();
      setUpdateInfo(info);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  async function handleSelectFolder(key: keyof Settings, current: string) {
    const path = await window.electron?.selectFolder(current.replace(/^~/, ''));
    if (path) setSettings(prev => ({ ...prev, [key]: path }));
  }

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-[900px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-white tracking-tight mb-1">Settings</h1>
          <p className="text-[13px] text-white/30">Configure application preferences and runtime</p>
        </div>
        <Button 
          disabled={saving}
          onClick={handleSave}
          className={cn(
            "min-w-[130px] font-semibold text-[12.5px] h-9 transition-all duration-300",
            saved ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-white text-black hover:bg-white/90"
          )}
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
          ) : saved ? (
            <Check className="w-3.5 h-3.5 mr-2" strokeWidth={3} />
          ) : (
            <Save className="w-3.5 h-3.5 mr-2" strokeWidth={2.5} />
          )}
          {saving ? "Saving..." : saved ? "Changes Saved" : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Update Center */}
        <SettingsCard icon={Sparkles} title="Update Center">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium text-white/70">Current Version</div>
              <div className="text-[11px] mono text-white/20 mt-0.5">v{updateInfo?.currentVersion || '0.0.2'}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckUpdate}
              disabled={checkingUpdate}
              className="h-8 bg-white/[0.03] border-white/[0.07] text-white/60 hover:text-white hover:bg-white/[0.06] text-[11px]"
            >
              {checkingUpdate ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
              Check Updates
            </Button>
          </div>

          {updateInfo?.updateAvailable && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <DownloadCloud className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-emerald-400">New Version Available: v{updateInfo.latestVersion}</div>
                  <div className="text-[11px] text-emerald-400/60 mt-1 leading-relaxed">
                    {updateInfo.notes}
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 bg-emerald-500 text-white hover:bg-emerald-600 h-8 px-4 text-[11px] font-semibold"
                    onClick={() => updateInfo.downloadUrl && window.open(updateInfo.downloadUrl)}
                  >
                    Download & Update Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SettingsCard>

        {/* Download Paths */}
        <SettingsCard icon={Folder} title="Storage Locations">
          <div>
            <FieldLabel>Video Save Path</FieldLabel>
            <div className="flex gap-2">
              <Input
                value={settings.videoPath}
                onChange={(e) => setSettings(p => ({ ...p, videoPath: e.target.value }))}
                className="mono text-[11.5px] bg-white/[0.02] border-white/[0.06] text-white/50 placeholder:text-white/15 h-9"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 shrink-0 bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                onClick={() => handleSelectFolder('videoPath', settings.videoPath)}
              >
                <FolderOpen className="w-3.5 h-3.5 text-white/30" />
              </Button>
            </div>
          </div>
          <div>
            <FieldLabel>Audio Save Path</FieldLabel>
            <div className="flex gap-2">
              <Input
                value={settings.audioPath}
                onChange={(e) => setSettings(p => ({ ...p, audioPath: e.target.value }))}
                className="mono text-[11.5px] bg-white/[0.02] border-white/[0.06] text-white/50 placeholder:text-white/15 h-9"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 shrink-0 bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                onClick={() => handleSelectFolder('audioPath', settings.audioPath)}
              >
                <FolderOpen className="w-3.5 h-3.5 text-white/30" />
              </Button>
            </div>
          </div>
          <div>
            <FieldLabel>Thumbnail Save Path</FieldLabel>
            <div className="flex gap-2">
              <Input
                value={settings.thumbnailPath}
                onChange={(e) => setSettings(p => ({ ...p, thumbnailPath: e.target.value }))}
                className="mono text-[11.5px] bg-white/[0.02] border-white/[0.06] text-white/50 placeholder:text-white/15 h-9"
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 shrink-0 bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                onClick={() => handleSelectFolder('thumbnailPath', settings.thumbnailPath)}
              >
                <FolderOpen className="w-3.5 h-3.5 text-white/30" />
              </Button>
            </div>
          </div>
        </SettingsCard>

        {/* Download Behaviour */}
        <SettingsCard icon={Sliders} title="Download Logic">
          <ToggleRow
            label="Auto-update yt-dlp"
            description="Fetches latest binaries on startup"
            checked={settings.autoUpdateYtdlp}
            onChange={(v) => setSettings(p => ({ ...p, autoUpdateYtdlp: v }))}
          />
          <div className="h-px bg-white/[0.03]" />
          <ToggleRow
            label="Default Thumbnails"
            description="Store thumbnails alongside downloads"
            checked={settings.saveThumbnails}
            onChange={(v) => setSettings(p => ({ ...p, saveThumbnails: v }))}
          />
          <div className="h-px bg-white/[0.03]" />
          <ToggleRow
            label="Auto-merge Streams"
            description="Uses ffmpeg to combine A/V tracks"
            checked={settings.autoMerge}
            onChange={(v) => setSettings(p => ({ ...p, autoMerge: v }))}
          />
          <div className="h-px bg-white/[0.03]" />
          <ToggleRow
            label="Embed Subtitles"
            description="Include WebVTT in the output file"
            checked={settings.embedSubtitles}
            onChange={(v) => setSettings(p => ({ ...p, embedSubtitles: v }))}
          />
        </SettingsCard>

        {/* Performance */}
        <SettingsCard icon={Cpu} title="Performance">
          <div>
            <FieldLabel>Max Concurrent Tasks</FieldLabel>
            <Select 
              value={settings.concurrentDownloads} 
              onValueChange={(v) => setSettings(p => ({ ...p, concurrentDownloads: v }))}
            >
              <SelectTrigger className="mono text-[11.5px] bg-white/[0.02] border-white/[0.06] text-white/50 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[rgb(12_12_16)] border-white/[0.08] shadow-2xl">
                {["1", "2", "3", "5", "8", "10"].map((v) => (
                  <SelectItem key={v} value={v} className="mono text-[12px] text-white/60 focus:bg-white/[0.05] focus:text-white">
                    {v} {v === "1" ? "at a time" : "simultaneous"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <FieldLabel>Download Speed Limit</FieldLabel>
            <Input
              placeholder="Unlimited (e.g. 10M, 500K)"
              value={settings.speedLimit}
              onChange={(e) => setSettings(p => ({ ...p, speedLimit: e.target.value }))}
              className="mono text-[11.5px] bg-white/[0.02] border-white/[0.06] text-white/50 placeholder:text-white/15 h-9"
            />
          </div>
          <div>
            <FieldLabel>Retry Attempts</FieldLabel>
            <Select 
              value={settings.retryAttempts}
              onValueChange={(v) => setSettings(p => ({ ...p, retryAttempts: v }))}
            >
              <SelectTrigger className="mono text-[11.5px] bg-white/[0.02] border-white/[0.06] text-white/50 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[rgb(12_12_16)] border-white/[0.08] shadow-2xl">
                {["1", "3", "5", "10"].map((v) => (
                  <SelectItem key={v} value={v} className="mono text-[12px] text-white/60 focus:bg-white/[0.05] focus:text-white">
                    {v} {v === "1" ? "retry" : "retries"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SettingsCard>
      </div>
      
      <p className="mt-8 text-center text-[11px] mono text-white/10 uppercase tracking-widest">
        Configuration stored in installation root · v2.4.0
      </p>
    </div>
  );
}
