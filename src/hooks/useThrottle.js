import { useCallback, useRef } from 'react';

const useThrottle = (callback, delay) => {
    const ref = useRef(null);

    return useCallback(
        (...args) => {
            clearTimeout(ref.current);

            ref.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
};

export default useThrottle;
