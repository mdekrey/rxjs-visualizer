import React, { ElementType } from 'react';
import { indexKeyGenerator } from './indexKeyGenerator';

export type DrawObservableCallback<TDatum, TReturns> =
    (datum: TDatum, index: number) => TReturns;

export type DrawObservableElementProps<TDatum, TTheme> = { theme: TTheme, datum: TDatum, index: number };

export type DrawObservableHistoryProps<TDatum, TTheme> = {
    theme: TTheme;
    history: { datum: TDatum, index: number }[];
    x: DrawObservableCallback<TDatum, number>;
    y: DrawObservableCallback<TDatum, number>;
    keyGenerator?: DrawObservableCallback<TDatum, string | number>;
    element: ElementType<DrawObservableElementProps<TDatum, TTheme>>;
    children?: never;
    observableLine: ElementType<{ theme: TTheme, lineMinX: number, lineMaxX: number }>;
}

export function DrawObservableHistory<TDatum, TTheme>({
    element: Element,
    observableLine: LineElem,
    theme,
    keyGenerator = indexKeyGenerator,
    history,
    x,
    y,
}: DrawObservableHistoryProps<TDatum, TTheme>) {
    const lineMin = Math.min(Number.MAX_SAFE_INTEGER, ...history.map(({ datum, index }) => x(datum, index)));
    const lineMax = Math.max(lineMin, ...history.map(({ datum, index }) => x(datum, index)));

    return (
        <g>
            <LineElem theme={theme} lineMinX={lineMin} lineMaxX={lineMax} />
            {history.map(({ datum, index }) =>
                <g key={keyGenerator(datum, index)} style={{ transform: `translate(${x(datum, index)}px, ${y(datum, index)}px)` }}>
                    <Element theme={theme} datum={datum} index={index} />
                </g>
            )}
        </g>
    );
}
