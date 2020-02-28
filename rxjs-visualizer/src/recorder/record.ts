import { Observable } from "rxjs";
import { accumulate } from "./accumulate";

export function record<T>(observable: Observable<T>, beforeReturn?: (() => void)) {
    let value: T[] | undefined;
    const subscription = observable.pipe(accumulate()).subscribe(v => value = v);
    try {
        if (beforeReturn) {
            beforeReturn();
        }
        return value;
    } finally {
        subscription.unsubscribe();
    }
}