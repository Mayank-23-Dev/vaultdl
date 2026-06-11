import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter", price: "Free", period: null,
    description: "For small teams and personal projects",
    features: ["Up to 3 team members","Basic design tokens","Component library","Community support","Basic documentation"],
    cta: "Get Started", popular: false,
  },
  {
    name: "Pro", price: "$29", period: "/mo",
    description: "For growing teams and organizations",
    features: ["Up to 25 team members","Advanced design tokens","Full component library","Team collaboration","Version control","Priority support","Usage analytics"],
    cta: "Start Free Trial", popular: true,
  },
  {
    name: "Enterprise", price: "Custom", period: null,
    description: "For large organizations with advanced needs",
    features: ["Unlimited team members","Enterprise security","Custom integrations","Dedicated support","SLA guarantee","Custom training","White-label options"],
    cta: "Contact Sales", popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#09090b] border-t border-white/[0.06]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-white/25 mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="max-w-xl mx-auto text-[15px] text-white/35 leading-relaxed">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border transition-all ${
                plan.popular
                  ? "bg-white/[0.04] border-violet-500/40 shadow-[0_0_60px_rgba(139,92,246,0.1)]"
                  : "bg-[#0d0d10] border-white/[0.07]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-500 text-[10px] font-semibold text-white tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-white/30 mb-3">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-semibold text-white tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-white/30 text-[13px]">{plan.period}</span>}
                </div>
                <p className="text-[12px] text-white/30">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                    <span className="text-[12px] text-white/45">{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full h-9 rounded-xl text-[12px] font-semibold transition-all ${
                plan.popular
                  ? "bg-violet-500 text-white hover:bg-violet-400"
                  : "border border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/80 hover:bg-white/[0.03]"
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}