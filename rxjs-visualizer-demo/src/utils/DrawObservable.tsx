import React, { useMemo, ElementType } from 'react';
import { Observable } from 'rxjs';
import { accumulate } from 'rxjs-visualizer';
import { useRx } from './useRx';
import { indexKeyGenerator } from './indexKeyGenerator';

export type DrawObservableCallback<TEntry, TDatum, TReturns> =
    (datum: TDatum, index: number, fullEntry: TEntry) => TReturns;

export type DrawObservableElementProps<TEntry, TTheme, TDatum> = { theme: TTheme, datum: TDatum, entry: TEntry, index: number };

export interface DrawObservableProps<TEntry, TTheme, TDatum> {
    theme: TTheme;
    target: Observable<TEntry>;
    datumSelector: (entry: TEntry) => TDatum;
    sortOrder: DrawObservableCallback<TEntry, TDatum, number>;
    x: DrawObservableCallback<TEntry, TDatum, number>;
    y: DrawObservableCallback<TEntry, TDatum, number>;
    keyGenerator?: DrawObservableCallback<TEntry, TDatum, string | number>;
    element: ElementType<DrawObservableElementProps<TEntry, TTheme, TDatum>>;
    children?: never;
    observableLine: ElementType<{ theme: TTheme, lineMinX: number, lineMaxX: number }>;
}

export function DrawObservable<TEntry, TTheme, TDatum>({
    theme,
    target,
    sortOrder,
    datumSelector,
    x,
    y,
    keyGenerator = indexKeyGenerator,
    element: Element,
    observableLine: LineElem,
}: DrawObservableProps<TEntry, TTheme, TDatum>) {
    const accumulated = useMemo(() => target.pipe(accumulate()), [target]);
    const history = useRx(accumulated, []);
    const sorted = useMemo(() => history.map((entry, index) => {
        const datum = datumSelector(entry);
        return { entry, datum, index, sort: sortOrder(datum, index, entry) };
    }).sort((a, b) => a.sort - b.sort), [history, datumSelector, sortOrder]);
    const lineMin = Math.min(Number.MAX_SAFE_INTEGER, ...sorted.map(({ datum, index, entry }) => x(datum, index, entry)));
    const lineMax = Math.max(lineMin, ...sorted.map(({ datum, index, entry }) => x(datum, index, entry)));

    return (
        <g>
            <LineElem theme={theme} lineMinX={lineMin} lineMaxX={lineMax} />
            {sorted.map(({ datum, entry, index }) =>
                <g key={keyGenerator(datum, index, entry)} style={{ transform: `translate(${x(datum, index, entry)}px, ${y(datum, index, entry)}px)` }}>
                    <Element theme={theme} datum={datum} index={index} entry={entry} />
                </g>
            )}
        </g>
    );
}
