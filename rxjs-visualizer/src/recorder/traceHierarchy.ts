import { Observable, isObservable, OperatorFunction, of, UnaryFunction } from "rxjs";
import { concatAll, map, startWith } from "rxjs/operators";

export const observableReferenceType = "ref";
export interface ObservableReference {
    type: typeof observableReferenceType;
    observable: number;
    child: number;
}

export const observableDatumType = "datum";
export interface ObservableDatum<T> {
    type: typeof observableDatumType;
    observable: number;
    data: T extends Observable<any> ? never : T;
}
type SafeObservableDatum<T> =  T extends Observable<any> ? never : ObservableDatum<T>;

type UnrollObservable<T> =
    T extends Observable<infer U> ? U : T;

export type ObservableChainData<T> =
    | ObservableReference
    | ObservableDatum<UnrollObservable<UnrollObservable<UnrollObservable<UnrollObservable<UnrollObservable<T>>>>>>;

export function traceHierarchy<T>(): OperatorFunction<T, ObservableChainData<T>> {
    let nextObservable = 0;
    function dothething<T>(currentIndex: number) {
        return (orig: Observable<T>): Observable<ObservableChainData<T>> => orig.pipe(
            map((data: any): Observable<any> => {
                if (isObservable<any>(data)) {
                    const newIndex = nextObservable++;
                    return data.pipe(dothething(newIndex), startWith({ type: observableReferenceType, observable: currentIndex, child: newIndex }), );
                } else {
                    // This `as any` is becase TypeScript can't determine that `data` here is guaranteed not to be an Observable,
                    // despite the above `if` condition. So, TypeScript vanishes in a poof of logic.
                    return of({ type: observableDatumType, observable: currentIndex, data: data as any });
                }
            }),
            concatAll()
        ) as Observable<any>;
    }

    return dothething(nextObservable++);
}
