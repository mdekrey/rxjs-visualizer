import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { accumulate } from "./accumulate";

export function recordAsync<T>(observable: Observable<T>) {
    return new Promise<T[]>(resolve => observable.pipe(accumulate(), take(1)).subscribe(resolve));
}