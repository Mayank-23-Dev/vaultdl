const BASE_URL = 'http://localhost:3000/api';

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  view_count: number;
  upload_date: string;
  webpage_url: string;
  extractor: string;
  available_qualities: number[];
  formats: Format[];
}

export interface Format {
  format_id: string;
  ext: string;
  height: number;
  fps: number;
  filesize: number;
  vcodec: string;
  acodec: string;
}

// Status now matches what server.mjs actually emits
export interface DownloadEntry {
  id: string;
  url: string;
  format: string;
  quality: string;
  type: string;
  status: 'pending' | 'downloading' | 'complete' | 'error';
  progress: number;
  speed: string;
  eta: string;
  title: string;
  thumbnail: string;
  startedAt: number;       // ms timestamp (Date.now())
  completedAt: number | null;
  error: string | null;
}

// Fetch video metadata
export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const res = await fetch(`${BASE_URL}/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch video info');
  }
  return res.json();
}

// Start a download — pass title + thumbnail so the queue card shows them instantly
export async function startDownload(
  url: string,
  format: string,
  quality: string,
  type: 'video' | 'audio' | 'thumbnail',
  title?: string,
  thumbnail?: string,
): Promise<{ id: string; status: string; downloadPath: string }> {
  const res = await fetch(`${BASE_URL}/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, format, quality, type, title, thumbnail }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to start download');
  }
  return res.json();
}

// Get all downloads in queue
export async function fetchQueue(): Promise<DownloadEntry[]> {
  const res = await fetch(`${BASE_URL}/queue`);
  if (!res.ok) throw new Error('Failed to fetch queue');
  return res.json();
}

// Get single download status
export async function fetchDownloadStatus(id: string): Promise<DownloadEntry> {
  const res = await fetch(`${BASE_URL}/queue/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

// Delete / cancel a download
export async function deleteDownload(id: string): Promise<void> {
  await fetch(`${BASE_URL}/queue/${id}`, { method: 'DELETE' });
}

// Get completed downloads
export async function fetchHistory(): Promise<DownloadEntry[]> {
  const res = await fetch(`${BASE_URL}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

// Format seconds → "3:04"
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Format view count → "1.2M views"
export function formatViews(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}

// Detect platform from URL
export function detectPlatform(url: string): 'youtube' | 'instagram' | 'unknown' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('instagram.com')) return 'instagram';
  return 'unknown';
}