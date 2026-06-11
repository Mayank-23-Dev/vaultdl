const testimonials = [
  { content: "DesignKit has transformed how our team builds and maintains our design system. The automation features alone save us hours every week.", author: "Sarah Chen", role: "Design Systems Lead", company: "TechCorp", avatar: "SC" },
  { content: "The collaboration features are incredible. Our designers and developers are finally speaking the same language thanks to DesignKit.", author: "Marcus Johnson", role: "Frontend Lead", company: "StartupXYZ", avatar: "MJ" },
  { content: "We've been able to scale our design system across 15+ products seamlessly. The versioning and deployment features are game-changers.", author: "Elena Rodriguez", role: "Product Designer", company: "Enterprise Inc", avatar: "ER" },
  { content: "The AI-powered component generation is mind-blowing. It's like having a design systems expert working 24/7 for our team.", author: "David Kim", role: "CTO", company: "InnovateLab", avatar: "DK" },
  { content: "Integration with our existing tools was seamless. DesignKit fits perfectly into our workflow without any disruption.", author: "Lisa Thompson", role: "UX Director", company: "DesignCo", avatar: "LT" },
  { content: "The documentation auto-generation feature has made our component library so much more accessible to the entire organization.", author: "Alex Rivera", role: "Senior Developer", company: "BuildFast", avatar: "AR" },
];

const avatarColors = ["bg-violet-500/20 text-violet-300", "bg-sky-500/20 text-sky-300", "bg-emerald-500/20 text-emerald-300", "bg-amber-500/20 text-amber-300", "bg-rose-500/20 text-rose-300", "bg-indigo-500/20 text-indigo-300"];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-[#09090b] border-t border-white/[0.06]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/25 mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-4">
            Loved by design teams
          </h2>
          <p className="max-w-xl mx-auto text-[15px] text-white/35 leading-relaxed">
            See what teams are saying about how DesignKit transformed their workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#0d0d10] border border-white/[0.07] rounded-2xl p-6 hover:border-white/[0.12] transition-colors"
            >
              {/* Quote mark */}
              <div className="text-3xl text-white/10 font-serif leading-none mb-3">"</div>
              <p className="text-[13px] text-white/45 leading-relaxed mb-6">{t.content}</p>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[12px] font-medium text-white/70">{t.author}</div>
                  <div className="text-[10px] text-white/25">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}