import { Heart, ExternalLink, ShieldCheck, Scale } from "lucide-react";

export function AttributionsPage() {
  const tools = [
    {
      name: "yt-dlp",
      description: "A command-line program to download videos from YouTube.com and other video sites. It handles the core logic of media extraction and analysis.",
      license: "Unlicense (Public Domain)",
      url: "https://github.com/yt-dlp/yt-dlp",
      icon: ShieldCheck,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      name: "FFmpeg",
      description: "A complete, cross-platform solution to record, convert and stream audio and video. Used by VaultDL to merge streams and embed media assets.",
      license: "LGPL / GPL",
      url: "https://ffmpeg.org/",
      icon: Scale,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    }
  ];

  return (
    <div className="p-8 max-w-[900px] mx-auto">
      <div className="mb-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
          <Heart className="w-6 h-6 text-red-400" fill="currentColor" fillOpacity={0.1} />
        </div>
        <h1 className="text-[24px] font-semibold text-white mb-2">Attributions</h1>
        <p className="text-[14px] text-white/40 max-w-[500px] mx-auto leading-relaxed">
          VaultDL is built upon the incredible work of the open-source community. 
          We are grateful for the powerful tools that make this project possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.name}
            className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl p-6 flex flex-col group hover:border-white/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${tool.bg} ${tool.border} border flex items-center justify-center`}>
                <tool.icon className={`w-5 h-5 ${tool.color}`} />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-white">{tool.name}</h3>
                <span className="text-[10px] mono uppercase tracking-wider text-white/25">{tool.license}</span>
              </div>
            </div>
            
            <p className="text-[13px] text-white/40 leading-relaxed mb-6 flex-1">
              {tool.description}
            </p>

            <button 
              onClick={() => window.open(tool.url, '_blank')}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[12px] font-medium text-white/60 group-hover:bg-white/[0.06] group-hover:text-white transition-all"
            >
              <span>Visit Official Repository</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl border border-white/[0.05] bg-white/[0.01]">
        <h4 className="text-[13px] font-semibold text-white/70 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white/40" />
          Legal Disclaimer
        </h4>
        <p className="text-[12px] text-white/30 leading-relaxed">
          VaultDL is a wrapper for existing command-line tools. It does not contain code to bypass DRM (Digital Rights Management) or technological protection measures. Users are responsible for ensuring they have the legal right to download and use the media they access through this software. Please respect the copyright and licensing terms of the content creators.
        </p>
      </div>

      <p className="mt-12 text-center text-[10px] mono text-white/10 uppercase tracking-[2px]">
        Built with respect for the open web
      </p>
    </div>
  );
}
