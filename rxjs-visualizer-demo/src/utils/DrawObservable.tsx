import React, { useMemo, ReactChild, ElementType } from 'react';
import { Observable } from 'rxjs';
import { recordAsync, LifecycleEntry, isLifecycleDatumEntry, isLifecycleCompleteEntry } from 'rxjs-visualizer';
import { usePromise } from './usePromise';
import './DrawObservable.css';

interface Position { x: number; y: number }

export interface DrawObservableProps<T> {
    target: Observable<LifecycleEntry<T>>;
    y?: (datum: T | undefined, index: number) => number;
    x: (datum: T | undefined, index: number) => number;
    keyGenerator?: (datum: T, index: number) => string | number;
    element: (datum: T, index: number) => ReactChild;
    children?: never;
    completeTerminator?: ElementType<{}>;
    errorTerminator?: ElementType<{}>;
}

function zero() { return 0; }
function index(_: unknown, idx: number) { return idx }

function lifecycleToDatum<T>(e: LifecycleEntry<T>): T | undefined {
    return isLifecycleDatumEntry(e) ? e.datum : undefined;
}

const markerSize = 3.6;
function CompleteTerminator() {
    return <line x1={0} x2={0} y1={-markerSize / 2} y2={markerSize / 2} className="DrawObservable" />;
}
function ErrorTerminator() {
    return (
        <>
            <line x1={-markerSize / 2} x2={markerSize / 2} y1={-markerSize / 2} y2={markerSize / 2} className="error" />
            <line x1={markerSize / 2} x2={-markerSize / 2} y1={-markerSize / 2} y2={markerSize / 2} className="error" />
        </>
    );
}

export function DrawObservable<T>({
    target,
    x,
    y = zero,
    keyGenerator = index,
    element,
    completeTerminator: CompleteElem = CompleteTerminator,
    errorTerminator: ErrorElem = ErrorTerminator
}: DrawObservableProps<T>) {
    const historyPromise = useMemo(() => recordAsync(target), [target]);
    const history = usePromise(historyPromise, []);

    return (
        <g>
            {history.reduce<[Position, Position][]>((prev, datum, index) => [
                ...prev,
                [prev[prev.length - 1][1],  { x: x(lifecycleToDatum(datum), index), y: y(lifecycleToDatum(datum), index) }]
            ], [[undefined!, undefined!]])
                    .filter(([a]) => Boolean(a))
                    .map(([start, end], index) =>
                    <line x1={start.x} x2={end.x} y1={start.y} y2={end.y} key={`line-${index}`} className="DrawObservable" />)}
            {history.map(
                (e, index) =>
                isLifecycleDatumEntry(e) ?
                    <g key={keyGenerator(e.datum, index)} style={{ transform: `translate(${x(e.datum, index)}px, ${y(e.datum, index)}px)` }}>
                        {element(e.datum, index)}
                    </g>
                    : <g key={"terminator"} style={{ transform: `translate(${x(undefined, index)}px, ${y(undefined, index)}px)` }}>
                    {isLifecycleCompleteEntry(e) ? <CompleteElem /> : <ErrorElem />}
                </g>
            )}
        </g>
    );
}
