import type { Timestamp } from "firebase/firestore";

function hasToDate(
  value: Timestamp | { seconds: number; nanoseconds: number },
): value is Timestamp {
  return "toDate" in value && typeof value.toDate === "function";
}

export function serializeTimestamp(
  value:
    | Timestamp
    | { seconds: number; nanoseconds: number }
    | null
    | undefined,
): string | null {
  if (!value) return null;

  if (hasToDate(value)) {
    return value.toDate().toISOString();
  }

  const { seconds, nanoseconds } = value;
  const ms = seconds * 1000 + nanoseconds / 1_000_000;
  return new Date(ms).toISOString();
}
