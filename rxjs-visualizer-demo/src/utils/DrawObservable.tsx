import React, { useMemo, ReactChild, ElementType } from 'react';
import { Observable } from 'rxjs';
import { LifecycleEntry, isLifecycleDatumEntry, isLifecycleCompleteEntry, LifecycleDatumEntry, accumulate } from 'rxjs-visualizer';
import './DrawObservable.css';
import { useRx } from './useRx';

interface Position { x: number | string; y: number | string }

export interface DrawObservableProps<T extends LifecycleEntry<any>> {
    target: Observable<T>;
    y?: (datum: T, index: number) => number | string;
    x: (datum: T, index: number) => number | string;
    keyGenerator?: (datum: T extends LifecycleDatumEntry<infer U> ? U : never, index: number) => string | number;
    element: (datum: T extends LifecycleDatumEntry<infer U> ? U : never, index: number) => ReactChild;
    children?: never;
    completeTerminator?: ElementType<{}>;
    errorTerminator?: ElementType<{}>;
}

function zero() { return 0; }
function index(_: unknown, idx: number) { return idx }

const markerSize = '1.28rem';
function CompleteTerminator() {
    return <line x1={0} x2={0} y1={`-${markerSize}`} y2={markerSize} className="DrawObservable" />;
}
function ErrorTerminator() {
    return (
        <>
            <line x1={`-${markerSize}`} x2={markerSize} y1={`-${markerSize}`} y2={markerSize} className="error" />
            <line x1={markerSize} x2={`-${markerSize}`} y1={`-${markerSize}`} y2={markerSize} className="error" />
        </>
    );
}

export function DrawObservable<T extends LifecycleEntry<any>>({
    target,
    x,
    y = zero,
    keyGenerator = index,
    element,
    completeTerminator: CompleteElem = CompleteTerminator,
    errorTerminator: ErrorElem = ErrorTerminator
}: DrawObservableProps<T>) {
    const accumulated = useMemo(() => target.pipe(accumulate()), [target]);
    const history = useRx(accumulated, []);
    const terminator = history.filter(e => !isLifecycleDatumEntry(e)) as (T extends LifecycleDatumEntry<infer _U> ? never : T)[];
    const data = history.filter(isLifecycleDatumEntry) as (T extends LifecycleDatumEntry<infer _U> ? T : never)[];

    return (
        <g>
            {history.reduce<[Position, Position][]>((prev, datum, index) => [
                ...prev,
                [prev[prev.length - 1][1], { x: x(datum, index), y: y(datum, index) }]
            ], [[undefined!, undefined!]])
                .filter(([a]) => Boolean(a))
                .map(([start, end], index) =>
                    <line x1={start.x} x2={end.x} y1={start.y} y2={end.y} key={`line-${index}`} className="DrawObservable" />)}
            {terminator.map(
                (e, index) =>
                    <g key={"terminator"} style={{ transform: `translate(${x(e, index)}, ${y(e, index)})` }}>
                        {isLifecycleCompleteEntry(e) ? <CompleteElem /> : <ErrorElem />}
                    </g>
            )}
            {data.map(
                (e, index) =>
                    <g key={keyGenerator(e.datum, index)} style={{ transform: `translate(${x(e, index)}, ${y(e, index)})` }}>
                        {element(e.datum, index)}
                    </g>
            )}
        </g>
    );
}
