import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
    if (value === undefined) {
        let timeoutId;

        const debounceCallback = (value, delay) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(value, delay);
        };

        const clearDebounce = () => clearTimeout(timeoutId);

        return { debounceCallback, clearDebounce };
    }

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [delay, value]);

    return debouncedValue;
};

export default useDebounce;
