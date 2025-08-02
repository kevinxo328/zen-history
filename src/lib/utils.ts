import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {ComposerTranslation} from "vue-i18n";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextMidnightTimestamp(now: Date): number {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  return nextMidnight.getTime();
}

export function formatRelativeTimeI18n(
  timestamp: number,
  t: ComposerTranslation<any, any, any>
): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffMs < 0) {
    console.warn("Timestamp is in the future, cannot format relative time.");
    return "N/A";
  }
  if (diffMin < 60) return t("minute_ago", {count: diffMin});
  if (diffHour < 24) return t("hour_ago", {count: diffHour});

  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

/**
 * Convert milliseconds to a time string in the format of HH:MM:SS
 * @param ms Time in milliseconds
 * @returns Formatted time string
 *
 * Example: 3661000 ms -> "01:01:01"
 */
export function formatMsToTimeString(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
