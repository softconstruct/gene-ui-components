import { useState, useEffect } from 'react';

function useWindowSize() {
    const w = window;
    const { innerHeight, innerWidth } = w;
    const [width, setWindowWidth] = useState(innerWidth);
    const [height, setWindowHeight] = useState(innerHeight);
    let timeoutId;

    const handleResize = () => {
        const { innerHeight, innerWidth } = w;
        setWindowWidth(innerWidth);
        setWindowHeight(innerHeight);
    };

    const debounceResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleResize, 100);
    };

    useEffect(() => {
        w.addEventListener('resize', debounceResize);
        w.addEventListener('orientationChange', debounceResize);
        return () => {
            w.removeEventListener('resize', debounceResize);
            w.removeEventListener('orientationChange', debounceResize);
            clearTimeout(timeoutId);
        };
    }, []);

    return {
        width,
        height
    };
}

export default useWindowSize;
