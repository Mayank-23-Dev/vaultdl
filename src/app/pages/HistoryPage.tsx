import { useState, useEffect, useCallback } from "react";
import { Search, Download, FolderOpen, Trash2, RefreshCw, AlertCircle, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../components/ui/utils";
import { fetchHistory, deleteDownload, detectPlatform } from "../lib/api";
import type { DownloadEntry } from "../lib/api";

const platformColors = {
  youtube:   { bg: "bg-[#ff4444]/10", border: "border-[#ff4444]/20", text: "text-[#ff5555]",  dot: "bg-[#ff4444]", label: "YouTube"   },
  instagram: { bg: "bg-[#c084fc]/10", border: "border-[#c084fc]/20", text: "text-[#c084fc]",  dot: "bg-[#c084fc]", label: "Instagram" },
  unknown:   { bg: "bg-white/[0.05]", border: "border-white/[0.08]", text: "text-white/35",   dot: "bg-white/30",  label: "Unknown"   },
};

type PlatformFilter = "all" | "youtube" | "instagram";

function formatDate(ts: number): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(ts: number): string {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function HistoryPage() {
  const [items, setItems]               = useState<DownloadEntry[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch {
      setError("Cannot reach backend on port 3000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteDownload(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch { /* ignore */ }
  }, []);

  const handleClearAll = useCallback(async () => {
    await Promise.allSettled(items.map(i => deleteDownload(i.id)));
    setItems([]);
  }, [items]);

  const filtered = items.filter(item => {
    const platform = detectPlatform(item.url);
    const matchesPlatform = platformFilter === "all" || platform === platformFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      item.title?.toLowerCase().includes(q) ||
      item.format?.toLowerCase().includes(q) ||
      item.url?.toLowerCase().includes(q);
    return matchesPlatform && matchesSearch;
  });

  const youtubeCount   = items.filter(i => detectPlatform(i.url) === "youtube").length;
  const instagramCount = items.filter(i => detectPlatform(i.url) === "instagram").length;

  return (
    <div className="p-6 max-w-[1100px] mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[20px] font-semibold text-white mb-0.5">History</h1>
          <p className="text-[13px] text-white/30">
            {loading ? "Loading…" : `${filtered.length} completed download${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] bg-[rgb(9_9_12)] text-white/25 hover:text-white/60 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <button
            disabled={items.length === 0}
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-white/[0.07] bg-[rgb(9_9_12)] text-[12px] text-white/30 hover:text-red-400/70 hover:border-red-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            Clear All
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] mb-5">
          <AlertCircle className="w-4 h-4 text-red-400/70 shrink-0" strokeWidth={1.5} />
          <p className="text-[13px] text-red-300/70">{error}</p>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-2 mb-5">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2.5 bg-[rgb(9_9_12)] border border-white/[0.07] rounded-xl px-3.5 h-10 focus-within:border-white/20 transition-colors">
          <Search className="w-3.5 h-3.5 text-white/20 shrink-0" strokeWidth={1.5} />
          <Input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title, format, or URL…"
            className="flex-1 bg-transparent border-none h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[13px] mono text-white/60 placeholder:text-white/20"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-white/20 hover:text-white/50 transition-colors text-[16px] leading-none">×</button>
          )}
        </div>

        {/* Platform pills */}
        {(["youtube", "instagram"] as const).map(p => {
          const c = platformColors[p];
          const count = p === "youtube" ? youtubeCount : instagramCount;
          const active = platformFilter === p;
          return (
            <button
              key={p}
              onClick={() => setPlatformFilter(prev => prev === p ? "all" : p)}
              className={cn(
                "flex items-center gap-1.5 px-3 h-10 rounded-xl border text-[12px] font-medium transition-all",
                active
                  ? cn(c.bg, c.border, c.text)
                  : "bg-[rgb(9_9_12)] border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/12"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", active ? c.dot : "bg-white/20")} />
              {p === "youtube" ? "YouTube" : "Instagram"}
              {count > 0 && (
                <span className={cn("mono text-[10px]", active ? c.text : "text-white/25")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl overflow-hidden animate-pulse">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="flex items-center gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-b-0">
              <div className="w-[60px] h-[34px] bg-white/[0.04] rounded-lg shrink-0" />
              <div className="flex-1 h-3 bg-white/[0.04] rounded-lg w-1/2" />
              <div className="w-16 h-3 bg-white/[0.04] rounded-lg" />
              <div className="w-10 h-3 bg-white/[0.04] rounded-lg" />
              <div className="w-20 h-3 bg-white/[0.04] rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
            <Download className="w-5 h-5 text-white/15" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] text-white/30 font-medium mb-1">
            {search || platformFilter !== "all" ? "No results match your filter" : "No downloads yet"}
          </p>
          <p className="text-[12px] mono text-white/15">Completed downloads will appear here.</p>
        </div>
      )}

      {/* ── Table ── */}
      {!loading && filtered.length > 0 && (
        <div className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl overflow-hidden">

          {/* Table header */}
          <div className="grid grid-cols-[2fr_100px_80px_80px_140px_64px] px-5 py-2.5 border-b border-white/[0.05]">
            {["Title", "Platform", "Format", "Quality", "Date", ""].map(col => (
              <div key={col} className="text-[9px] font-semibold uppercase tracking-[1.4px] text-white/20">
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((item, idx) => {
            const platform = detectPlatform(item.url);
            const colors   = platformColors[platform];
            const isLast   = idx === filtered.length - 1;

            return (
              <div
                key={item.id}
                className={cn(
                  "grid grid-cols-[2fr_100px_80px_80px_140px_64px] items-center px-5 py-3 group transition-colors hover:bg-white/[0.02]",
                  !isLast && "border-b border-white/[0.04]"
                )}
              >
                {/* Title + thumbnail */}
                <div className="flex items-center gap-3 min-w-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-[60px] h-[34px] rounded-lg border border-white/[0.06] object-cover shrink-0"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-[60px] h-[34px] bg-white/[0.04] rounded-lg border border-white/[0.06] shrink-0" />
                  )}
                  <span className="text-[13px] text-white/60 truncate group-hover:text-white/85 transition-colors leading-snug">
                    {item.title || item.url}
                  </span>
                </div>

                {/* Platform badge */}
                <div>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border mono text-[9px] font-semibold uppercase tracking-wide",
                    colors.bg, colors.border, colors.text
                  )}>
                    <span className={cn("w-1 h-1 rounded-full", colors.dot)} />
                    {colors.label}
                  </span>
                </div>

                {/* Format */}
                <div>
                  <span className="mono text-[12px] text-white/30 uppercase">{item.format || "—"}</span>
                </div>

                {/* Quality */}
                <div>
                  <span className="mono text-[12px] text-white/30">
                    {item.quality ? (item.quality === "best" ? "Best" : `${item.quality}p`) : "—"}
                  </span>
                </div>

                {/* Date + time */}
                <div className="flex flex-col gap-0.5">
                  <span className="mono text-[11px] text-white/40">{formatDate(item.completedAt as number)}</span>
                  <span className="mono text-[10px] text-white/20 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" strokeWidth={1.5} />
                    {formatTime(item.completedAt as number)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                    title="Open folder"
                    onClick={() => window.open(`file://${item.url}`, "_blank")}
                  >
                    <FolderOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400/70 hover:bg-red-500/[0.08] transition-all"
                    title="Remove"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Footer count */}
          <div className="px-5 py-2.5 border-t border-white/[0.05] flex items-center justify-between">
            <span className="mono text-[10px] text-white/15">
              {filtered.length} of {items.length} entries
            </span>
            {platformFilter !== "all" || search ? (
              <button
                onClick={() => { setPlatformFilter("all"); setSearch(""); }}
                className="mono text-[10px] text-white/20 hover:text-white/50 transition-colors"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}