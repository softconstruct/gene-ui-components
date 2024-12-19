import { useRef, useCallback } from "react";

const useDebouncedCallback = <T extends (...args: unknown[]) => void>(func: T, wait?: number) => {
    const timeout = useRef<number | undefined>(undefined);
    const waitTime = wait === undefined ? 0 : wait;

    const debouncedCallback = useCallback(
        (...args: unknown[]) => {
            const later = () => {
                clearTimeout(timeout.current);
                func(...args);
            };

            clearTimeout(timeout.current);
            timeout.current = window.setTimeout(later, waitTime);
        },
        [func, waitTime]
    );

    const clearDebounce = useCallback(() => {
        if (timeout.current !== undefined) {
            clearTimeout(timeout.current);
            timeout.current = undefined;
        }
    }, []);

    return { debouncedCallback, clearDebounce };
};

export default useDebouncedCallback;
