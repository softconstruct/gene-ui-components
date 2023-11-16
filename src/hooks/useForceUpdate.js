import { useReducer } from 'react';

const useForceUpdate = () => {
    const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
    return forceUpdate;
};

export default useForceUpdate;
