import React from 'react';
import { Observable } from 'rxjs';
import { DrawCallback, DrawHistoryProps, DrawHistory } from './DrawHistory';
import { useSortedRxHistory } from './useRxHistory';

export type DrawObservableProps<TDatum, TTheme> = {
    target: Observable<TDatum>;
    sortOrder: DrawCallback<TDatum, number>;
} & Omit<DrawHistoryProps<TDatum, TTheme>, "history">;

export function DrawObservable<TDatum, TTheme>({
    target,
    sortOrder,
    ...props
}: DrawObservableProps<TDatum, TTheme>) {
    const history = useSortedRxHistory(target, sortOrder);
    return <DrawHistory history={history} {...props} />;
}
