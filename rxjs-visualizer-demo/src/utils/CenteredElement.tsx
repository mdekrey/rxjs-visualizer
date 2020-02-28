import React, { ReactNode, useRef, useEffect, useReducer, CSSProperties } from "react";
import { singleElementDecorator } from "./singleElementDecorator";
import { boundsWithin, Bounds, scaledBounds } from "./Bounds";
import { round } from "./round";

type State = typeof initialState;

type Action = Pick<State, "outerSize" | "innerSize">;

const initialState = Object.freeze({
    outerSize: undefined as Pick<Bounds, "width" | "height"> | undefined,
    innerSize: undefined as Bounds | undefined,
    offset: Object.freeze({ x: 0, y: 0 }),
    scale: 1
});

const buffer = 5;
const precision = 4;

function reducer(prevState: State, { outerSize, innerSize }: Action): State {
    const scale = (!outerSize || !innerSize)
        ? 1
        : round(Math.min(
            (outerSize.width - buffer) / (innerSize.width / prevState.scale),
            (outerSize.height - buffer) / (innerSize.height / prevState.scale)
        ), precision);
    const newScale = scale / prevState.scale;

    const offset = (!outerSize || !innerSize)
        ? { x: 0, y: 0 }
        : {
            x: round((outerSize.width - innerSize.width * newScale) / 2 - innerSize.left * newScale + prevState.offset.x, precision),
            y: round((outerSize.height - innerSize.height * newScale) / 2 - innerSize.top * newScale + prevState.offset.y, precision)
        };

    if (offset.x === prevState.offset.x && offset.y === prevState.offset.y && prevState.scale === scale)
        return prevState;

    return { outerSize: outerSize, innerSize: innerSize, offset, scale };
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
            dispatch({ innerSize: boundsWithin(el.current, el.current.parentElement), outerSize });
        }, 100);
        return () => clearInterval(result);
    }, [dispatch]);

    return (
        <Element ref={el} style={{ ...style, transform: `translate(${x}px, ${y}px) scale(${state.scale})` }} {...props}>
            {children}
        </Element>
    )
});
