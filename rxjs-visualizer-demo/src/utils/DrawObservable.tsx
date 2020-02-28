import React, { useMemo, ReactChild, ElementType } from 'react';
import { Observable } from 'rxjs';
import { LifecycleEntry, isLifecycleDatumEntry, isLifecycleCompleteEntry, LifecycleDatumEntry, accumulate, isLifecycleTerminatorEntry } from 'rxjs-visualizer';
import './DrawObservable.css';
import { useRx } from './useRx';

export interface DrawObservableProps<T extends LifecycleEntry<any>> {
    target: Observable<T>;
    x: (datum: T, index: number) => number;
    keyGenerator?: (datum: T extends LifecycleDatumEntry<infer U> ? U : never, index: number) => string | number;
    element: (datum: T extends LifecycleDatumEntry<infer U> ? U : never, index: number) => ReactChild;
    children?: never;
    completeTerminator?: ElementType<{}>;
    errorTerminator?: ElementType<{}>;
}

function index(_: unknown, idx: number) { return idx }

const markerSize = '1.28rem';
function CompleteTerminator() {
    return <line x1={0} x2={0} y1={`-${markerSize}`} y2={markerSize} className="DrawObservable" />;
}
function ErrorTerminator() {
    return (
        <>
            <line x1={`-${markerSize}`} x2={markerSize} y1={`-${markerSize}`} y2={markerSize} className="DrawObservable error" />
            <line x1={markerSize} x2={`-${markerSize}`} y1={`-${markerSize}`} y2={markerSize} className="DrawObservable error" />
        </>
    );
}

export function DrawObservable<T extends LifecycleEntry<any>>({
    target,
    x,
    keyGenerator = index,
    element,
    completeTerminator: CompleteElem = CompleteTerminator,
    errorTerminator: ErrorElem = ErrorTerminator
}: DrawObservableProps<T>) {
    const accumulated = useMemo(() => target.pipe(accumulate()), [target]);
    const history = useRx(accumulated, []);
    const terminator = history.filter(isLifecycleTerminatorEntry) as (T extends LifecycleDatumEntry<infer _U> ? never : T)[];
    const data = history.filter(isLifecycleDatumEntry) as (T extends LifecycleDatumEntry<infer _U> ? T : never)[];
    const lineMin = Math.min(Number.MAX_SAFE_INTEGER, ...history.map((datum, index) => x(datum, index)));
    const lineMax = Math.max(lineMin, ...history.map((datum, index) => x(datum, index)));

    return (
        <g>
            <line x1={lineMin} x2={lineMax} y1={0} y2={0} className="DrawObservable" />
            {terminator.map(
                (e, index) =>
                    <g key={"terminator"} style={{ transform: `translate(${x(e, index)}px, 0px)` }}>
                        {isLifecycleCompleteEntry(e) ? <CompleteElem /> : <ErrorElem />}
                    </g>
            )}
            {data.map(
                (e, index) =>
                    <g key={keyGenerator(e.datum, index)} style={{ transform: `translate(${x(e, index)}px, 0px)` }}>
                        {element(e.datum, index)}
                    </g>
            )}
        </g>
    );
}
