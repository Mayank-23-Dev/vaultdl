import { Outlet, NavLink, useLocation } from "react-router";
import { Download, ListVideo, History, Image, Settings, Wifi, ChevronRight, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../ui/utils";
import { useQueue } from "../../lib/QueueContext";
import { useEffect, useState } from "react";

export function DashboardLayout() {
  const { items, activeCount } = useQueue();
  const queueCount = items.length;
  const location = useLocation();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/health");
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(false);
      }
    }
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const pageTitle = (() => {
    const p = location.pathname;
    if (p.endsWith("/queue")) return "Queue";
    if (p.endsWith("/history")) return "History";
    if (p.endsWith("/thumbnails")) return "Thumbnails";
    if (p.endsWith("/settings")) return "Settings";
    return "Downloader";
  })();

  const navItems = [
    { path: "/dashboard",            label: "Downloader", icon: Download,  end: true },
    { path: "/dashboard/queue",      label: "Queue",      icon: ListVideo, badge: queueCount > 0 ? String(queueCount) : undefined },
    { path: "/dashboard/history",    label: "History",    icon: History },
    { path: "/dashboard/thumbnails", label: "Thumbnails", icon: Image },
  ];

  const [pcName, setPcName] = useState("User");

  useEffect(() => {
    window.electron?.getPCName().then(setPcName);
  }, []);

  return (
    <div className="flex h-screen bg-[rgb(4_4_6)]">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] bg-[rgb(6_6_9)] border-r border-white/[0.05] flex flex-col shrink-0">

        {/* Logo */}
        <div className="h-[52px] px-4 flex items-center gap-3 border-b border-white/[0.05] shrink-0">
          <span className="mono font-semibold text-[13px] text-white tracking-tight">VaultDL</span>
          <span className="ml-auto text-[9px] mono text-white/15 font-medium bg-white/[0.04] px-1.5 py-0.5 rounded-sm border border-white/[0.06]">v0.0.11</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 pt-3 pb-2 overflow-y-auto">

          {/* Section label */}
          <div className="px-3 mb-2">
            <span className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/15">Navigation</span>
          </div>

          <div className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => cn(
                  "flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[12.5px] transition-all duration-150 relative group",
                  isActive
                    ? "bg-white/[0.07] text-white border border-white/[0.08]"
                    : "text-white/35 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn("w-[15px] h-[15px] shrink-0 transition-colors", isActive ? "text-white" : "text-white/30")}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "mono text-[9px] px-1.5 py-0.5 rounded-md font-semibold transition-colors",
                        activeCount > 0
                          ? "text-emerald-400 bg-emerald-500/[0.12] border border-emerald-500/20"
                          : "text-white/30 bg-white/[0.05] border border-white/[0.07]"
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-3 h-3 text-white/20 shrink-0" strokeWidth={1.5} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.05] my-3 mx-1" />

          {/* Settings */}
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => cn(
              "flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[12.5px] transition-all duration-150 relative border",
              isActive
                ? "bg-white/[0.07] text-white border-white/[0.08]"
                : "text-white/35 hover:text-white/70 hover:bg-white/[0.03] border-transparent"
            )}
          >
            {({ isActive }) => (
              <>
                <Settings
                  className={cn("w-[15px] h-[15px] shrink-0", isActive ? "text-white" : "text-white/30")}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className="font-medium flex-1">Settings</span>
                {isActive && <ChevronRight className="w-3 h-3 text-white/20 shrink-0" strokeWidth={1.5} />}
              </>
            )}
          </NavLink>

          <NavLink
            to="/dashboard/attributions"
            className={({ isActive }) => cn(
              "flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[12.5px] transition-all duration-150 relative border mt-1",
              isActive
                ? "bg-white/[0.07] text-white border-white/[0.08]"
                : "text-white/35 hover:text-white/70 hover:bg-white/[0.03] border-transparent"
            )}
          >
            {({ isActive }) => (
              <>
                <Heart
                  className={cn("w-[15px] h-[15px] shrink-0", isActive ? "text-white" : "text-white/30")}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className="font-medium flex-1">Attributions</span>
                {isActive && <ChevronRight className="w-3 h-3 text-white/20 shrink-0" strokeWidth={1.5} />}
              </>
            )}
          </NavLink>

          {/* Runtime section */}
          <div className="mt-5 px-1">
            <div className="px-2 mb-2.5">
              <span className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/15">Runtime</span>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
                  <span className="text-[11px] mono text-white/30">yt-dlp</span>
                </div>
                <span className="text-[10px] mono text-white/20">2024.11.4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
                  <span className="text-[11px] mono text-white/30">ffmpeg</span>
                </div>
                <span className="text-[10px] mono text-white/20">6.1.2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-3 h-3 text-white/20" strokeWidth={1.5} />
                  <span className="text-[11px] mono text-white/30">port</span>
                </div>
                <span className="text-[10px] mono text-white/20">:3000</span>
              </div>
            </div>
          </div>
        </nav>

        {/* User block */}
        <div className="px-3 py-3 border-t border-white/[0.05] shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
            <Avatar className="w-7 h-7 shrink-0">
              <AvatarFallback className="bg-white/[0.08] border border-white/[0.10] text-[10px] text-white/50 font-semibold">
                MO
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-white/70 truncate leading-none mb-0.5 group-hover:text-white/90 transition-colors">
                {pcName}
              </div>
              <div className="text-[9px] mono text-white/20">Local</div>
            </div>
            <div
              title={backendOnline === null ? "Checking…" : backendOnline ? "Backend online" : "Backend offline"}
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                backendOnline === null ? "bg-white/20" :
                backendOnline ? "bg-emerald-500/80 shadow-[0_0_4px_rgba(52,211,153,0.7)]" : "bg-red-500/80"
              )}
            />
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="h-[52px] border-b border-white/[0.05] bg-[rgb(6_6_9)]/80 backdrop-blur-sm flex items-center justify-between px-5 shrink-0">

          {/* Left: breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] mono text-white/20">VaultDL</span>
              <span className="text-white/10 text-[11px]">/</span>
              <span className="text-[11px] mono text-white/50 font-medium">{pageTitle}</span>
            </div>
          </div>

          {/* Right: status chips */}
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/[0.07] border border-emerald-500/[0.15]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
                <span className="mono text-[10px] text-emerald-400 font-medium">
                  {activeCount} downloading
                </span>
              </div>
            )}

            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all",
              backendOnline === false
                ? "bg-red-500/[0.05] border-red-500/[0.15]"
                : "bg-white/[0.03] border-white/[0.06]"
            )}>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                backendOnline === null ? "bg-white/20" :
                backendOnline ? "bg-emerald-500/60" : "bg-red-500/70"
              )} />
              <span className={cn(
                "mono text-[10px]",
                backendOnline === false ? "text-red-400/60" : "text-white/25"
              )}>
                {backendOnline === false ? "backend offline" : "127.0.0.1:3000"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}