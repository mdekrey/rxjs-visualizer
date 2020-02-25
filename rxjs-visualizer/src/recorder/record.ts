import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { accumulate } from "./accumulate";

export function record<T>(observable: Observable<T>) {
    let value: T[] | undefined;
    observable.pipe(accumulate(), take(1)).subscribe(v => value = v);
    return value;
}