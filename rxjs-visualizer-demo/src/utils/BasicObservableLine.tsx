import React from 'react';
import { BasicThemeConfig } from './BasicThemeConfig';

export function BasicObservableLine({ lineMinX, lineMaxX, lineMinY, lineMaxY, theme: { lineStyle } }: {
    lineMinX: number;
    lineMaxX: number;
    lineMinY: number;
    lineMaxY: number;
    theme: BasicThemeConfig;
}) {
    return <line x1={lineMinX} x2={lineMaxX} y1={lineMinY} y2={lineMaxY} style={lineStyle} />;
}
