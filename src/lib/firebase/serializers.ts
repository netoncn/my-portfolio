import type { Timestamp } from "firebase/firestore";

export function serializeTimestamp(
  value:
    | Timestamp
    | { seconds: number; nanoseconds: number }
    | null
    | undefined,
): string | null {
  if (!value) return null;

  if (typeof (value as any).toDate === "function") {
    return (value as any).toDate().toISOString();
  }

  const { seconds, nanoseconds } = value as {
    seconds: number;
    nanoseconds: number;
  };
  const ms = seconds * 1000 + nanoseconds / 1_000_000;
  return new Date(ms).toISOString();
}
