import { useRef, useMemo } from 'react';

const usePrevious = (callback, deps) => {
    const previous = useRef();

    const value = useMemo(() => callback(previous.current), deps);
    previous.current = value;

    return value;
};

export default usePrevious;
