import React, { useReducer, useCallback, useMemo } from 'react';
import { range } from 'rxjs';
import { DrawObservable } from '../utils/DrawObservable';
import { ResizeListener, Bounds } from '../utils/ResizeListener';

type State = typeof initialState;

type Action =
    | ReturnType<typeof createSetSvgSizeAction>
    | ReturnType<typeof createSetContainerSizeAction>;

const initialState = Object.freeze({
    svgSize: undefined as Bounds | undefined,
    containerSize: undefined as Bounds | undefined,
    offset: Object.freeze({ x: 0, y: 0 }),
});

function createSetSvgSizeAction(svgSize: Bounds) {
    return { svgSize };
}

function createSetContainerSizeAction(containerSize: Bounds) {
    return { containerSize };
}

function reducer(prevState: State, action: Action): State {
    const { svgSize, containerSize } = { ...prevState, ...action };
    const offset = (function() {
        if (!svgSize || !containerSize) return {x:0, y:0};
        return { x: -containerSize.left + prevState.offset.x, y: (svgSize.height - containerSize.height) / 2 - containerSize.top + prevState.offset.y };
    })();

    return { svgSize, containerSize, offset };
}

export function BasicExample() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const setSvgSize = useCallback((svgSize: Bounds) => dispatch(createSetSvgSizeAction(svgSize)), [dispatch]);
    const setContainerSize = useCallback((containerSize: Bounds) => dispatch(createSetContainerSizeAction(containerSize)), [dispatch]);
    const ResizeSvg = useMemo(() => ResizeListener("svg"), []);
    const ResizeG = useMemo(() => ResizeListener<React.SVGProps<SVGGElement>>("g"), []);

    const {x, y} = state.offset;

    return (
        <ResizeSvg onResize={setSvgSize}>
            <ResizeG onResize={setContainerSize} style={{transform:`translate(${x}px, ${y}px)`}}>
                <DrawObservable target={range(0, 5)} x={(_, idx) => idx * 10} element={d => <text>{d}</text>} keyGenerator={(_, idx) => idx} />
            </ResizeG>
        </ResizeSvg>
    );
}
