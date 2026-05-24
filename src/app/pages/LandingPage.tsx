import { Link } from "react-router";
import { Download, Shield, Server, Github, Video, Music, Image as ImageIcon, ArrowRight, Zap, Lock, Globe } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[rgb(6_6_8)] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 h-14 bg-[rgba(6,6,8,0.80)] backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
              <Download className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="mono font-semibold text-[15px] text-white tracking-tight">VaultDL</span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {["Features", "How It Works", "Changelog"].map(l => (
              <a key={l} href="#" className="text-[13px] text-white/35 hover:text-white/75 transition-colors">
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/[0.08] text-[12px] text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
            >
              <Github className="w-3.5 h-3.5" strokeWidth={1.5} />
              GitHub
            </a>
            <Link
              to="/setup"
              className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-colors"
            >
              Get Started
              <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-28 px-6 relative">
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-[760px] mx-auto text-center relative">
          {/* pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mono text-[10px] text-white/40 mb-8 uppercase tracking-[1.2px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            yt-dlp 2024.11 · 4K HDR supported
          </div>

          {/* headline */}
          <h1 className="text-[64px] font-semibold leading-[1.05] tracking-[-2px] mb-3">
            Download anything.
          </h1>
          <h2 className="text-[64px] font-light leading-[1.05] tracking-[-2px] text-white/25 mb-8">
            Keep everything.
          </h2>

          <p className="text-[15px] text-white/35 mb-10 max-w-[400px] mx-auto leading-relaxed">
            YouTube & Instagram · Any format · Highest quality · 100% local — no account, no cloud.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <Link
              to="/setup"
              className="flex items-center gap-2 h-12 px-7 rounded-2xl bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-all"
            >
              Paste a URL
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 h-12 px-7 rounded-2xl border border-white/[0.10] text-[14px] text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
            >
              Open Dashboard
            </Link>
          </div>

          {/* trust badges */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {[
              { icon: Lock,   text: "No data sent"  },
              { icon: Server, text: "Runs locally"  },
              { icon: Github, text: "Open source"   },
              { icon: Zap,    text: "Instant queue" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] mono text-[10px] text-white/30 uppercase tracking-[1px]"
              >
                <Icon className="w-3 h-3" strokeWidth={1.5} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">

          <div className="text-center mb-14">
            <div className="mono text-[9px] font-semibold uppercase tracking-[2px] text-white/20 mb-3">
              What it does
            </div>
            <h2 className="text-[36px] font-semibold tracking-[-1px] mb-3">One URL. Every format.</h2>
            <p className="text-[14px] text-white/35">
              Download from YouTube and Instagram in any quality, format, or resolution.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                Icon: Video,
                color: "#ff4444",
                title: "Smart Detection",
                body: "Paste any YouTube or Instagram URL — VaultDL identifies the source and fetches all available formats instantly via yt-dlp.",
                tags: ["YouTube", "Instagram"],
              },
              {
                Icon: Music,
                color: "#c084fc",
                title: "Format Freedom",
                body: "MP4, MKV, WebM for video. MP3, M4A for audio. Max-resolution JPG for thumbnails. Always the highest available bitrate.",
                tags: ["Video", "Audio", "Thumbnail"],
              },
              {
                Icon: Globe,
                color: "#34d399",
                title: "Fully Local",
                body: "No accounts, no cloud, no tracking. yt-dlp + ffmpeg run on your own hardware. Files save directly to your chosen folder.",
                tags: ["Private", "Offline", "Fast"],
              },
            ].map(({ Icon, color, title, body, tags }) => (
              <div
                key={title}
                className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl p-6 hover:border-white/14 transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-medium text-white mb-2">{title}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed mb-5">{body}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="mono text-[9px] uppercase tracking-[1px] px-2 py-1 rounded-md border border-white/[0.07] text-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-[760px] mx-auto text-center">
          <div className="mono text-[9px] font-semibold uppercase tracking-[2px] text-white/20 mb-3">
            How it works
          </div>
          <h2 className="text-[36px] font-semibold tracking-[-1px] mb-14">Up and running in 30 seconds.</h2>

          <div className="flex flex-col gap-px">
            {[
              { n: "01", title: "Paste a URL",       body: "Drop any YouTube or Instagram link into the input bar." },
              { n: "02", title: "Pick your format",   body: "Choose video quality, audio-only, or just the thumbnail." },
              { n: "03", title: "Hit Download",       body: "yt-dlp grabs it in the background. Track progress in the Queue." },
              { n: "04", title: "Find it in Finder",  body: "Files land exactly where you configured. That's it." },
            ].map(({ n, title, body }, i) => (
              <div
                key={n}
                className="flex items-start gap-5 bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl p-5 hover:border-white/12 transition-colors"
                style={{ marginTop: i === 0 ? 0 : "-1px" }}
              >
                <div className="mono text-[11px] font-semibold text-white/15 pt-0.5 w-6 shrink-0">{n}</div>
                <div className="text-left">
                  <div className="text-[14px] font-medium text-white mb-1">{title}</div>
                  <div className="text-[13px] text-white/35">{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 border-t border-white/[0.05]">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-7">
            <Download className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <h2 className="text-[32px] font-semibold tracking-[-1px] mb-3">
            Start downloading in 30 seconds.
          </h2>
          <p className="text-[14px] text-white/35 mb-8">
            No account needed. No cloud. Just paste and download.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/setup"
              className="flex items-center gap-2 h-12 px-7 rounded-2xl bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              to="/dashboard"
              className="h-12 px-7 rounded-2xl border border-white/[0.10] text-[14px] text-white/50 hover:text-white/80 hover:border-white/20 transition-all flex items-center"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-7 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center">
              <Download className="w-3 h-3 text-black" strokeWidth={2.5} />
            </div>
            <span className="mono text-[12px] text-white/25">VaultDL</span>
          </div>
          <p className="mono text-[11px] text-white/20">
            Built with yt-dlp + ffmpeg · v2024.11.4
          </p>
          <div className="flex items-center gap-4">
            {["GitHub", "Changelog", "Docs"].map(l => (
              <a key={l} href="#" className="mono text-[11px] text-white/20 hover:text-white/50 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}