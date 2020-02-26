import React, { ReactNode, ElementType, useRef, useEffect, useMemo } from "react";
import { Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export interface Bounds {
    top: number;
    left: number;
    height: number;
    width: number;
};

export type ElementDecorator<T> = {
    element: ElementType<T>;
} & T;

export type ResizeListenerProps<T> = {
    children: ReactNode;
    onResize: (size: Bounds) => void;
} & ElementDecorator<T>;

export function ResizeListener(props: Omit<ResizeListenerProps<React.SVGProps<SVGGElement>>, "element">): JSX.Element;
export function ResizeListener<T>(props: ResizeListenerProps<T>): JSX.Element;
export function ResizeListener({ element: Element = "g", children, onResize, ...props }: Partial<ResizeListenerProps<any>>) {
    const el = useRef<Element>(null);
    const sizes = useMemo(() => new Subject<Bounds>(), [])

    useEffect(() => {
        const result = setInterval(() => {
            if (!el.current || !el.current.parentElement) return;
            const current = el.current.getBoundingClientRect();
            const parent = el.current.parentElement.getBoundingClientRect();
            const rect: Bounds = {
                top: current.top - parent.top,
                left: current.left - parent.left,
                height: current.height,
                width: current.width,
            };
            sizes.next(rect);
        }, 100);
        return () => clearInterval(result);
    }, [sizes]);

    useEffect(() => {
        const subscription = sizes
            .pipe(distinctUntilChanged((a, b) =>
                a.top === b.top &&
                a.left === b.left &&
                a.height === b.height &&
                a.width === b.width))
            .subscribe(onResize);
        return () => subscription.unsubscribe();
    }, [sizes, onResize]);

    return (
        <Element ref={el} {...props}>
            {children}
        </Element>
    )
}