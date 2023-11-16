import { useRef, useCallback, useEffect } from 'react';

function useClickOutside(callback, relativeElements) {
    const ref = useRef();

    const handleClickOutside = useCallback(
        (e) => {
            const { target } = e;
            const isNotRelativeTarget =
                Array.isArray(relativeElements) && relativeElements.length
                    ? relativeElements?.find((relativeRef) => !relativeRef.current?.contains(target))
                    : true;

            if (ref.current && !ref.current?.contains(target) && isNotRelativeTarget) {
                callback && callback(e);
            }
        },
        [ref.current, callback, relativeElements]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    return (node) => (ref.current = node);
}

export default useClickOutside;
