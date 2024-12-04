import { Placement } from "@floating-ui/utils";

export const getPositionRect = (currentPopoverRect: DOMRect, position: Placement) => {
    const popoverWidth = currentPopoverRect.width;
    const popoverHeight = currentPopoverRect.height;
    switch (position) {
        case "top":
            return {
                top: currentPopoverRect.top - popoverHeight,
                left: currentPopoverRect.left,
                bottom: currentPopoverRect.top,
                right: currentPopoverRect.left + popoverWidth
            };
        case "right":
            return {
                top: currentPopoverRect.top,
                left: currentPopoverRect.right,
                bottom: currentPopoverRect.top + popoverHeight,
                right: currentPopoverRect.right + popoverWidth
            };
        case "bottom":
            return {
                top: currentPopoverRect.bottom,
                left: currentPopoverRect.left,
                bottom: currentPopoverRect.bottom + popoverHeight,
                right: currentPopoverRect.left + popoverWidth
            };
        case "left":
            return {
                top: currentPopoverRect.top,
                left: currentPopoverRect.left - popoverWidth,
                bottom: currentPopoverRect.top + popoverHeight,
                right: currentPopoverRect.left
            };
        case "top-start":
            return {
                top: currentPopoverRect.top - popoverHeight,
                left: currentPopoverRect.left - popoverWidth / 2,
                bottom: currentPopoverRect.top,
                right: currentPopoverRect.left + popoverWidth / 2
            };
        case "right-start":
            return {
                top: currentPopoverRect.top - popoverHeight / 2,
                left: currentPopoverRect.right,
                bottom: currentPopoverRect.top + popoverHeight / 2,
                right: currentPopoverRect.right + popoverWidth
            };
        case "bottom-start":
            return {
                top: currentPopoverRect.bottom,
                left: currentPopoverRect.left - popoverWidth / 2,
                bottom: currentPopoverRect.bottom + popoverHeight,
                right: currentPopoverRect.left + popoverWidth / 2
            };
        case "left-start":
            return {
                top: currentPopoverRect.top - popoverHeight / 2,
                left: currentPopoverRect.left - popoverWidth,
                bottom: currentPopoverRect.top + popoverHeight / 2,
                right: currentPopoverRect.left
            };
        case "top-end":
            return {
                top: currentPopoverRect.top - popoverHeight,
                left: currentPopoverRect.right - popoverWidth,
                bottom: currentPopoverRect.top,
                right: currentPopoverRect.right
            };
        case "right-end":
            return {
                top: currentPopoverRect.bottom - popoverHeight,
                left: currentPopoverRect.right,
                bottom: currentPopoverRect.bottom,
                right: currentPopoverRect.right + popoverWidth
            };
        case "bottom-end":
            return {
                top: currentPopoverRect.bottom,
                left: currentPopoverRect.right - popoverWidth,
                bottom: currentPopoverRect.bottom + popoverHeight,
                right: currentPopoverRect.right
            };
        case "left-end":
            return {
                top: currentPopoverRect.top + popoverHeight / 2,
                left: currentPopoverRect.left - popoverWidth,
                bottom: currentPopoverRect.bottom - popoverHeight / 2,
                right: currentPopoverRect.left
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
