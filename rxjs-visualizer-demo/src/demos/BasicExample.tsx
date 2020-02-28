import React from 'react';
import { Observable, interval, Observer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DrawObservable } from '../utils/DrawObservable';
import { CenteredElement } from '../utils/CenteredElement';
import { recordLifecycle, FakeScheduler, addTime, LifecycleEntry, collapseTime, HasTime } from 'rxjs-visualizer';

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
        const scheduler = new FakeScheduler();
        const result = interval(5, scheduler).pipe(take(10), recordLifecycle(), addTime(scheduler), map(collapseTime))
            .subscribe(observer);
        scheduler.execute();
        return result;
    });

export function BasicExample() {
    return (
        <svg style={{ width: "680px", height: "68px" }}>
            <CenteredG>
                <DrawObservable
                    target={targetObservable}
                    x={(d, idx) => `${(d && d.time * 0.8) || 0}rem`}
                    element={Node}
                />
            </CenteredG>
        </svg>
    );
}
