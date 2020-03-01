
import { BasicCompleteTerminator } from './BasicCompleteTerminator';
import { BasicErrorTerminator } from './BasicErrorTerminator';
import { BasicContinuationTerminator } from './BasicContinuationTerminator';
import { BasicObservableLine } from './BasicObservableLine';
import { BasicThemeConfig } from './BasicThemeConfig';
import { DrawObservableProps } from './DrawObservable';

const markerSize = 1.28;

const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

export const BasicTheme: Pick<DrawObservableProps<any, BasicThemeConfig>, "theme" | "observableLine"> = {
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
        completeTerminator: BasicCompleteTerminator,
        errorTerminator: BasicErrorTerminator,
        continuationTerminator: BasicContinuationTerminator,
    },
    observableLine: BasicObservableLine,
};
