import React, { ElementType } from 'react';
import { indexKeyGenerator } from './indexKeyGenerator';

export type DrawCallback<TDatum, TReturns> =
    (datum: TDatum, index: number) => TReturns;

export type DrawElementProps<TDatum, TTheme> = { theme: TTheme, datum: TDatum, index: number };

export type DrawHistoryProps<TDatum, TTheme> = {
    theme: TTheme;
    history: { datum: TDatum, index: number }[];
    x: DrawCallback<TDatum, number>;
    y: DrawCallback<TDatum, number>;
    keyGenerator?: DrawCallback<TDatum, string | number>;
    element: ElementType<DrawElementProps<TDatum, TTheme>>;
    children?: never;
    observableLine: ElementType<{ theme: TTheme, lineMinX: number, lineMaxX: number, lineMinY: number, lineMaxY: number }>;
}

export function DrawHistory<TDatum, TTheme>({
    element: Element,
    observableLine: LineElem,
    theme,
    keyGenerator = indexKeyGenerator,
    history,
    x,
    y,
}: DrawHistoryProps<TDatum, TTheme>) {
    const lineMinX = Math.min(Number.MAX_SAFE_INTEGER, ...history.map(({ datum, index }) => x(datum, index)));
    const lineMaxX = Math.max(lineMinX, ...history.map(({ datum, index }) => x(datum, index)));
    const lineMinY = Math.min(Number.MAX_SAFE_INTEGER, ...history.map(({ datum, index }) => y(datum, index)));
    const lineMaxY = Math.max(lineMinY, ...history.map(({ datum, index }) => y(datum, index)));

    return (
        <g>
            <LineElem theme={theme} lineMinX={lineMinX} lineMaxX={lineMaxX} lineMinY={lineMinY} lineMaxY={lineMaxY} />
            {history.map(({ datum, index }) =>
                <g key={keyGenerator(datum, index)} style={{ transform: `translate(${x(datum, index)}px, ${y(datum, index)}px)` }}>
                    <Element theme={theme} datum={datum} index={index} />
                </g>
            )}
        </g>
    );
}
