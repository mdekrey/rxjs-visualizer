import {
  Observable,
  OperatorFunction,
  concat,
  of,
  SchedulerLike,
  Subscription,
  merge
} from "rxjs";
import { map, catchError, startWith, delay, tap } from "rxjs/operators";

export type LifecycleEntry<T> =
  | LifecycleStartEntry
  | LifecycleDatumEntry<T>
  | LifecycleErrorEntry
  | LifecycleCompleteEntry
  | LifecycleContinuesEntry;
export interface LifecycleDatumEntry<T> {
  datum: T;
}
export interface LifecycleErrorEntry {
  error: any;
}
export interface LifecycleStartEntry {
  start: true;
}
export interface LifecycleCompleteEntry {
  complete: true;
}
export interface LifecycleContinuesEntry {
  continues: true;
}
export function isLifecycleDatumEntry<T>(
  t: LifecycleEntry<T>
): t is LifecycleDatumEntry<T> {
  return t.hasOwnProperty("datum");
}
export function isLifecycleErrorEntry<T>(
  t: LifecycleEntry<T>
): t is LifecycleErrorEntry {
  return t.hasOwnProperty("error");
}
export function isLifecycleCompleteEntry<T>(
  t: LifecycleEntry<T>
): t is LifecycleCompleteEntry {
  return t.hasOwnProperty("complete");
}
export function isLifecycleContinuesEntry<T>(
  t: LifecycleEntry<T>
): t is LifecycleContinuesEntry {
  return t.hasOwnProperty("continues");
}
export function isLifecycleStartEntry<T>(
  t: LifecycleEntry<T>
): t is LifecycleStartEntry {
  return t.hasOwnProperty("start");
}
export function isLifecycleTerminatorEntry<T>(
  t: LifecycleEntry<T>
): t is LifecycleErrorEntry | LifecycleCompleteEntry {
  return (
    isLifecycleErrorEntry(t) ||
    isLifecycleCompleteEntry(t) ||
    isLifecycleContinuesEntry(t)
  );
}

function createDatum<T>(datum: T): LifecycleDatumEntry<T> {
  return { datum };
}

function createError(error: any): LifecycleErrorEntry {
  return { error };
}

function createCompleted(): LifecycleCompleteEntry {
  return { complete: true };
}

function createContinues(): LifecycleContinuesEntry {
  return { continues: true };
}

function createStarted(): LifecycleStartEntry {
  return { start: true };
}

export function recordLifecycle<T>(
  timeout?: number,
  scheduler?: SchedulerLike
): OperatorFunction<T, LifecycleEntry<T>> {
  return (orig: Observable<T>) => {
    const mainObservable = concat(
      orig.pipe(map(createDatum), startWith(createStarted())),
      of(createCompleted())
    ).pipe(catchError(err => of(createError(err))));
    if (timeout === undefined) return mainObservable;
    const other = of(createContinues()).pipe(delay(timeout, scheduler));

    return new Observable<LifecycleEntry<T>>(obs => {
      const subscription = merge(mainObservable, other)
        .pipe(
          tap(entry => {
            obs.next(entry);
            if (isLifecycleTerminatorEntry(entry)) {
              subscription.unsubscribe();
            }
          })
        )
        .subscribe();

      return () => subscription.unsubscribe();
    });
  };
}
