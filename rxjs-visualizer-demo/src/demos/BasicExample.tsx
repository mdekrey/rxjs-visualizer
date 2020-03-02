import React from 'react';
import { interval, concat, timer } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { BasicNode } from '../utils/BasicNode';
import { BasicTheme } from '../utils/BasicTheme';
import { DrawTimeObservable } from '../utils/DrawTimeObservable';

const simpleObservable = concat(interval(500).pipe(take(10)), timer(500).pipe(filter(() => false)));

export function BasicExample() {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const height = 2.625;
    return (
        <svg style={{ width: "42.5rem", height: `${height}rem` }}>
            <g style={{ transform: `translate(0px, ${height / 2}rem)` }}>
                <DrawTimeObservable target={simpleObservable}
                    {...BasicTheme}
                    element={BasicNode}
                    timeLimit={5000}
                    timeSizeFactorX={0.008 * rem}
                    timeSizeFactorY={0} />
            </g>
        </svg>
    );
}
