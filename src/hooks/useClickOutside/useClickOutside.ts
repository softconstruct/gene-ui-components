import { RefObject, useEffect, useRef } from "react";

const useClickOutside = (callback: (e: MouseEvent) => void, relativeElements?: RefObject<HTMLElement>[]) => {
    const ref = useRef<HTMLElement | null>(null);

    const handleClickOutside = (e: MouseEvent) => {
        const { target } = e;
        if (!(target instanceof Node)) return;

        const isNotRelativeTarget =
            Array.isArray(relativeElements) && relativeElements.length
                ? relativeElements?.find((relativeRef) => !relativeRef.current?.contains(target))
                : true;

        if (ref.current && !ref.current?.contains(target) && isNotRelativeTarget) {
            callback(e);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    return (node: HTMLElement | null) => {
        ref.current = node;
    };
};

export default useClickOutside;
