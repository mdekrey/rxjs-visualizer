import { OperatorFunction } from "rxjs";
import { reduce } from "rxjs/operators";

export function accumulate<T>(): OperatorFunction<T, T[]> {
    return reduce((acc, next) => [...acc, next], [] as T[]);
}
