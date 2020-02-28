import { OperatorFunction } from "rxjs";
import { scan } from "rxjs/operators";

export function accumulate<T>(): OperatorFunction<T, T[]> {
    return scan((acc, next) => [...acc, next], [] as T[]);
}
