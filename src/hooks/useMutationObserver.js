import { useEffect } from 'react';

const defaultOptions = { attributes: true, childList: true, subtree: true };

const useMutationObserver = (ref, callback, options = defaultOptions) => {
    useEffect(() => {
        if (ref.current) {
            const observer = new MutationObserver(callback);

            observer.observe(ref.current, options);
            return () => {
                observer.disconnect();
            };
        }
    }, [callback, options]);
};

export default useMutationObserver;
