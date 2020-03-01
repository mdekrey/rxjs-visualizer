import React from 'react';
import { BasicThemeConfig } from './BasicThemeConfig';
export function BasicContinuationTerminator({ theme: { markerSize, lineStyle, pathStyle } }: { theme: BasicThemeConfig }) {
    return (<>
        <line x1={0} x2={markerSize} y1={0} y2={0} style={lineStyle} />
        <path d={`M0 -${markerSize * 1} L${markerSize * 1.5} 0 L0 ${markerSize * 1}`} style={pathStyle} />
    </>);
}
