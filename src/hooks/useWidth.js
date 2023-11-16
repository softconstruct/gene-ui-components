import { useState, useEffect } from 'react';
import useWindowSize from './useWindowSize';

function useWidth(ref) {
    const [width, setWidth] = useState(null);

    const { width: windowWidth } = useWindowSize();

    useEffect(() => {
        setWidth(ref.current.clientWidth);
    }, [ref.current, windowWidth]);

    return width;
}

export default useWidth;
