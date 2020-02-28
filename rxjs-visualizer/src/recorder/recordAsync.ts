import { Observable, of, SchedulerLike } from "rxjs";
import { takeUntil, delay, last, tap } from "rxjs/operators";
import { accumulate } from "./accumulate";

export function recordAsync<T>(observable: Observable<T>, timeout: number, scheduler?: SchedulerLike | undefined) {
    return new Promise<T[]>(
        (resolve, reject) =>
            observable
                .pipe(
                    accumulate(),
                    takeUntil(delay(timeout, scheduler)(of(0))),
                    last()
                )
                .subscribe(resolve, reject)
    );
}
