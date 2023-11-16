import { useRef, useCallback } from 'react';

import useForceUpdate from './useForceUpdate';

const useUpdatableRef = (initial) => {
    const ref = useRef(initial);
    const forceUpdate = useForceUpdate();

    const update = useCallback((value) => {
        if (ref.current !== value) forceUpdate();
        ref.current = value;
    }, []);

    return [ref, update];
};

export default useUpdatableRef;
