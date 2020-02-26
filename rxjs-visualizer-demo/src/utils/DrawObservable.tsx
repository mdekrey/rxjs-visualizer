import React, { useMemo, ReactChild } from 'react';
import { Observable } from 'rxjs';
import { recordAsync } from 'rxjs-visualizer';
import { usePromise } from './usePromise';

export interface DrawObservableProps<T> {
    target: Observable<T>;
    x: (datum: T, index: number) => number;
    keyGenerator: (datum: T, index: number) => string | number;
    element: (datum: T, index: number) => ReactChild;
    children?: never;
}

export function DrawObservable<T>({ target, x, keyGenerator, element }: DrawObservableProps<T>) {
    const historyPromise = useMemo(() => recordAsync(target), [target]);
    const history = usePromise(historyPromise, []);

    return (
        <g>
            {history.map(
                (datum, index) =>
                    <g key={keyGenerator(datum, index)} style={{ transform: `translate(${x(datum, index)}px, 0px)` }}>
                        {element(datum, index)}
                    </g>
            )}
        </g>
    );
}
