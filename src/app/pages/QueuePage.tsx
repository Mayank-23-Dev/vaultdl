import { AlertCircle, CheckCircle2, Clock, Loader2, RefreshCw, X, Download } from "lucide-react";
import { cn } from "../components/ui/utils";
import { detectPlatform } from "../lib/api";
import { useQueue, type QueueItem } from "../lib/QueueContext";

const platformColors = {
  youtube: {
    bg: "bg-[#ff4444]/10", border: "border-[#ff4444]/20", text: "text-[#ff5555]",
    dot: "bg-[#ff4444]", bar: "#ff4444", label: "YouTube",
  },
  instagram: {
    bg: "bg-[#c084fc]/10", border: "border-[#c084fc]/20", text: "text-[#c084fc]",
    dot: "bg-[#c084fc]", bar: "#c084fc", label: "Instagram",
  },
  unknown: {
    bg: "bg-white/[0.05]", border: "border-white/[0.08]", text: "text-white/35",
    dot: "bg-white/30", bar: "rgba(255,255,255,0.25)", label: "Video",
  },
};

function getPlatformColors(url: string) {
  const p = detectPlatform(url);
  return platformColors[p] ?? platformColors.unknown;
}

function QueueCard({ item, onCancel }: { item: QueueItem; onCancel: (id: string) => void }) {
  const colors   = getPlatformColors(item.url);
  const isActive   = item.status === "downloading" || item.status === "pending";
  const isComplete = item.status === "complete";
  const isError    = item.status === "error";
  const progress   = item.progress ?? 0;

  return (
    <div
      className={cn(
        "bg-[rgb(9_9_12)] border rounded-2xl overflow-hidden transition-all duration-300",
        isComplete ? "border-white/[0.05] opacity-55" : isError ? "border-red-500/20" : "border-white/[0.07]",
      )}
    >
      {/* thin colored top bar for active items */}
      {isActive && (
        <div
          className="h-[2px] w-full transition-all duration-500"
          style={{ background: `linear-gradient(90deg, ${colors.bar}80 0%, ${colors.bar} ${progress}%, rgba(255,255,255,0.05) ${progress}%)` }}
        />
      )}
      {isComplete && <div className="h-[2px] w-full bg-emerald-500/40" />}
      {isError    && <div className="h-[2px] w-full bg-red-500/30" />}

      <div className="p-4">
        <div className="flex items-center gap-4">

          {/* thumbnail */}
          <div className="w-[68px] h-[38px] bg-white/[0.04] rounded-lg border border-white/[0.06] shrink-0 overflow-hidden flex items-center justify-center">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt=""
                className="w-full h-full object-cover"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <span className={cn("w-2 h-2 rounded-full", colors.dot)} />
            )}
          </div>

          {/* title + badges */}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-white/80 truncate mb-2 leading-none">
              {item.title || item.url}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border mono text-[9px] font-semibold uppercase tracking-wide",
                colors.bg, colors.border, colors.text
              )}>
                <span className={cn("w-1 h-1 rounded-full", colors.dot)} />
                {colors.label}
              </span>
              {item.format && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-white/[0.07] bg-white/[0.04] mono text-[9px] text-white/30 uppercase tracking-wide">
                  {item.format}
                </span>
              )}
              {item.quality && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md border border-white/[0.07] bg-white/[0.04] mono text-[9px] text-white/30 uppercase tracking-wide">
                  {item.quality === "best" ? "Best" : `${item.quality}p`}
                </span>
              )}
            </div>
          </div>

          {/* speed / eta */}
          {item.status === "downloading" && (item.speed || item.eta) && (
            <div className="flex items-center gap-5 shrink-0">
              {item.speed && (
                <div className="text-right">
                  <div className="mono text-[12px] text-white/55">{item.speed}</div>
                  <div className="mono text-[9px] text-white/20 uppercase tracking-[1px]">speed</div>
                </div>
              )}
              {item.eta && (
                <div className="text-right">
                  <div className="mono text-[12px] text-white/55">{item.eta}</div>
                  <div className="mono text-[9px] text-white/20 uppercase tracking-[1px]">ETA</div>
                </div>
              )}
            </div>
          )}

          {/* status pill */}
          <div className="shrink-0">
            {item.status === "pending" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <Clock className="w-3 h-3 text-white/25" strokeWidth={1.5} />
                <span className="text-[11px] mono text-white/35">Pending</span>
              </div>
            )}
            {item.status === "downloading" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                <Loader2 className="w-3 h-3 animate-spin text-white/40" strokeWidth={2} />
                <span className="text-[11px] mono text-white/50">Downloading</span>
              </div>
            )}
            {item.status === "complete" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-500/60" strokeWidth={2} />
                <span className="text-[11px] mono text-emerald-400/60">Complete</span>
              </div>
            )}
            {item.status === "error" && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/[0.08] border border-red-500/20">
                <AlertCircle className="w-3 h-3 text-red-400/60" strokeWidth={2} />
                <span className="text-[11px] mono text-red-400/60">Failed</span>
              </div>
            )}
          </div>

          {/* cancel / remove */}
          <button
            onClick={() => onCancel(item.id)}
            title={isComplete || isError ? "Remove" : "Cancel"}
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400/70 hover:bg-red-500/[0.08] transition-all"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {/* progress row */}
        <div className="mt-3.5 space-y-1.5">
          <div className="h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${isComplete ? 100 : progress}%`,
                background: isComplete ? "rgba(52,211,153,0.5)" : isError ? "rgba(239,68,68,0.4)" : colors.bar,
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="mono text-[10px] text-white/20">
              {isError
                ? (item.error ?? "Download failed")
                : isComplete
                  ? "100% — complete"
                  : `${Math.round(progress)}%`}
            </span>
            {item.status === "downloading" && item.eta && (
              <span className="mono text-[10px] text-white/20 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" strokeWidth={1.5} />
                {item.eta} remaining
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function QueuePage() {
  const { items, activeCount, loading, backendError, cancel, clearCompleted, refresh } = useQueue();

  const active    = items.filter(i => i.status === "downloading" || i.status === "pending");
  const completed = items.filter(i => i.status === "complete"    || i.status === "error");

  return (
    <div className="p-6 max-w-[960px] mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[20px] font-semibold text-white mb-0.5">Download Queue</h1>
          <p className="text-[13px] text-white/30">
            {loading
              ? "Loading…"
              : `${activeCount} active · ${completed.length} completed this session`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.07] bg-[rgb(9_9_12)] text-white/25 hover:text-white/60 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <button
            disabled={completed.length === 0}
            onClick={clearCompleted}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/[0.07] bg-[rgb(9_9_12)] mono text-[12px] text-white/30 hover:text-white/60 hover:border-white/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            Clear Completed
          </button>
        </div>
      </div>

      {/* ── Backend error ── */}
      {backendError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] mb-5">
          <AlertCircle className="w-4 h-4 text-red-400/70 shrink-0" strokeWidth={1.5} />
          <p className="text-[13px] text-red-300/70">{backendError}</p>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && !backendError && (
        <div className="space-y-3">
          {[1, 2].map(n => (
            <div key={n} className="bg-[rgb(9_9_12)] border border-white/[0.06] rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[68px] h-[38px] bg-white/[0.04] rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/[0.05] rounded-lg w-3/4" />
                  <div className="flex gap-1.5">
                    <div className="h-4 w-14 bg-white/[0.04] rounded-md" />
                    <div className="h-4 w-10 bg-white/[0.04] rounded-md" />
                  </div>
                </div>
                <div className="w-24 h-7 bg-white/[0.04] rounded-lg" />
              </div>
              <div className="h-[3px] bg-white/[0.04] rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !backendError && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
            <Download className="w-5 h-5 text-white/15" strokeWidth={1.5} />
          </div>
          <p className="text-[14px] text-white/30 font-medium mb-1">Queue is empty</p>
          <p className="text-[12px] mono text-white/15">Downloads you start will appear here.</p>
        </div>
      )}

      {/* ── Active downloads ── */}
      {!loading && active.length > 0 && (
        <div className="mb-6">
          <div className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/20 mb-3">
            Active — {active.length}
          </div>
          <div className="space-y-2.5">
            {active.map(item => (
              <QueueCard key={item.id} item={item} onCancel={cancel} />
            ))}
          </div>
        </div>
      )}

      {/* ── Completed ── */}
      {!loading && completed.length > 0 && (
        <div>
          <div className="text-[9px] font-semibold uppercase tracking-[1.6px] text-white/20 mb-3">
            Completed — {completed.length}
          </div>
          <div className="space-y-2.5">
            {completed.map(item => (
              <QueueCard key={item.id} item={item} onCancel={cancel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}