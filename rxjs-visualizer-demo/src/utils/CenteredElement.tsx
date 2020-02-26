import React, { ReactNode, useRef, useEffect, useReducer, CSSProperties } from "react";
import { singleElementDecorator } from "./singleElementDecorator";
import { boundsWithin, Bounds, scaledBounds } from "./Bounds";

type State = typeof initialState;

type Action = Pick<State, "outerSize" | "innerSize">;

const initialState = Object.freeze({
    outerSize: undefined as Pick<Bounds, "width" | "height"> | undefined,
    innerSize: undefined as Bounds | undefined,
    offset: Object.freeze({ x: 0, y: 0 }),
});

function reducer(prevState: State, { outerSize, innerSize }: Action): State {
    const offset = (!outerSize || !innerSize)
        ? { x: 0, y: 0 }
        : {
            x: (outerSize.width - innerSize.width) / 2 - innerSize.left + prevState.offset.x,
            y: (outerSize.height - innerSize.height) / 2 - innerSize.top + prevState.offset.y
        };

    return { outerSize: outerSize, innerSize: innerSize, offset };
}

export interface CenteredElementProps {
    style?: CSSProperties;
    children: ReactNode;
};

export const CenteredElement = singleElementDecorator((Element, { children, style = {}, ...props }: CenteredElementProps) => {
    const el = useRef<SVGGraphicsElement>(null);
    const [state, dispatch] = useReducer(reducer, initialState);

    const { x, y } = state.offset;

    useEffect(() => {
        const result = setInterval(() => {
            if (!el.current || !el.current.parentElement) return;
            const outerSize = scaledBounds(el.current, el.current.parentElement);
            clearInterval(result);
            dispatch({ innerSize: boundsWithin(el.current, el.current.parentElement), outerSize });
        }, 100);
        return () => clearInterval(result);
    }, [dispatch]);

    return (
        <Element ref={el} style={{ ...style, transform: `translate(${x}px, ${y}px)` }} {...props}>
            {children}
        </Element>
    )
});
