import React, { useMemo, ElementType } from 'react';
import { Observable } from 'rxjs';
import { accumulate } from 'rxjs-visualizer';
import { useRx } from './useRx';
import { indexKeyGenerator } from './indexKeyGenerator';

export type DrawObservableCallback<TDatum, TReturns> =
    (datum: TDatum, index: number) => TReturns;

export type DrawObservableElementProps<TDatum, TTheme> = { theme: TTheme, datum: TDatum, index: number };

export interface DrawObservableProps<TDatum, TTheme> {
    theme: TTheme;
    target: Observable<TDatum>;
    sortOrder: DrawObservableCallback<TDatum, number>;
    x: DrawObservableCallback<TDatum, number>;
    y: DrawObservableCallback<TDatum, number>;
    keyGenerator?: DrawObservableCallback<TDatum, string | number>;
    element: ElementType<DrawObservableElementProps<TDatum, TTheme>>;
    children?: never;
    observableLine: ElementType<{ theme: TTheme, lineMinX: number, lineMaxX: number }>;
}

export function DrawObservable<TDatum, TTheme>({
    theme,
    target,
    sortOrder,
    x,
    y,
    keyGenerator = indexKeyGenerator,
    element: Element,
    observableLine: LineElem,
}: DrawObservableProps<TDatum, TTheme>) {
    const accumulated = useMemo(() => target.pipe(accumulate()), [target]);
    const history = useRx(accumulated, []);
    const sorted = useMemo(
        () =>
            history.map((datum, index) => ({ datum, index, sort: sortOrder(datum, index) }))
                .sort((a, b) => a.sort - b.sort),
        [history, sortOrder]
    );
    const lineMin = Math.min(Number.MAX_SAFE_INTEGER, ...sorted.map(({ datum, index }) => x(datum, index)));
    const lineMax = Math.max(lineMin, ...sorted.map(({ datum, index }) => x(datum, index)));

    return (
        <g>
            <LineElem theme={theme} lineMinX={lineMin} lineMaxX={lineMax} />
            {sorted.map(({ datum, index }) =>
                <g key={keyGenerator(datum, index)} style={{ transform: `translate(${x(datum, index)}px, ${y(datum, index)}px)` }}>
                    <Element theme={theme} datum={datum} index={index} />
                </g>
            )}
        </g>
    );
}
