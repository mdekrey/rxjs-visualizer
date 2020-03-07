import { Observable, isObservable, OperatorFunction, of, PartialObserver, Unsubscribable, UnaryFunction } from "rxjs";
import { mergeAll, map, startWith } from "rxjs/operators";
import { LifecycleEntry, recordLifecycle, isLifecycleDatumEntry } from "./recordLifecycle";

export const observableReferenceType = "ref";
export interface ObservableReference {
    type: typeof observableReferenceType;
    observable: number;
    child: number;
}
function createRef(observable: number, child: number): ObservableReference {
    return { type: observableReferenceType, observable, child };
}

export const observableDatumType = "datum";
export interface ObservableDatum<T> {
    type: typeof observableDatumType;
    observable: number;
    datum: T extends Observable<any> ? never : T;
}
function createDatum<T>(observable: number, datum: T): ObservableDatum<T> {
    return { type: observableDatumType, observable, datum: datum as any };
}

export type NestedObservable<T> = Observable<T | NestedObservable<T>>;

export type ObservableChainData<T> =
    | ObservableReference
    | ObservableDatum<LifecycleEntry<T>>;

export function traceHierarchy<T>(timeout?: number): OperatorFunction<T | NestedObservable<T>, ObservableChainData<T>> {
    let nextObservable = 0;
    function dothething<T>(currentIndex: number) {
        return (orig: NestedObservable<T>): Observable<ObservableChainData<T>> => orig.pipe(
            recordLifecycle(timeout),
            map((data: LifecycleEntry<T | NestedObservable<T>>): Observable<any> => {
                if (isLifecycleDatumEntry(data) && isObservable<any>(data.datum)) {
                    const newIndex = nextObservable++;
                    return data.datum.pipe(dothething(newIndex), startWith(createRef(currentIndex, newIndex)), );
                } else {
                    // This `as any` is becase TypeScript can't determine that `data` here is guaranteed not to be an Observable,
                    // despite the above `if` condition. So, TypeScript vanishes in a poof of logic.
                    return of(createDatum(currentIndex, data as any));
                }
            }),
            mergeAll()
        );
    }

    return dothething(nextObservable++);
}
