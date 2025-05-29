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
    if (!Array.isArray(menu) || menu.length === 0) return null;

    for (let i = 0, len = menu.length; i < len; i++) {
        const item = menu[i];
        const props = item?.props;

        if (props) {
            if (props.selected) {
                path.push(i.toString());
                return path.slice();
            }

            const { children } = props;
            if (children && Array.isArray(children) && children.length > 0) {
                path.push(i.toString());
                const result = findPathOfSelected(children, path);

                if (result) return result;

                path.pop();
            }
        }
    }

    return null;
};
