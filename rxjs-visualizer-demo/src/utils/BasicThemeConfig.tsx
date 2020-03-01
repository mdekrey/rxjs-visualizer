import { LifetimeTheme } from "./NodeOrTerminator";

interface RootBasicThemeConfig {
    markerSize: number;
    nodeCircleRadius: string;
    nodeCircleStyle: React.CSSProperties;
    nodeTextStyle: React.CSSProperties;
    lineStyle: React.CSSProperties;
    pathStyle: React.CSSProperties;
    errorStyle: React.CSSProperties;
}

export type BasicThemeConfig = LifetimeTheme<RootBasicThemeConfig>;
