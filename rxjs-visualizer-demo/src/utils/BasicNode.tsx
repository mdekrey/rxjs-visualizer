import React from 'react';
import { BasicThemeConfig } from './BasicThemeConfig';

export function BasicNode({ datum, theme: { markerSize, nodeCircleRadius, nodeCircleStyle, nodeTextStyle } }: {
    datum: number;
    theme: BasicThemeConfig
}) {
    return (<>
        <circle style={nodeCircleStyle} r={nodeCircleRadius} />
        <text style={nodeTextStyle} textAnchor="middle" y={`${markerSize / 4}rem`}>{datum}</text>
    </>);
}
