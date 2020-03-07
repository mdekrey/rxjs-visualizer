import React from 'react';
import { interval, concat, timer } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';
import { BasicNode } from '../utils/BasicNode';
import { BasicTheme } from '../utils/BasicTheme';
import { DrawTimeObservable } from '../utils/DrawTimeObservable';
import { DrawNestedObservable } from '../utils/DrawNestedObservable';

const simpleObservable = concat(interval(500).pipe(map(_ => interval(100).pipe(take(20))), take(10)), timer(500).pipe(filter(() => false)));

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
