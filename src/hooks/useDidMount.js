import { useRef, useEffect } from 'react';

const useDidMount = (callback = () => {}, deps = []) => {
    const _isFirstUpdate = useRef(true);

    useEffect(() => {
        if (!_isFirstUpdate.current) {
            callback();
        }
        _isFirstUpdate.current = false;
    }, deps);
};

export default useDidMount;
