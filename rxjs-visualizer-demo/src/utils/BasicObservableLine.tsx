import React from 'react';
import { BasicThemeConfig } from './BasicThemeConfig';

export function BasicObservableLine({ lineMinX, lineMaxX, theme: { lineStyle } }: {
    lineMinX: number;
    lineMaxX: number;
    theme: BasicThemeConfig;
}) {
    return <line x1={lineMinX} x2={lineMaxX} y1={0} y2={0} style={lineStyle} />;
}
