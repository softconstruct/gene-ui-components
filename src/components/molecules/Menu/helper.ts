import { RefObject } from "react";

export const isActiveElementInside = (parentRef: RefObject<HTMLDivElement>, selector: string): boolean => {
    const parentRect = parentRef.current?.getBoundingClientRect();
    const child = parentRef.current?.querySelector(selector);
    const childRect = child?.getBoundingClientRect();
    let isInside = false;

    if (parentRect && childRect) {
        isInside = childRect?.top >= parentRect.top - 32 && childRect.bottom <= parentRect.bottom + 32;
    }
    return isInside;
};
