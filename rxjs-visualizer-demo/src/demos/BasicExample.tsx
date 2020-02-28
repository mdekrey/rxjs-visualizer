import React, { useMemo } from 'react';
import { Observable, interval, Observer, asyncScheduler, concat, throwError } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DrawObservable } from '../utils/DrawObservable';
import { CenteredElement } from '../utils/CenteredElement';
import { recordLifecycle, addTime, LifecycleEntry, collapseTime, HasTime } from 'rxjs-visualizer';

const CenteredG = CenteredElement<React.SVGProps<SVGGElement>>("g");

function Node(d: number) {
    return (
        <>
            <circle className="DrawObservable" />
            <text className="DrawObservable" textAnchor="middle" y="0.32rem">{d}</text>
        </>
    );
}

const targetObservable: Observable<LifecycleEntry<number> & HasTime> =
    Observable.create((observer: Observer<LifecycleEntry<number> & HasTime>) => {
        const scheduler = asyncScheduler; // can swap out FakeScheduler for immediate rendering
        const result = concat(interval(500, scheduler).pipe(take(10)), throwError("boom"))
            .pipe(recordLifecycle(), addTime(scheduler), map(collapseTime))
            .subscribe(observer);
        // scheduler.execute();
        return result;
    });

export function BasicExample() {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const timeOffset = useMemo(() => asyncScheduler.now(), []);
    return (
        <svg style={{ width: "680px", height: "68px" }}>
            <CenteredG>
            <g style={{ transform: "translate(0px, 34px)" }}>
                <DrawObservable
                    target={targetObservable}
                    x={(d, idx) => ((d && (d.time - timeOffset) * 0.008) || 0) * rem}
                    element={Node}
                />
                </g>
            </CenteredG>
        </svg>
    );
}
