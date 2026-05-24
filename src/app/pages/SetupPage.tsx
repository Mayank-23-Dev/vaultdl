import { useNavigate } from "react-router";
import { Download, Folder, Terminal } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";

export function SetupPage() {
  const navigate = useNavigate();

  const handleSetup = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]">
      <Card className="w-full max-w-[480px] p-9 rounded-[20px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Download className="w-5 h-5 text-black" />
          </div>
          <span className="mono font-semibold text-lg text-white">VaultDL</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[10px] font-medium uppercase tracking-[1.5px] text-muted-foreground/60 mb-2">
            FIRST TIME SETUP
          </div>
          <h2 className="text-2xl font-medium text-white">Configure your workspace</h2>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <Label className="text-[11px] font-medium uppercase tracking-[1.5px] text-muted-foreground/60">
              Video Save Path
            </Label>
            <div className="flex gap-2 mt-2">
              <Input defaultValue="~/Downloads/VaultDL/Videos" className="flex-1 mono" />
              <Button variant="outline" size="icon" className="w-10 h-10 flex-shrink-0">
                <Folder className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-medium uppercase tracking-[1.5px] text-muted-foreground/60">
              Audio Save Path
            </Label>
            <div className="flex gap-2 mt-2">
              <Input defaultValue="~/Downloads/VaultDL/Audio" className="flex-1 mono" />
              <Button variant="outline" size="icon" className="w-10 h-10 flex-shrink-0">
                <Folder className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-medium uppercase tracking-[1.5px] text-muted-foreground/60">
              yt-dlp Binary Path
            </Label>
            <div className="flex gap-2 mt-2">
              <Input placeholder="/usr/local/bin/yt-dlp" className="flex-1 mono" />
              <Button variant="outline" size="icon" className="w-10 h-10 flex-shrink-0">
                <Terminal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Auto-update yt-dlp on launch</span>
            <Switch defaultChecked />
          </div>
        </div>

        {/* Submit Button */}
        <Button onClick={handleSetup} className="w-full h-12 mb-4">
          Launch VaultDL →
        </Button>

        {/* Footer Note */}
        <p className="text-[10px] mono text-muted-foreground/60 text-center">
          All settings editable later in Settings
        </p>
      </Card>
    </div>
  );
}
