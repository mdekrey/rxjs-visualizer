import React from 'react';
export function BasicObservableLine({ lineMinX, lineMaxX }: {
    lineMinX: number;
    lineMaxX: number;
}) {
    return <line x1={lineMinX} x2={lineMaxX} y1={0} y2={0} className="DrawObservable" />;
}
