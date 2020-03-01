import React from 'react';
import { BasicThemeConfig } from './BasicThemeConfig';

export function BasicCompleteTerminator({ theme: { markerSize, lineStyle } }: { theme: BasicThemeConfig }) {
    return <line x1={0} x2={0} y1={`-${markerSize}rem`} y2={`${markerSize}rem`} style={lineStyle} />;
}
