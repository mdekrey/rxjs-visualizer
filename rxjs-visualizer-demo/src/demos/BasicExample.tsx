import React from 'react';
import { interval } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { BasicNode } from '../utils/BasicNode';
import { BasicTheme } from '../utils/BasicTheme';
import { DrawNestedObservable } from '../utils/DrawNestedObservable';

const simpleObservable = interval(500).pipe(map(v => interval(100).pipe(take(20), map(v2 => v + v2))));

export function BasicExample() {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const height = 2.625;
    return (
        <svg style={{ width: "42.5rem", height: `42.5rem` }}>
            <g style={{ transform: `translate(0px, ${height / 2}rem)` }}>
                <DrawNestedObservable target={simpleObservable}
                    {...BasicTheme}
                    element={BasicNode}
                    timeLimit={5000}
                    timeSizeFactorX={0.008 * rem}
                    timeSizeFactorY={0} />
            </g>
        </svg>
    );
}
