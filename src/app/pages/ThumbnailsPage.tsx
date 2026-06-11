import { useState, useEffect, useCallback } from "react";
import {
  Download,
  Image as ImageIcon,
  Youtube,
  Instagram,
  AlertCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { fetchHistory, detectPlatform } from "../lib/api";
import type { DownloadEntry } from "../lib/api";

export function ThumbnailsPage() {
  const [items, setItems] = useState<DownloadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      const thumbs = (Array.isArray(data) ? data : []).filter(
        (d) => d.type === "thumbnail" || (d.thumbnail && d.status === "complete")
      );
      setItems(thumbs);
      setError(null);
    } catch {
      setError("Cannot reach backend on port 3000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = useCallback((item: DownloadEntry) => {
    if (!item.thumbnail) return;
    const a = document.createElement("a");
    a.href = item.thumbnail;
    a.download = `${item.title || "thumbnail"}.jpg`;
    a.click();
  }, []);

  const handleDownloadAll = useCallback(() => {
    filtered.forEach((item, i) => {
      if (!item.thumbnail) return;
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = item.thumbnail!;
        a.download = `${item.title || `thumbnail-${i}`}.jpg`;
        a.click();
      }, i * 200);
    });
  }, [items, search]);

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.url?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/20 mono mb-1">
            Library
          </p>
          <h1 className="text-[20px] font-semibold text-white leading-none">
            Thumbnails
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            title="Refresh"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] text-white/25 hover:text-white/60 hover:border-white/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <button
            onClick={handleDownloadAll}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white text-black text-[12px] font-medium hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2} />
            Download All
          </button>
        </div>
      </div>

      {/* Search + stats bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-[340px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 pointer-events-none"
            strokeWidth={1.5}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search thumbnails…"
            className="w-full h-9 pl-8 pr-8 rounded-xl bg-[rgb(9_9_12)] border border-white/[0.07] text-[13px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {!loading && (
          <span className="text-[12px] mono text-white/25">
            {search ? `${filtered.length} of ${items.length}` : `${items.length}`}{" "}
            {items.length === 1 ? "thumbnail" : "thumbnails"}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] mb-5">
          <AlertCircle
            className="w-4 h-4 text-red-400/70 mt-0.5 shrink-0"
            strokeWidth={1.5}
          />
          <p className="text-[13px] text-red-300/70">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-white/[0.04]" />
              <div className="px-3 py-3">
                <div className="h-2.5 bg-white/[0.04] rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-white/[0.03] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
            <ImageIcon className="w-5 h-5 text-white/20" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] text-white/30 font-medium mb-1">
            No thumbnails yet
          </p>
          <p className="text-[12px] text-white/20 max-w-[280px] leading-relaxed">
            Download a video with "Thumbnail" type selected, or completed
            downloads with thumbnails appear here automatically.
          </p>
        </div>
      )}

      {/* No search results */}
      {!loading && !error && items.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[13px] text-white/25 mb-2">
            No results for "{search}"
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-[12px] text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((item) => {
            const platform = detectPlatform(item.url);
            const isYT = platform === "youtube";
            const isIG = platform === "instagram";

            return (
              <div
                key={item.id}
                className="group bg-[rgb(9_9_12)] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all duration-200"
              >
                {/* Thumbnail area */}
                <div className="aspect-video bg-white/[0.03] relative flex items-center justify-center border-b border-white/[0.05] overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <ImageIcon
                      className="w-10 h-10 text-white/[0.07]"
                      strokeWidth={1}
                    />
                  )}

                  {/* Platform badge */}
                  <div className="absolute top-2.5 left-2.5">
                    {isYT && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm border border-[#ff4444]/20">
                        <Youtube
                          className="w-2.5 h-2.5 text-[#ff5555]"
                          strokeWidth={2}
                        />
                        <span className="mono text-[9px] font-semibold text-[#ff5555]">
                          YouTube
                        </span>
                      </div>
                    )}
                    {isIG && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/50 backdrop-blur-sm border border-[#c084fc]/20">
                        <Instagram
                          className="w-2.5 h-2.5 text-[#c084fc]"
                          strokeWidth={2}
                        />
                        <span className="mono text-[9px] font-semibold text-[#c084fc]">
                          Instagram
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      className="flex items-center gap-1.5 h-8 px-3.5 rounded-xl bg-white text-black text-[11px] font-medium shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-200 hover:bg-white/90"
                      onClick={() => handleDownload(item)}
                    >
                      <Download className="w-3 h-3" strokeWidth={2} />
                      Save Image
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-[12px] text-white/50 truncate flex-1 group-hover:text-white/70 transition-colors leading-none">
                    {item.title || item.url}
                  </span>
                  <button
                    onClick={() => handleDownload(item)}
                    className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-white/20 hover:text-white/60 hover:bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}