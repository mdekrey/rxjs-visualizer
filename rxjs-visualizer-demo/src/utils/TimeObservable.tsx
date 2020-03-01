import React, { useMemo, useCallback, ElementType } from "react";
import { Observable, asyncScheduler, SchedulerLike } from "rxjs";
import { LifecycleEntry, recordLifecycle, addTime, WithTime, isLifecycleDatumEntry } from "rxjs-visualizer";
import { DrawObservable, DrawObservableProps, DrawObservableElementProps } from "./DrawObservable";
import { NodeOrTerminator, LifetimeTheme } from "./NodeOrTerminator";

export type TimeObservableProps<T, TTheme extends LifetimeTheme<any>> =
    Omit<DrawObservableProps<WithTime<LifecycleEntry<T>>, TTheme>, "x" | "target" | "y" | "datumSelector" | "sortOrder" | "element"> & {
        target: Observable<T>
        timeLimit: number;
        timeSizeFactor: number;
        scheduler?: SchedulerLike;
        observableRenderer?: ElementType<DrawObservableProps<WithTime<LifecycleEntry<T>>, TTheme>>;
        element: ElementType<DrawObservableElementProps<T, TTheme>>;
    };

function sortOrder<T>({original}: WithTime<LifecycleEntry<T>>, _2: any) {
    return isLifecycleDatumEntry(original) ? 1 : 0;
}

function TimeDatumSelector<TDatum, TTheme>(
    BaseElement: ElementType<DrawObservableElementProps<TDatum, TTheme>>
): ElementType<DrawObservableElementProps<WithTime<TDatum>, TTheme>> {
    return ({ datum, ...props }) => {
        return (
            <BaseElement {...props} datum={datum.original} />
        );
    };
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
        newTarget: target.pipe(recordLifecycle(timeLimit), addTime()),
        timeOffset: scheduler.now(),
    }), [target, timeLimit, scheduler]);
    const x = useCallback((d: WithTime<LifecycleEntry<T>>, _2) => (d && (d.time - timeOffset) * timeSizeFactor) || 0, [timeSizeFactor, timeOffset]);
    const resultElement = useMemo(() => TimeDatumSelector(NodeOrTerminator(element)), [element]);
    return (
        <ObservableElem
            {...props}
            target={newTarget}
            x={x}
            y={() => 0}
            sortOrder={sortOrder}
            element={resultElement} />
    )
}
