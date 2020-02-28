import { Observable, isObservable, OperatorFunction, of } from "rxjs";
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

type UnrollObservable<T> =
    T extends Observable<infer U> ? U : T;

export type ObservableChainData<T> =
    | ObservableReference
    | ObservableDatum<LifecycleEntry<UnrollObservable<UnrollObservable<UnrollObservable<UnrollObservable<UnrollObservable<T>>>>>>>;

export function traceHierarchy<T>(): OperatorFunction<T, ObservableChainData<T>> {
    let nextObservable = 0;
    function dothething<T>(currentIndex: number) {
        return (orig: Observable<T>): Observable<ObservableChainData<T>> => orig.pipe(
            recordLifecycle(),
            map((data: LifecycleEntry<any>): Observable<any> => {
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
        ) as Observable<any>;
    }

    return dothething(nextObservable++);
}
