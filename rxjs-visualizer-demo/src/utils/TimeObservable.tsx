import React, { useMemo, useCallback } from "react";
import { Observable, asyncScheduler, SchedulerLike } from "rxjs";
import { map } from "rxjs/operators";
import { LifecycleEntry, recordLifecycle, addTime, collapseTime, HasTime } from "rxjs-visualizer";
import { DrawObservable, DrawObservableProps } from "./DrawObservable";

export type TimeObservableProps<T, TTheme> =
    Omit<DrawObservableProps<LifecycleEntry<T>, TTheme>, "x" | "target"> & {
        target: Observable<T>
        timeLimit: number;
        timeSizeFactor: number;
        scheduler?: SchedulerLike;
    };

export function TimeObservable<T, TTheme>({ target, timeLimit, timeSizeFactor, scheduler = asyncScheduler, ...props }: TimeObservableProps<T, TTheme>) {
    const {newTarget, timeOffset} = useMemo(() => ({
        newTarget: target.pipe(recordLifecycle(timeLimit), addTime(), map(collapseTime)),
        timeOffset: scheduler.now(),
    }), [target, timeLimit, scheduler]);
    const x = useCallback((d: HasTime) => (d && (d.time - timeOffset) * timeSizeFactor) || 0, [timeSizeFactor, timeOffset]);
    return (
        <DrawObservable {...props} target={newTarget} x={x} />
    )
}