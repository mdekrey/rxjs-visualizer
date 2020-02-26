import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { accumulate } from "./accumulate";

export function record<T>(observable: Observable<T>, beforeReturn?: (() => void)) {
    let value: T[] | undefined;
    observable.pipe(accumulate(), take(1)).subscribe(v => value = v);
    if (beforeReturn) {
        beforeReturn();
    }
    return value;
}