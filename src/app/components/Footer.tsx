import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-white/[0.06] bg-[#09090b]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-md bg-violet-400" />
              </div>
              <span className="font-semibold text-[14px] text-white tracking-tight">DesignKit</span>
            </div>
            <p className="text-[13px] text-white/30 leading-relaxed mb-6 max-w-xs">
              The complete platform for building and scaling design systems that help teams ship faster.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[12px] text-white/60 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              />
              <button className="h-9 px-4 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-all shrink-0">
                Subscribe
              </button>
            </div>
          </div>

          {[
            { title: "Product", links: ["Features","Pricing","Changelog","Roadmap"] },
            { title: "Resources", links: ["Documentation","Guides","Templates","Blog"] },
            { title: "Company", links: ["About","Careers","Contact","Support"] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-[10px] font-semibold uppercase tracking-[1.5px] text-white/25 mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-[13px] text-white/35 hover:text-white/65 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-white/20">© 2024 DesignKit. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(link => (
              <a key={link} href="#" className="text-[11px] text-white/20 hover:text-white/45 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}