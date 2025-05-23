import { ReactElement, ReactNode, RefObject } from "react";

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

export const findPathOfSelected = (menu: ReactNode | ReactElement[], path: string[] = []): string[] | null => {
    if (!Array.isArray(menu)) return null;
    for (let i = 0; i < menu?.length; i++) {
        const item = menu[i];
        if (item.props?.selected) {
            return [...path, i.toString()];
        }

        if (item.props.children && Array.isArray(item.props.children)) {
            const childPath = findPathOfSelected(item.props.children, [...path, i.toString()]);
            if (childPath) {
                return childPath;
            }
        }
    }

    return null;
};
