import React from 'react';
import { Observable } from 'rxjs';
import { DrawObservableCallback, DrawObservableHistoryProps, DrawObservableHistory } from './DrawObservableHistory';
import { useSortedRxHistory } from './useRxHistory';

export type DrawObservableProps<TDatum, TTheme> = {
    target: Observable<TDatum>;
    sortOrder: DrawObservableCallback<TDatum, number>;
} & Omit<DrawObservableHistoryProps<TDatum, TTheme>, "history">;

export function DrawObservable<TDatum, TTheme>({
    target,
    sortOrder,
    ...props
}: DrawObservableProps<TDatum, TTheme>) {
    const history = useSortedRxHistory(target, sortOrder);
    return <DrawObservableHistory history={history} {...props} />;
}
