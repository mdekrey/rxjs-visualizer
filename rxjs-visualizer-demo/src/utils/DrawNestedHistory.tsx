import React, { useMemo, ComponentType } from 'react';
import { ObservableChainData, observableDatumType, LifecycleEntry, WithTime } from 'rxjs-visualizer';
import { sortRxHistory } from './useRxHistory';
import { DrawTimeHistoryProps, DrawTimeHistory } from './DrawTimeHistory';
import { lifecycleSvgSortOrder } from './lifecycleSvgSortOrder';
import { LifetimePlaceholder } from './NodeOrTerminator';

export type DrawNestedHistoryProps<TDatum, TTheme, TBase extends DrawTimeHistoryProps<TDatum, TTheme, any>> = {
    history: WithTime<ObservableChainData<TDatum>>[];
    children?: never;
    drawHistory?: ComponentType<TBase>;
} & Omit<TBase, "history">;

type HistoryEntry<TDatum, TBase extends DrawTimeHistoryProps<TDatum, any, any>> = {
    key: number;
    x: number;
    y: number;
    timeSizeFactorY: number;
} & Pick<TBase, "history">;

type HistoryEntryTemp<TDatum> = {
    key: number;
    history: WithTime<LifecycleEntry<TDatum> | LifetimePlaceholder>[];
    x: number;
    y: number;
    timeSizeFactorY: number;
};

export function DrawNestedHistory<TDatum, TTheme, TBase extends DrawTimeHistoryProps<TDatum, TTheme, any>>({
    history,
    drawHistory = DrawTimeHistory,
    timeSizeFactorX,
    timeSizeFactorY,
    timeOffset,
    ...props
}: DrawNestedHistoryProps<TDatum, TTheme, TBase>) {
    const observables: HistoryEntry<TDatum, TBase>[] = useMemo(() => {
        const wip = history.reduce((prev, next) => {
            prev[next.original.observable] = prev[next.original.observable] || {
                key: next.original.observable,
                history: [],
                x: 0,
                y: 0,
                timeSizeFactorY: 0
            };
            if (next.original.type === observableDatumType) {
                prev[next.original.observable].history.push({ time: next.time, original: next.original.datum });
            } else {
                prev[next.original.observable].history.push({ time: next.time, original: LifetimePlaceholder });
                let newTimeFactorY = prev[next.original.observable].timeSizeFactorY + timeSizeFactorX;
                prev[next.original.child] = {
                    key: next.original.child,
                    history: [],
                    x: 0,
                    y: prev[next.original.observable].y - newTimeFactorY * (next.time - timeOffset),
                    timeSizeFactorY: prev[next.original.observable].timeSizeFactorY + timeSizeFactorX,
                };
            }
            return prev;
        }, [] as HistoryEntryTemp<TDatum>[]);
        return wip.map(({ history, ...others }) => ({
            history: sortRxHistory(history, lifecycleSvgSortOrder),
            ...others
        }));
    }, [history]);
    console.log(observables);

    const DrawHistory = drawHistory as ComponentType<any>;
    return (
        <g>
            {observables.map(({ key, history, x, y, timeSizeFactorY }) =>
                <g key={key} style={{ transform: `translate(${x}px, ${y}px)` }}>
                    <DrawHistory history={history} timeOffset={timeOffset} {...props} timeSizeFactorY={timeSizeFactorY} timeSizeFactorX={timeSizeFactorX} />
                </g>)}
        </g>
    );
}
