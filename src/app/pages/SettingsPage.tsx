import { Folder, Sliders, Cpu, Network, Save } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";

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
    <div className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-white/50" strokeWidth={1.5} />
        </div>
        <h3 className="text-[13px] font-semibold text-white/80">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-[1.2px] text-white/25 mb-1.5">
      {children}
    </label>
  );
}

function ToggleRow({ label, description, defaultChecked }: { label: string; description?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <div>
        <div className="text-[13px] text-white/60">{label}</div>
        {description && (
          <div className="text-[11px] text-white/25 mt-0.5">{description}</div>
        )}
      </div>
      <Switch defaultChecked={defaultChecked} className="shrink-0" />
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="p-6 max-w-[860px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-white mb-0.5">Settings</h1>
          <p className="text-[13px] text-white/30">Configure VaultDL preferences and runtime</p>
        </div>
        <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium text-[12px] h-8">
          <Save className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Download Paths */}
        <SettingsCard icon={Folder} title="Download Paths">
          <div>
            <FieldLabel>Video Save Path</FieldLabel>
            <Input
              defaultValue="~/Downloads/VaultDL/Videos"
              className="mono text-[12px] bg-white/[0.03] border-white/[0.08] text-white/60 placeholder:text-white/20 focus-visible:border-white/20"
            />
          </div>
          <div>
            <FieldLabel>Audio Save Path</FieldLabel>
            <Input
              defaultValue="~/Downloads/VaultDL/Audio"
              className="mono text-[12px] bg-white/[0.03] border-white/[0.08] text-white/60 placeholder:text-white/20 focus-visible:border-white/20"
            />
          </div>
          <div>
            <FieldLabel>Thumbnail Save Path</FieldLabel>
            <Input
              defaultValue="~/Downloads/VaultDL/Thumbnails"
              className="mono text-[12px] bg-white/[0.03] border-white/[0.08] text-white/60 placeholder:text-white/20 focus-visible:border-white/20"
            />
          </div>
        </SettingsCard>

        {/* Download Behaviour */}
        <SettingsCard icon={Sliders} title="Download Behaviour">
          <ToggleRow
            label="Auto-update yt-dlp on launch"
            description="Fetches the latest binary before starting"
            defaultChecked
          />
          <div className="h-px bg-white/[0.04]" />
          <ToggleRow
            label="Save thumbnails by default"
            description="Stored alongside the downloaded file"
            defaultChecked
          />
          <div className="h-px bg-white/[0.04]" />
          <ToggleRow
            label="Auto-merge video + audio"
            description="Requires ffmpeg · uses best available streams"
            defaultChecked
          />
          <div className="h-px bg-white/[0.04]" />
          <ToggleRow
            label="Embed subtitles when available"
            description="Embeds WebVTT into the output container"
          />
        </SettingsCard>

        {/* Performance */}
        <SettingsCard icon={Cpu} title="Performance">
          <div>
            <FieldLabel>Concurrent Downloads</FieldLabel>
            <Select defaultValue="3">
              <SelectTrigger className="mono text-[12px] bg-white/[0.03] border-white/[0.08] text-white/60 focus:border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[rgb(12_12_16)] border-white/[0.08]">
                {["1", "2", "3", "5", "8", "10"].map((v) => (
                  <SelectItem key={v} value={v} className="mono text-[12px] text-white/60">
                    {v} {v === "1" ? "at a time" : "simultaneous"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <FieldLabel>Speed Limit</FieldLabel>
            <Input
              placeholder="Unlimited (e.g. 5M or 500K)"
              className="mono text-[12px] bg-white/[0.03] border-white/[0.08] text-white/60 placeholder:text-white/20 focus-visible:border-white/20"
            />
          </div>
          <div>
            <FieldLabel>Retry Attempts on Failure</FieldLabel>
            <Select defaultValue="3">
              <SelectTrigger className="mono text-[12px] bg-white/[0.03] border-white/[0.08] text-white/60 focus:border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[rgb(12_12_16)] border-white/[0.08]">
                {["1", "3", "5", "10"].map((v) => (
                  <SelectItem key={v} value={v} className="mono text-[12px] text-white/60">
                    {v} {v === "1" ? "retry" : "retries"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SettingsCard>

        {/* Network & Proxy */}
        <SettingsCard icon={Network} title="Network & Proxy">
          <ToggleRow
            label="Use cookies.txt"
            description="Required for age-restricted or private content"
          />
          <div className="h-px bg-white/[0.04]" />
          <ToggleRow
            label="Enable SOCKS5 proxy"
            description="Route traffic through a proxy server"
          />
          <div>
            <FieldLabel>Proxy Address</FieldLabel>
            <Input
              placeholder="socks5://127.0.0.1:1080"
              className="mono text-[12px] bg-white/[0.03] border-white/[0.08] text-white/60 placeholder:text-white/20 focus-visible:border-white/20"
            />
          </div>
          <div>
            <FieldLabel>User Agent Override</FieldLabel>
            <Input
              placeholder="Leave blank to use default"
              className="mono text-[12px] bg-white/[0.03] border-white/[0.08] text-white/60 placeholder:text-white/20 focus-visible:border-white/20"
            />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}
