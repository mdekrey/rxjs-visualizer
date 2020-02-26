import React from 'react';
import { range } from 'rxjs';
import { DrawObservable } from '../utils/DrawObservable';
import { CenteredElement } from '../utils/CenteredElement';
import { recordLifecycle } from 'rxjs-visualizer';

const CenteredG = CenteredElement<React.SVGProps<SVGGElement>>("g");

function Node(d: number) {
    return (
        <>
            <circle className="DrawObservable" />
            <text className="DrawObservable" textAnchor="middle" y={0.8}>{d}</text>
        </>
    );
}

const targetObservable = range(0, 5).pipe(recordLifecycle());

export function BasicExample() {
    return (
        <svg viewBox="0 0 100 10" style={{ width: "680px", height: "68px" }}>
            <CenteredG>
                <DrawObservable
                    target={targetObservable}
                    x={(_, idx) => idx * 10}
                    element={Node}
                />
            </CenteredG>
        </svg>
    );
}
