import React from 'react';
import { markerSize } from './DrawObservable';
export function BasicCompleteTerminator() {
    return <line x1={0} x2={0} y1={`-${markerSize}rem`} y2={`${markerSize}rem`} className="DrawObservable" />;
}
