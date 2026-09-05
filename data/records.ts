import type { RailLineId } from "@/data/lines";

export type RouteRecord = {
  runs: number;
  bestTimeMs: number | null;
  bestWpm: number | null;
  bestAccuracy: number | null;
};

export type RouteRecordMap = Partial<Record<RailLineId, RouteRecord>>;

const STORAGE_KEY = "stesen-route-records-v1";
const LEGACY_STORAGE_KEY = "hentian-route-records-v1";

export const emptyRouteRecord = (): RouteRecord => ({
  runs: 0,
  bestTimeMs: null,
  bestWpm: null,
  bestAccuracy: null,
});

export const loadRouteRecords = (): RouteRecordMap => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as RouteRecordMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const getRouteRecord = (lineId: RailLineId): RouteRecord => {
  const stored = loadRouteRecords()[lineId];
  return stored
    ? {
        runs: Number.isFinite(stored.runs) ? stored.runs : 0,
        bestTimeMs: Number.isFinite(stored.bestTimeMs) ? stored.bestTimeMs : null,
        bestWpm: Number.isFinite(stored.bestWpm) ? stored.bestWpm : null,
        bestAccuracy: Number.isFinite(stored.bestAccuracy) ? stored.bestAccuracy : null,
      }
    : emptyRouteRecord();
};

export const saveRouteResult = (
  lineId: RailLineId,
  result: { elapsedMs: number; wpm: number; accuracy: number; fullLine: boolean },
) => {
  if (typeof window === "undefined") return emptyRouteRecord();
  const all = loadRouteRecords();
  const previous = getRouteRecord(lineId);
  const next: RouteRecord = {
    runs: previous.runs + 1,
    bestTimeMs:
      result.fullLine && (previous.bestTimeMs === null || result.elapsedMs < previous.bestTimeMs)
        ? result.elapsedMs
        : previous.bestTimeMs,
    bestWpm: previous.bestWpm === null ? result.wpm : Math.max(previous.bestWpm, result.wpm),
    bestAccuracy:
      previous.bestAccuracy === null ? result.accuracy : Math.max(previous.bestAccuracy, result.accuracy),
  };
  all[lineId] = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return next;
};
