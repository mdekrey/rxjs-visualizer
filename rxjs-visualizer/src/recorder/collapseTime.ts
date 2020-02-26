import { WithTime } from "./addTime";

export function cloneWithTime<T extends Object>(datum: WithTime<T>) {
  return { ...datum.original, time: datum.time };
}

/** Mutates the existing datum */
export function collapseTime<T>(
  datum: WithTime<T>
): T & { time: number } {
  const result: T & { time?: number } = datum.original;
  result.time = datum.time;
  return result as T & { time: number };
}
