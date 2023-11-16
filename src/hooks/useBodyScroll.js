import { useCallback } from 'react';

function useBodyScroll() {
    const lock = useCallback(() => {
        document.body.style.overflow = 'hidden';
    }, []);

    const unlock = useCallback(() => {
        document.body.style.overflow = 'auto';
    }, []);

    return {
        lock,
        unlock
    };
}

export default useBodyScroll;
