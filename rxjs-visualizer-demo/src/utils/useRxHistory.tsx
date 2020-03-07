import { useMemo } from 'react';
import { Observable } from 'rxjs';
import { accumulate } from 'rxjs-visualizer';
import { useRx } from './useRx';
import { DrawCallback } from './DrawHistory';

export type SortedHistoryEntry<TDatum> = {
    index: number,
    datum: TDatum
};

export function useRxHistory<TDatum>(target: Observable<TDatum>): TDatum[] {
    const accumulated = useMemo(() => target.pipe(accumulate()), [target]);
    const history = useRx(accumulated, []);
    return history;
}

export function sortRxHistory<TDatum>(history: TDatum[], sortOrder: DrawCallback<TDatum, number>) {
    return history.map((datum, index) => ({ datum, index, sort: sortOrder(datum, index) }))
        .sort((a, b) => a.sort - b.sort);
}

export function useSortedRxHistory<TDatum>(target: Observable<TDatum>, sortOrder: DrawCallback<TDatum, number>): SortedHistoryEntry<TDatum>[] {
    const history = useRxHistory(target);
    const sorted = useMemo(() => sortRxHistory(history, sortOrder), [history, sortOrder]);
    return sorted;
}
