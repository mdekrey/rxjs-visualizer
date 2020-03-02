import React, { useMemo, useCallback, ElementType, ComponentType } from "react";
import { LifecycleEntry, WithTime } from "rxjs-visualizer";
import { NodeOrTerminator } from "./NodeOrTerminator";
import { DrawObservableElementProps, DrawObservableHistory, DrawObservableHistoryProps } from "./DrawObservableHistory";
import { SortedHistoryEntry } from "./useRxHistory";

export type DrawTimeHistoryBaseElemProps<TDatum, TTheme> = DrawObservableHistoryProps<WithTime<LifecycleEntry<TDatum>>, TTheme>;

export type DrawTimeHistoryProps<TDatum, TTheme, TBase extends DrawTimeHistoryBaseElemProps<TDatum, TTheme>> =
    Omit<TBase, "x" | "history" | "y" | "datumSelector" | "sortOrder" | "element"> & {
        history: SortedHistoryEntry<WithTime<LifecycleEntry<TDatum>>>[];
        timeOffset: number;
        timeSizeFactorX: number;
        timeSizeFactorY: number;
        element: ElementType<DrawObservableElementProps<TDatum, TTheme>>;
        drawHistory?: ComponentType<TBase>;
    };

export function timeFactor(timeSizeFactor: number, timeOffset: number) {
    return (d: WithTime<LifecycleEntry<any>>) => (d && (d.time - timeOffset) * timeSizeFactor) || 0;
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

export function DrawTimeHistory<TDatum, TTheme, TBase extends DrawTimeHistoryBaseElemProps<TDatum, TTheme>>({
    history,
    timeOffset,
    timeSizeFactorX,
    timeSizeFactorY,
    element,
    drawHistory = DrawObservableHistory,
    ...props
}: DrawTimeHistoryProps<TDatum, TTheme, TBase>) {
    const x = useCallback(timeFactor(timeSizeFactorX, timeOffset), [timeSizeFactorX, timeOffset]);
    const y = useCallback(timeFactor(timeSizeFactorY, timeOffset), [timeSizeFactorY, timeOffset]);
    const resultElement = useMemo(() => TimeDatumSelector(NodeOrTerminator(element)), [element]);
    const DrawHistory = drawHistory as ComponentType<DrawTimeHistoryBaseElemProps<TDatum, TTheme>>;
    return (
        <DrawHistory
            {...props}
            history={history}
            x={x}
            y={y}
            element={resultElement} />
    );
}
