import React, { useMemo } from 'react';
import { DrawNestedHistoryProps, DrawNestedHistory } from './DrawNestedHistory';
import { useRxHistory } from './useRxHistory';
import { traceHierarchy, NestedObservable, addTime } from 'rxjs-visualizer';
import { DrawTimeHistoryProps } from './DrawTimeHistory';
import { SchedulerLike, asyncScheduler } from 'rxjs';

export type DrawNestedObservableProps<TDatum, TTheme, TBase extends DrawTimeHistoryProps<TDatum, TTheme, any>> = {
    target: NestedObservable<TDatum>;
    timeLimit: number;
    scheduler?: SchedulerLike;
} & Omit<TBase, "history" | "timeOffset">;

export function DrawNestedObservable<TDatum, TTheme, TBase extends DrawTimeHistoryProps<TDatum, TTheme, any>>({
    target,
    timeLimit,
    scheduler = asyncScheduler,
    ...props
}: DrawNestedObservableProps<TDatum, TTheme, TBase>) {

    const {hierarchy, timeOffset} = useMemo(() => ({
        hierarchy: target.pipe(traceHierarchy(timeLimit), addTime(scheduler)),
        timeOffset: scheduler.now(),
    }), [target, timeLimit, scheduler]);
    const history = useRxHistory(hierarchy);
    return <DrawNestedHistory history={history} timeOffset={timeOffset} {...props} />;
}
