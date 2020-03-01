import React from 'react';
import { LifecycleEntry } from 'rxjs-visualizer';
import { BasicCompleteTerminator } from './BasicCompleteTerminator';
import { BasicErrorTerminator } from './BasicErrorTerminator';
import { BasicContinuationTerminator } from './BasicContinuationTerminator';
import { BasicObservableLine } from './BasicObservableLine';
import { DrawObservableProps, DrawObservable } from './DrawObservable';
import './BasicDrawObservable.css';

export type BasicDrawObservableProps<T extends LifecycleEntry<any>> =
    Omit<DrawObservableProps<T, {}>, "theme" | "completeTerminator" | "errorTerminator" | "continuationTerminator" | "observableLine" | "keyGenerator">
    & Partial<Pick<DrawObservableProps<T, {}>, "keyGenerator">>;

function index(_: unknown, idx: number) { return idx; }

export function BasicDrawObservable<T extends LifecycleEntry<any>>({
    target,
    x,
    keyGenerator = index,
    element: Element,
}: BasicDrawObservableProps<T>) {
    return (
        <g style={{ transform: "translate(0px, 1.3125rem)" }}>
            <DrawObservable<T, {}> target={target} x={x} keyGenerator={keyGenerator} element={Element} completeTerminator={BasicCompleteTerminator} errorTerminator={BasicErrorTerminator} continuationTerminator={BasicContinuationTerminator} observableLine={BasicObservableLine} theme={{}} />
        </g>
    );
}
