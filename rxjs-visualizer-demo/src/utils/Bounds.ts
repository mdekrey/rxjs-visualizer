
export interface Bounds {
    top: number;
    left: number;
    height: number;
    width: number;
};

export function boundsWithin(current: Element, within: Element): Bounds {
    const currentBB = current.getBoundingClientRect();
    const parent = within.getBoundingClientRect();
    const currentScale = (within as any)["getBBox"] ? (within as SVGGraphicsElement).getBBox() : undefined;
    const scaleX = (currentScale ? currentScale.width : current.clientWidth) / currentBB.width;
    const scaleY = (currentScale ? currentScale.height : current.clientHeight) / currentBB.height;

    return {
        top: (currentBB.top - parent.top) * scaleY,
        left: (currentBB.left - parent.left) * scaleX,
        height: currentBB.height * scaleY,
        width: currentBB.width * scaleX,
    };
}

export function scaledBounds(current: Element, within: Element): Pick<Bounds, "width" | "height"> {
    const currentBB = current.getBoundingClientRect();
    const parent = within.getBoundingClientRect();
    const currentScale = (within as any)["getBBox"] ? (within as SVGGraphicsElement).getBBox() : undefined;
    const scaleX = (currentScale ? currentScale.width : current.clientWidth) / currentBB.width;
    const scaleY = (currentScale ? currentScale.height : current.clientHeight) / currentBB.height;

    return {
        height: parent.height * scaleY,
        width: parent.width * scaleX,
    };
}
export function boundsSame(a: Bounds, b: Bounds) {
    return a.top === b.top &&
        a.left === b.left &&
        a.height === b.height &&
        a.width === b.width
}
