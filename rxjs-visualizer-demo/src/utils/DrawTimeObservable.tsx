import React, { useMemo } from "react";
import { Observable, asyncScheduler, SchedulerLike } from "rxjs";
import { recordLifecycle, addTime } from "rxjs-visualizer";
import { LifetimeTheme } from "./NodeOrTerminator";
import { useSortedRxHistory } from "./useRxHistory";
import { DrawTimeHistoryProps, DrawTimeHistory, DrawTimeHistoryBaseElemProps } from "./DrawTimeHistory";
import { lifecycleSvgSortOrder } from "./lifecycleSvgSortOrder";

export type DrawTimeObservableProps<T, TTheme extends LifetimeTheme<any>> =
    Omit<DrawTimeHistoryProps<T, TTheme, DrawTimeHistoryBaseElemProps<T, TTheme>>, "history" | "timeOffset"> & {
        target: Observable<T>;
        timeLimit: number;
        scheduler?: SchedulerLike;
    };

export function DrawTimeObservable<TDatum, TTheme extends LifetimeTheme<any>>({
        target,
        timeLimit,
        scheduler = asyncScheduler,
        ...props
    }: DrawTimeObservableProps<TDatum, TTheme>) {
    const {newTarget, timeOffset} = useMemo(() => ({
        newTarget: target.pipe(recordLifecycle(timeLimit), addTime(scheduler)),
        timeOffset: scheduler.now(),
    }), [target, timeLimit, scheduler]);
    const history = useSortedRxHistory(newTarget, lifecycleSvgSortOrder);
    return <DrawTimeHistory history={history} timeOffset={timeOffset} {...props} />;
}
