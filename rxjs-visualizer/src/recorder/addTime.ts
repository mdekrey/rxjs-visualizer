import { SchedulerLike, OperatorFunction, asyncScheduler } from "rxjs";
import { map } from "rxjs/operators";

export type WithTime<T> = {
  original: T;
  time: number;
};

export function addTime<T>(
  scheduler: SchedulerLike = asyncScheduler
): OperatorFunction<T, WithTime<T>> {
  return map((original: T) => ({
    original,
    time: scheduler.now()
  }));
}
