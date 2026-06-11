import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

export function HeroSection() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const cards = scene.querySelectorAll(".floating-card");
    let raf: number;
    const animate = () => {
      cards.forEach((card, i) => {
        const el = card as HTMLElement;
        const t = Date.now() * 0.0008;
        const o = i * 0.7;
        el.style.transform = `translate3d(${Math.sin(t + o) * 12}px, ${Math.cos(t + o * 1.3) * 8}px, 0)`;
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative py-24 lg:py-36 overflow-hidden bg-[#09090b]">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-4 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[11px] text-white/50 tracking-widest uppercase mb-8">
          <Sparkles className="w-3 h-3 text-violet-400" />
          AI-powered component generation
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl md:text-7xl font-semibold tracking-[-0.03em] text-white leading-[1.05] mb-6">
          Build consistent{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
            design systems
          </span>{" "}
          at scale
        </h1>

        <p className="mx-auto max-w-xl text-[15px] text-white/35 leading-relaxed mb-10">
          Create, maintain, and scale your design system with our comprehensive platform.
          From design tokens to component libraries.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
          <button className="flex items-center gap-2 h-11 px-6 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-all">
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 h-11 px-6 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 text-[13px] font-medium hover:bg-white/[0.07] hover:text-white/80 transition-all">
            <Play className="w-3.5 h-3.5" />
            Watch Demo
          </button>
        </div>

        {/* Floating cards scene */}
        <div className="relative mx-auto max-w-4xl h-80 lg:h-96">
          {/* Central hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center z-10 shadow-[0_0_60px_rgba(139,92,246,0.3)]">
            <div className="w-10 h-10 rounded-xl bg-violet-500/40 border border-violet-400/40 flex items-center justify-center">
              <div className="w-5 h-5 rounded-lg bg-violet-400" />
            </div>
          </div>

          <div ref={sceneRef} className="absolute inset-0">
            {/* SVG connector lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {[
                ["50%","50%","18%","22%"],
                ["50%","50%","82%","28%"],
                ["50%","50%","15%","72%"],
                ["50%","50%","80%","74%"],
              ].map(([x1,y1,x2,y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(139,92,246,0.15)" strokeWidth="1"
                  strokeDasharray="4 4" />
              ))}
            </svg>

            {/* Card: Colors */}
            <div className="floating-card absolute top-8 left-[10%] w-36 bg-[#111113] border border-white/[0.08] rounded-2xl p-3.5 shadow-xl">
              <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2.5">Colors</div>
              <div className="grid grid-cols-4 gap-1.5">
                {["bg-violet-500","bg-indigo-500","bg-sky-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-white/20","bg-white/10"].map((c,i) => (
                  <div key={i} className={`w-5 h-5 rounded-md ${c}`} />
                ))}
              </div>
            </div>

            {/* Card: Typography */}
            <div className="floating-card absolute top-4 right-[8%] w-40 bg-[#111113] border border-white/[0.08] rounded-2xl p-3.5 shadow-xl">
              <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2.5">Typography</div>
              <div className="space-y-1.5">
                <div className="h-3.5 bg-white/20 rounded w-28" />
                <div className="h-2.5 bg-white/12 rounded w-24" />
                <div className="h-2 bg-white/8 rounded w-20" />
              </div>
            </div>

            {/* Card: Components */}
            <div className="floating-card absolute bottom-12 left-[6%] w-40 bg-[#111113] border border-white/[0.08] rounded-2xl p-3.5 shadow-xl">
              <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2.5">Components</div>
              <div className="space-y-2">
                {["bg-violet-500","bg-indigo-500","bg-sky-500"].map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-sm ${c}`} />
                    <div className="h-1.5 bg-white/10 rounded flex-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Card: Versions */}
            <div className="floating-card absolute bottom-8 right-[10%] w-36 bg-[#111113] border border-white/[0.08] rounded-2xl p-3.5 shadow-xl">
              <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2.5">Versions</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-white/50 font-mono">v2.1.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400/60" />
                  <span className="text-[11px] text-white/30 font-mono">v2.0.5</span>
                </div>
              </div>
            </div>

            {/* Card: Spacing */}
            <div className="floating-card absolute top-[40%] left-[2%] w-32 bg-[#111113] border border-white/[0.08] rounded-2xl p-3.5 shadow-xl">
              <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2.5">Spacing</div>
              <div className="space-y-1.5">
                {[3,5,8,12].map((w, i) => (
                  <div key={i} className="h-1 bg-violet-500/40 rounded" style={{ width: `${w * 4}px` }} />
                ))}
              </div>
            </div>

            {/* Card: Tokens */}
            <div className="floating-card absolute top-[38%] right-[2%] w-36 bg-[#111113] border border-white/[0.08] rounded-2xl p-3.5 shadow-xl">
              <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2.5">Tokens</div>
              <div className="space-y-1.5">
                {["--color-primary","--radius-lg","--font-sans"].map((t, i) => (
                  <div key={i} className="text-[9px] font-mono text-violet-400/60">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}