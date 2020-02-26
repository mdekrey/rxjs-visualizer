import React, { ElementType, ReactElement, forwardRef } from "react";

export function singleElementDecorator<P>(decoratorComponent: (element: ElementType<any>, props: P) => ReactElement | null) {
    function decorate<T = {}>(element: ElementType<T>): ElementType<P & T>;
    function decorate(Element: ElementType<any>): ElementType<any> {
        const newElement = forwardRef((innerProps: any, ref) => {
            return <Element ref={ref} {...innerProps} />;
        });
        return (outerProps) => decoratorComponent(newElement, outerProps);
    }
    return decorate;
}
