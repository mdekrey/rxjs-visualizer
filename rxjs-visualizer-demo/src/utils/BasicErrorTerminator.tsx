import React from 'react';
import { BasicThemeConfig } from './BasicThemeConfig';

export function BasicErrorTerminator({ theme: { markerSize, errorStyle } }: { theme: BasicThemeConfig }) {
    return (<>
        <line x1={`-${markerSize}rem`} x2={`${markerSize}rem`} y1={`-${markerSize}rem`} y2={`${markerSize}rem`} style={errorStyle} />
        <line x1={`${markerSize}rem`} x2={`-${markerSize}rem`} y1={`-${markerSize}rem`} y2={`${markerSize}rem`} style={errorStyle} />
    </>);
}
