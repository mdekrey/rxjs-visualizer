import React, { useMemo, ElementType } from 'react';
import { Observable } from 'rxjs';
import { LifecycleEntry, isLifecycleDatumEntry, isLifecycleCompleteEntry, isLifecycleContinuesEntry, LifecycleDatumEntry, accumulate, isLifecycleTerminatorEntry, isLifecycleErrorEntry } from 'rxjs-visualizer';
import { useRx } from './useRx';

export interface DrawObservableProps<T extends LifecycleEntry<any>, TTheme> {
    theme: TTheme;
    target: Observable<T>;
    x: (datum: T, index: number) => number;
    keyGenerator: (datum: T extends LifecycleDatumEntry<infer U> ? U : never, index: number) => string | number;
    element: ElementType<{ theme: TTheme, datum: T extends LifecycleDatumEntry<infer U> ? U : never, index: number }>;
    children?: never;
    completeTerminator: ElementType<{ theme: TTheme }>;
    errorTerminator: ElementType<{ theme: TTheme }>;
    continuationTerminator: ElementType<{ theme: TTheme }>;
    observableLine: ElementType<{ theme: TTheme, lineMinX: number, lineMaxX: number }>;
}

export const markerSize = 1.28;
export function DrawObservable<T extends LifecycleEntry<any>, TTheme>({
    theme,
    target,
    x,
    keyGenerator,
    element: Element,
    completeTerminator: CompleteElem,
    errorTerminator: ErrorElem,
    continuationTerminator: ContinuationElem,
    observableLine: LineElem,
}: DrawObservableProps<T, TTheme>) {
    const accumulated = useMemo(() => target.pipe(accumulate()), [target]);
    const history = useRx(accumulated, []);
    const terminator = history.filter(isLifecycleTerminatorEntry) as (T extends LifecycleDatumEntry<infer _U> ? never : T)[];
    const data = history.filter(isLifecycleDatumEntry) as (T extends LifecycleDatumEntry<infer _U> ? T : never)[];
    const lineMin = Math.min(Number.MAX_SAFE_INTEGER, ...history.map((datum, index) => x(datum, index)));
    const lineMax = Math.max(lineMin, ...history.map((datum, index) => x(datum, index)));

    return (
        <g>
            <LineElem theme={theme} lineMinX={lineMin} lineMaxX={lineMax} />
            {terminator.map(
                (e, index) =>
                    <g key={"terminator"} style={{ transform: `translate(${x(e, index)}px, 0px)` }}>
                        {isLifecycleCompleteEntry(e) ? <CompleteElem theme={theme} />
                            : isLifecycleErrorEntry(e) ? <ErrorElem theme={theme} />
                        : isLifecycleContinuesEntry(e) ? <ContinuationElem theme={theme} />
                    : null}
                    </g>
            )}
            {data.map(
                (e, index) =>
                    <g key={keyGenerator(e.datum, index)} style={{ transform: `translate(${x(e, index)}px, 0px)` }}>
                        <Element theme={theme} datum={e.datum} index={index} />
                    </g>
            )}
        </g>
    );
}
