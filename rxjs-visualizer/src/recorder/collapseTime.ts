import { WithTime } from "./addTime";

export interface HasTime {
    time: number;
}

export function cloneWithTime<T extends Object>(datum: WithTime<T>) {
  return { ...datum.original, time: datum.time };
}

/** Mutates the existing datum */
export function collapseTime<T>(
  datum: WithTime<T>
): T & HasTime {
  const result: T & Partial<HasTime> = datum.original;
  result.time = datum.time;
  return result as T & HasTime;
}
