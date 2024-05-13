import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

function useWindowSize() {
    const w = window;
    const { innerHeight, innerWidth } = w;
    const [width, setWindowWidth] = useState(innerWidth);
    const [height, setWindowHeight] = useState(innerHeight);
    const { debounceCallback, clearDebounce } = useDebounce();

    const handleResize = () => {
        const { innerHeight, innerWidth } = w;
        setWindowWidth(innerWidth);
        setWindowHeight(innerHeight);
    };

    const debounce = () => debounceCallback(handleResize, 100);

    useEffect(() => {
        w.addEventListener('resize', debounce);
        w.addEventListener('orientationChange', debounce);

        return () => {
            w.removeEventListener('resize', debounce);
            w.removeEventListener('orientationChange', debounce);
            clearDebounce();
        };
    }, []);

    return {
        width,
        height
    };
}

export default useWindowSize;
