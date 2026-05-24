import { Palette, Code, Users, Zap, GitBranch, Shield, Smartphone, BarChart3 } from "lucide-react";

const badgeColors: Record<string, string> = {
  Core: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  Pro: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  AI: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Enterprise: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const features = [
  { icon: Palette, title: "Design Tokens", description: "Centralized tokens for colors, typography, and spacing. Keep your brand consistent across all platforms.", badge: "Core" },
  { icon: Code, title: "Component Library", description: "Pre-built, customizable components with comprehensive documentation and code examples.", badge: "Core" },
  { icon: Users, title: "Team Collaboration", description: "Real-time collaboration for designers and developers. Comment, review, and iterate together.", badge: "Pro" },
  { icon: Zap, title: "Auto-Generation", description: "AI-powered component and token generation from your existing designs. Save hours of manual work.", badge: "AI" },
  { icon: GitBranch, title: "Version Control", description: "Track changes, manage releases, and maintain multiple versions of your design system.", badge: "Pro" },
  { icon: Shield, title: "Enterprise Security", description: "SOC 2 compliant with enterprise-grade security features and single sign-on support.", badge: "Enterprise" },
  { icon: Smartphone, title: "Multi-Platform", description: "Export tokens and components for web, mobile, and native platforms. One source of truth.", badge: "Core" },
  { icon: BarChart3, title: "Analytics & Insights", description: "Track component usage, adoption metrics, and design system health across your org.", badge: "Pro" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#09090b] border-t border-white/[0.06]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/25 mb-4">Features</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-4">
            Everything your team needs
          </h2>
          <p className="max-w-xl mx-auto text-[15px] text-white/35 leading-relaxed">
            From design tokens to component libraries — all the tools to build and maintain scalable design systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-2xl overflow-hidden">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#09090b] p-6 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-white/15 transition-colors">
                  <f.icon className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" strokeWidth={1.5} />
                </div>
                <span className={`text-[9px] font-semibold uppercase tracking-[1.4px] px-2 py-0.5 rounded-full border ${badgeColors[f.badge]}`}>
                  {f.badge}
                </span>
              </div>
              <h3 className="text-[13px] font-semibold text-white/80 mb-2">{f.title}</h3>
              <p className="text-[12px] text-white/30 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}