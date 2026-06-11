// eslint-disable-next-line react-refresh/only-export-components
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchQueue, deleteDownload } from "./api";

export type DownloadStatus = "pending" | "downloading" | "complete" | "error";

export interface QueueItem {
  id: string;
  url: string;
  title: string;
  format: string;
  quality: string;
  type: string;
  status: DownloadStatus;
  progress: number;
  speed?: string;
  eta?: string;
  error?: string | null;
  thumbnail?: string;
  startedAt?: number;
  completedAt?: number | null;
}

interface QueueContextValue {
  items: QueueItem[];
  activeCount: number;
  loading: boolean;
  backendError: string | null;
  cancel: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  refresh: () => void;
}

const QueueContext = createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const pollerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchQueue();
      setItems(Array.isArray(data) ? data : []);
      setBackendError(null);
    } catch {
      setBackendError("Cannot reach backend on port 3000.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    pollerRef.current = setInterval(load, 2000);
    return () => {
      if (pollerRef.current) clearInterval(pollerRef.current);
    };
  }, [load]);

  const cancel = useCallback(async (id: string) => {
    try {
      await deleteDownload(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      // next poll will reconcile
    }
  }, []);

  const clearCompleted = useCallback(async () => {
    const done = items.filter(
      (i) => i.status === "complete" || i.status === "error"
    );
    await Promise.allSettled(done.map((i) => deleteDownload(i.id)));
    setItems((prev) =>
      prev.filter((i) => i.status !== "complete" && i.status !== "error")
    );
  }, [items]);

  const activeCount = items.filter(
    (i) => i.status === "downloading" || i.status === "pending"
  ).length;

  return (
    <QueueContext.Provider
      value={{ items, activeCount, loading, backendError, cancel, clearCompleted, refresh: load }}
    >
      {children}
    </QueueContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error("useQueue must be used inside <QueueProvider>");
  return ctx;
}