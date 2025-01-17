import { RefObject, useEffect, useRef, useCallback } from "react";

const SCROLL_LOCK_CLASS = "scroll-lock";

type TargetElement<T extends HTMLElement> = T | RefObject<T>;

const useScrollLock = <T extends HTMLElement>(target: TargetElement<T>) => {
    const resolvedElement = target instanceof HTMLElement ? target : target.current;

    const lockedRef = useRef(false);

    const lock = useCallback(() => {
        if (resolvedElement && !lockedRef.current) {
            resolvedElement.classList.add(SCROLL_LOCK_CLASS);
            lockedRef.current = true;
        }
    }, [resolvedElement]);

    const unlock = useCallback(() => {
        if (resolvedElement && lockedRef.current) {
            resolvedElement.classList.remove(SCROLL_LOCK_CLASS);
            lockedRef.current = false;
        }
    }, [resolvedElement]);

    useEffect(() => {
        return () => {
            unlock();
        };
    }, [unlock]);

    return { lock, unlock };
};

export default useScrollLock;
