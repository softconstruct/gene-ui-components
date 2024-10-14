import React, { useRef, useCallback } from 'react';

const useDebouncedCallback = <T extends (...args: any[]) => void>(func: T, wait?: number) => {
    const timeout = useRef<number | undefined>(undefined);

    return useCallback(
        (...args: any[]) => {
            const later = () => {
                clearTimeout(timeout.current);
                func(...args);
            };

            clearTimeout(timeout.current);
            timeout.current = window.setTimeout(later, wait);
        },
        [func, wait]
    );
};

export default useDebouncedCallback;
