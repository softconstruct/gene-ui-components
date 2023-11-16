import { useCallback, useEffect } from 'react';

const useKeyDown = (callback, deps, ref, keys = []) => {
    const handleKeyDown = useCallback(
        (e) => {
            if (!keys.length || keys.includes(e.key)) {
                callback(e);
            }
        },
        [...keys, ...deps]
    );

    useEffect(() => {
        if (ref && ref.current) {
            ref.current.addEventListener('keydown', handleKeyDown);
            return () => ref?.current?.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleKeyDown, ref.current]);
};

export default useKeyDown;
