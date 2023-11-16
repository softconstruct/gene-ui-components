import { useRef, useEffect } from 'react';

function useUpdate(callback, dependencies) {
    const initial = useRef(true);
    useEffect(
        initial.current
            ? () => {
                  initial.current = false;
              }
            : callback,
        dependencies
    );
}

export default useUpdate;
