
import { BasicCompleteTerminator } from './BasicCompleteTerminator';
import { BasicErrorTerminator } from './BasicErrorTerminator';
import { BasicContinuationTerminator } from './BasicContinuationTerminator';
import { BasicObservableLine } from './BasicObservableLine';
import { BasicThemeConfig } from './BasicThemeConfig';
import { DrawObservableProps } from './DrawObservable';

function index(_: unknown, idx: number) { return idx; }

const markerSize = 1.28;

const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

export const BasicTheme: Pick<DrawObservableProps<any, BasicThemeConfig>, "theme" | "completeTerminator" | "errorTerminator" | "continuationTerminator" | "observableLine" | "keyGenerator"> = {
    theme: {
        markerSize,
        nodeTextStyle: {
            fontSize: "1rem"
        },
        nodeCircleRadius: "0.92rem",
        nodeCircleStyle: {
            fill: "white",
            stroke: "currentColor",
            strokeWidth: "0.12rem",
        },
        lineStyle: {
            strokeWidth: "0.12rem",
            stroke: "currentColor",
        },
        pathStyle: {
            transform: `scale(${rem})`,
            fill: "currentColor",
        },
        errorStyle: {
            strokeWidth: "0.12rem",
            stroke: "red",
        },
    },
    keyGenerator: index,
    completeTerminator: BasicCompleteTerminator,
    errorTerminator: BasicErrorTerminator,
    continuationTerminator: BasicContinuationTerminator,
    observableLine: BasicObservableLine,
};
