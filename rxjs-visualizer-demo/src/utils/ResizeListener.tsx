import React, { ReactNode, useRef, useEffect, useMemo } from "react";
import { Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { singleElementDecorator } from "./singleElementDecorator";

export interface Bounds {
    top: number;
    left: number;
    height: number;
    width: number;
};

export interface ResizeListenerProps {
    children: ReactNode;
    onResize: (size: Bounds) => void;
};

function boundsWithin(current: Element, within: Element): Bounds {
    const currentBB = current.getBoundingClientRect();
    const parent = within.getBoundingClientRect();
    return {
        top: currentBB.top - parent.top,
        left: currentBB.left - parent.left,
        height: currentBB.height,
        width: currentBB.width,
    };
}
function boundsSame(a: Bounds, b: Bounds) {
    return a.top === b.top &&
        a.left === b.left &&
        a.height === b.height &&
        a.width === b.width
}

export const ResizeListener = singleElementDecorator((Element, { children, onResize, ...props }: ResizeListenerProps) => {
    const el = useRef<Element>(null);
    const sizes = useMemo(() => new Subject<Bounds>(), [])

    useEffect(() => {
        const result = setInterval(() => {
            if (!el.current || !el.current.parentElement) return;
            sizes.next(boundsWithin(el.current, el.current.parentElement));
        }, 100);
        return () => clearInterval(result);
    }, [sizes]);

    useEffect(() => {
        const subscription = sizes
            .pipe(distinctUntilChanged(boundsSame))
            .subscribe(onResize);
        return () => subscription.unsubscribe();
    }, [sizes, onResize]);

    return (
        <Element ref={el} {...props}>
            {children}
        </Element>
    )
});
