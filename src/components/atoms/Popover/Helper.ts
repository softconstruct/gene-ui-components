import { Placement } from "@floating-ui/utils";

export const getPositionRect = (currentPopoverRect: DOMRect, position: Placement) => {
    const { width, height, top, right, bottom, left } = currentPopoverRect;

    switch (position) {
        case "top":
            return {
                top: top - width,
                left,
                bottom: top,
                right: left + width
            };
        case "right":
            return {
                top,
                left: right,
                bottom: top + height,
                right: right + width
            };
        case "bottom":
            return {
                top: bottom,
                left,
                bottom: bottom + height,
                right: left + width
            };
        case "left":
            return {
                top,
                left: left - width,
                bottom: top + height,
                right: left
            };
        case "top-start":
            return {
                top: top - height,
                left: left - width / 2,
                bottom: top,
                right: left + width / 2
            };
        case "right-start":
            return {
                top: top - height / 2,
                left: right,
                bottom: top + height / 2,
                right: right + width
            };
        case "bottom-start":
            return {
                top: bottom,
                left: left - width / 2,
                bottom: bottom + height,
                right: left + width / 2
            };
        case "left-start":
            return {
                top: top - height / 2,
                left: left - width,
                bottom: top + height / 2,
                right: left
            };
        case "top-end":
            return {
                top: top - height,
                left: right - width,
                bottom: top,
                right
            };
        case "right-end":
            return {
                top: bottom - height,
                left: right,
                bottom,
                right: right + width
            };
        case "bottom-end":
            return {
                top: bottom,
                left: right - width,
                bottom: bottom + height,
                right
            };
        case "left-end":
            return {
                top: top + height / 2,
                left: left - width,
                bottom: bottom - height / 2,
                right: left
            };
        default:
            return currentPopoverRect;
    }
};

export const calculateOverlap = (rect1: DOMRect, rect2: DOMRect) => {
    if (
        rect1.right <= rect2.left ||
        rect1.left >= rect2.right ||
        rect1.bottom <= rect2.top ||
        rect1.top >= rect2.bottom
    ) {
        return 0;
    }

    const overlapWidth = Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left);

    const overlapHeight = Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top);

    return overlapWidth * overlapHeight;
};
