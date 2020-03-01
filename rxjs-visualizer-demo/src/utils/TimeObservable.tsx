import React, { useMemo, useCallback, ElementType } from "react";
import { Observable, asyncScheduler, SchedulerLike } from "rxjs";
import { map } from "rxjs/operators";
import { LifecycleEntry, recordLifecycle, addTime, collapseTime, HasTime, isLifecycleDatumEntry } from "rxjs-visualizer";
import { DrawObservable, DrawObservableProps, DrawObservableElementProps } from "./DrawObservable";
import { NodeOrTerminator, LifetimeTheme } from "./NodeOrTerminator";

export type TimeObservableProps<T, TTheme extends LifetimeTheme<any>> =
    Omit<DrawObservableProps<LifecycleEntry<T> & HasTime, TTheme, T>, "x" | "target" | "y" | "datumSelector" | "sortOrder" | "element"> & {
        target: Observable<T>
        timeLimit: number;
        timeSizeFactor: number;
        scheduler?: SchedulerLike;
        observableRenderer?: ElementType<DrawObservableProps<LifecycleEntry<T> & HasTime, TTheme, T>>;
        element: ElementType<DrawObservableElementProps<LifecycleEntry<T> & HasTime, TTheme, T>>;
    };

function sortOrder<T>(_1: any, _2: any, orig: LifecycleEntry<T> & HasTime) {
    return isLifecycleDatumEntry(orig) ? 1 : 0;
}
function datumSelector<T>(orig: LifecycleEntry<T> & HasTime) {
    return isLifecycleDatumEntry(orig) ? orig.datum : null!;
}

export function TimeObservable<T, TTheme extends LifetimeTheme<any>>({
        target,
        timeLimit,
        timeSizeFactor,
        scheduler = asyncScheduler,
        observableRenderer: ObservableElem = DrawObservable,
        element,
        ...props
    }: TimeObservableProps<T, TTheme>) {
    const {newTarget, timeOffset} = useMemo(() => ({
        newTarget: target.pipe(recordLifecycle(timeLimit), addTime(), map(collapseTime)),
        timeOffset: scheduler.now(),
    }), [target, timeLimit, scheduler]);
    const x = useCallback((_1, _2, d: HasTime) => (d && (d.time - timeOffset) * timeSizeFactor) || 0, [timeSizeFactor, timeOffset]);
    return (
        <ObservableElem
            {...props}
            target={newTarget}
            x={x}
            y={() => 0}
            datumSelector={datumSelector}
            sortOrder={sortOrder}
            element={NodeOrTerminator(element)} />
    )
}