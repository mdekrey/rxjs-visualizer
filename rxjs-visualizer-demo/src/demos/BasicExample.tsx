import React, { useMemo } from 'react';
import { Observable, interval, asyncScheduler, concat, timer } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { BasicDrawObservable } from "../utils/BasicDrawObservable";
import { recordLifecycle, addTime, LifecycleEntry, collapseTime, HasTime } from 'rxjs-visualizer';
import { BasicNode } from '../utils/BasicNode';

const targetObservable: Observable<LifecycleEntry<number> & HasTime> =
    new Observable<LifecycleEntry<number> & HasTime>((observer) => {
        const scheduler = asyncScheduler; // can swap out FakeScheduler for immediate rendering
        const result = concat(interval(500, scheduler).pipe(take(10)), timer(500).pipe(filter(() => false)))
            .pipe(recordLifecycle(2000, scheduler), addTime(scheduler), map(collapseTime))
            .subscribe(observer);
        // scheduler.execute();
        return result;
    });

export function BasicExample() {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const timeOffset = useMemo(() => asyncScheduler.now(), []);
    return (
        <svg style={{ width: "42.5rem", height: "2.625rem" }}>
            <BasicDrawObservable
                target={targetObservable}
                x={(d, idx) => ((d && (d.time - timeOffset) * 0.008) || 0) * rem}
                element={BasicNode}
            />
        </svg>
    );
}
