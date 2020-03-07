import React, { useMemo, useCallback, ElementType, ComponentType } from "react";
import { LifecycleEntry, WithTime } from "rxjs-visualizer";
import { NodeOrTerminator, LifetimePlaceholder } from "./NodeOrTerminator";
import { DrawElementProps, DrawHistory, DrawHistoryProps } from "./DrawHistory";
import { SortedHistoryEntry } from "./useRxHistory";

export type DrawTimeHistoryBaseElemProps<TDatum, TTheme> = DrawHistoryProps<WithTime<LifecycleEntry<TDatum> | LifetimePlaceholder>, TTheme>;

export type DrawTimeHistoryProps<TDatum, TTheme, TBase extends DrawTimeHistoryBaseElemProps<TDatum, TTheme>> =
    {
        history: SortedHistoryEntry<WithTime<LifecycleEntry<TDatum> | LifetimePlaceholder>>[];
        timeOffset: number;
        timeSizeFactorX: number;
        timeSizeFactorY: number;
        element: ElementType<DrawElementProps<TDatum, TTheme>>;
        drawHistory?: ComponentType<TBase>;
    } & Omit<TBase, "x" | "history" | "y" | "datumSelector" | "sortOrder" | "element">;

export function timeFactor(timeSizeFactor: number, timeOffset: number) {
    return (d: WithTime<LifecycleEntry<any>>) => (d && (d.time - timeOffset) * timeSizeFactor) || 0;
}

function TimeDatumSelector<TDatum, TTheme>(
    BaseElement: ElementType<DrawElementProps<TDatum, TTheme>>
): ElementType<DrawElementProps<WithTime<TDatum>, TTheme>> {
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
    drawHistory = DrawHistory,
    ...props
}: DrawTimeHistoryProps<TDatum, TTheme, TBase>) {
    const x = useCallback(timeFactor(timeSizeFactorX, timeOffset), [timeSizeFactorX, timeOffset]);
    const y = useCallback(timeFactor(timeSizeFactorY, timeOffset), [timeSizeFactorY, timeOffset]);
    const resultElement = useMemo(() => TimeDatumSelector(NodeOrTerminator(element)), [element]);
    const InnerDraw = drawHistory as ComponentType<any>;
    return (
        <InnerDraw
            {...props}
            history={history}
            x={x}
            y={y}
            element={resultElement} />
    );
}
