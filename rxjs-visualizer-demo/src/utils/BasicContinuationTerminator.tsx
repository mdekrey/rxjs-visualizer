import React from 'react';
import { markerSize } from './DrawObservable';
export function BasicContinuationTerminator() {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return (<>
        <line x1={0} x2={markerSize} y1={0} y2={0} className="DrawObservable" />
        <path style={{ transform: `scale(${rem})` }} d={`M0 -${markerSize * 1} L${markerSize * 1.5} 0 L0 ${markerSize * 1}`} className="DrawObservable" />
    </>);
}
