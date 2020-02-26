import React, { ReactNode, useRef, useEffect, useMemo } from "react";
import { Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { singleElementDecorator } from "./singleElementDecorator";
import { Bounds, boundsWithin, boundsSame } from "./Bounds";

export interface ResizeListenerProps {
    children: ReactNode;
    onResize: (size: Bounds) => void;
};

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
