import { Observable, OperatorFunction, concat, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

export type LifecycleEntry<T> =
    | LifecycleDatumEntry<T>
    | LifecycleErrorEntry
    | LifecycleCompleteEntry;
export interface LifecycleDatumEntry<T> {
    datum: T;
}
export interface LifecycleErrorEntry {
    error: any;
}
export interface LifecycleCompleteEntry {
    complete: true;
}
export function isLifecycleDatumEntry<T>(t: LifecycleEntry<T>): t is LifecycleDatumEntry<T> {
    return t.hasOwnProperty("datum");
}
export function isLifecycleErrorEntry<T>(t: LifecycleEntry<T>): t is LifecycleErrorEntry {
    return t.hasOwnProperty("error");
}
export function isLifecycleCompleteEntry<T>(t: LifecycleEntry<T>): t is LifecycleCompleteEntry {
    return t.hasOwnProperty("complete");
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

export function recordLifecycle<T>(
): OperatorFunction<T, LifecycleEntry<T>> {
  return (orig: Observable<T>) => concat(
      orig.pipe(map(createDatum)),
      of(createCompleted())
  ).pipe(catchError(err => of(createError(err))));
}

