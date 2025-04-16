import { RefObject, useCallback, useEffect, useRef } from "react";

type IClickOutside = (node: HTMLElement | null) => void;

const useClickOutside = (
    callback: (e: MouseEvent) => void,
    relativeElements?: RefObject<HTMLElement>[]
): IClickOutside => {
    const ref = useRef<HTMLElement | null>(null);

    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            const { target } = e;
            if (!(target instanceof Node)) return;

            const isNotRelativeTarget = !relativeElements?.some((relativeRef) => relativeRef.current?.contains(target));

            if (ref.current && !ref.current.contains(target) && isNotRelativeTarget) {
                callback(e);
            }
        },
        [callback, relativeElements]
    );

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    return (node: HTMLElement | null) => {
        ref.current = node;
    };
};

export default useClickOutside;
