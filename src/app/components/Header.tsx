import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = ["Features", "Pricing", "Testimonials", "Docs"];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">

        {/* Logo + Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-md bg-violet-400" />
            </div>
            <span className="font-semibold text-[14px] text-white tracking-tight">DesignKit</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <a href="#features"      className="px-3 py-1.5 rounded-lg text-[13px] text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all">Features</a>
            <a href="#pricing"       className="px-3 py-1.5 rounded-lg text-[13px] text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all">Pricing</a>
            <a href="#testimonials"  className="px-3 py-1.5 rounded-lg text-[13px] text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all">Testimonials</a>
            <a href="#docs"          className="px-3 py-1.5 rounded-lg text-[13px] text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all">Docs</a>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden md:flex h-8 px-4 rounded-lg text-[12px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all items-center">
            Sign In
          </button>
          <button className="hidden md:flex h-8 px-4 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-all items-center">
            Get Started
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] text-white/40 hover:text-white/70 transition-colors"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#09090b] px-4 py-3 space-y-1">
          <a href="#features"     onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-[13px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all">Features</a>
          <a href="#pricing"      onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-[13px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all">Pricing</a>
          <a href="#testimonials" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-[13px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all">Testimonials</a>
          <a href="#docs"         onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-[13px] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all">Docs</a>
          <div className="pt-2 border-t border-white/[0.06] flex gap-2">
            <button className="flex-1 h-9 rounded-lg border border-white/[0.08] text-[12px] text-white/50">Sign In</button>
            <button className="flex-1 h-9 rounded-lg bg-white text-black text-[12px] font-semibold">Get Started</button>
          </div>
        </div>
      )}
    </header>
  );
}