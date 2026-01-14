import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { ReferenceType } from "@floating-ui/react";

type IClickOutside = (node: HTMLElement | null) => void;

const useClickOutside = (
    callback: (e: MouseEvent) => void,
    relativeElements?: MutableRefObject<ReferenceType | null>[]
): IClickOutside => {
    const ref = useRef<HTMLElement | null>(null);

    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            const { target } = e;
            if (!(target instanceof Node)) return;

            const isNotRelativeTarget = !relativeElements?.some((relativeRef) => {
                if (!(relativeRef.current instanceof Element)) return false;

                return relativeRef.current?.contains(target as Node);
            });

            if (
                (ref.current && !ref.current.contains(target) && isNotRelativeTarget) ||
                (!ref.current && isNotRelativeTarget)
            ) {
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
