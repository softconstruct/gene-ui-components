import { useState, useCallback } from 'react';

function useToggle(defaultValue) {
    const [state, setState] = useState(!!defaultValue);

    const toggle = useCallback((value) => {
        setState((prev) => (typeof value === 'undefined' ? !prev : !!value));
    }, []);

    return [state, toggle];
}

export default useToggle;
