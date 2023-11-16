import { useRef, useCallback, useEffect } from 'react';

function useClick(callback) {
    const ref = useRef();

    const handleClick = useCallback(
        (e) => {
            if (ref.current && ref.current.contains(e.target)) {
                callback && callback(e);
            }
        },
        [ref.current, callback]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [handleClick]);

    const setRef = (node) => (ref.current = node);

    return setRef;
}

export default useClick;
