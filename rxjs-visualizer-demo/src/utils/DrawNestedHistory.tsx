import React, { useMemo, ComponentType } from 'react';
import { ObservableChainData, observableDatumType, LifecycleEntry, WithTime } from 'rxjs-visualizer';
import { sortRxHistory } from './useRxHistory';
import { DrawTimeHistoryProps, DrawTimeHistory } from './DrawTimeHistory';
import { lifecycleSvgSortOrder } from './lifecycleSvgSortOrder';

export type DrawNestedHistoryProps<TDatum, TTheme, TBase extends DrawTimeHistoryProps<TDatum, TTheme, any>> = {
    history: WithTime<ObservableChainData<TDatum>>[];
    children?: never;
    drawHistory?: ComponentType<TBase>;
} & Omit<TBase, "history">;

type HistoryEntry<TDatum, TBase extends DrawTimeHistoryProps<TDatum, any, any>> = {
    key: number;
} & Pick<TBase, "history">;

type HistoryEntryTemp<TDatum> = {
    key: number;
    history: WithTime<LifecycleEntry<TDatum>>[];
};

export function DrawNestedHistory<TDatum, TTheme, TBase extends DrawTimeHistoryProps<TDatum, TTheme, any>>({
    history,
    drawHistory = DrawTimeHistory,
    ...props
}: DrawNestedHistoryProps<TDatum, TTheme, TBase>) {
    const observables: HistoryEntry<TDatum, TBase>[] = useMemo(() => {
        const wip = history.reduce((prev, next) => {
            prev[next.original.observable] = prev[next.original.observable] || {
                key: next.original.observable,
                history: []
            };
            if (next.original.type === observableDatumType) {
                prev[next.original.observable].history.push({ time: next.time, original: next.original.datum });
            } else {
                prev[next.original.observable].history.push({ time: next.time, original: { continues: true } });
                prev[next.original.child] = {
                    key: next.original.child,
                    history: [],
                };
            }
            return prev;
        }, [] as HistoryEntryTemp<TDatum>[]);
        return wip.map(({ history, ...others }) => ({
            history: sortRxHistory(history, lifecycleSvgSortOrder),
            ...others
        }));
    }, [history]);

    const DrawHistory = drawHistory as ComponentType<any>;
    return (
        <g>
            {observables.map(({ key, history }) => <g>
                <DrawHistory key={key} history={history} {...props} />
            </g>)}
        </g>
    );
}
