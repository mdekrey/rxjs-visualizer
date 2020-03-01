import React from 'react';
import { markerSize } from './DrawObservable';
export function BasicErrorTerminator() {
    return (<>
        <line x1={`-${markerSize}rem`} x2={`${markerSize}rem`} y1={`-${markerSize}rem`} y2={`${markerSize}rem`} className="DrawObservable error" />
        <line x1={`${markerSize}rem`} x2={`-${markerSize}rem`} y1={`-${markerSize}rem`} y2={`${markerSize}rem`} className="DrawObservable error" />
    </>);
}
