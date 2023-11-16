import { useState, useEffect } from 'react';

function useWindowSize() {
    const w = window;
    const { innerHeight, innerWidth } = w;
    const [width, setWindowWidth] = useState(innerWidth);
    const [height, setWindowHeight] = useState(innerHeight);

    const handleResize = () => {
        const { innerHeight, innerWidth } = w;
        setWindowWidth(innerWidth);
        setWindowHeight(innerHeight);
    };

    useEffect(() => {
        w.addEventListener('resize', handleResize);
        w.addEventListener('orientationChange', handleResize);
        return () => {
            w.removeEventListener('resize', handleResize);
            w.removeEventListener('orientationChange', handleResize);
        };
    }, []);

    return {
        width,
        height
    };
}

export default useWindowSize;
