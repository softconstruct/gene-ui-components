import { useEffect, useState } from 'react';

interface IUseStateControlled<S> {
    (controlledValue: S | undefined, defaultValue: S): [S, (value: S) => void];
}

const useStateControlled: IUseStateControlled<any> = (controlledValue, defaultValue) => {
    const isControlled = controlledValue !== undefined;

    const [state, setState] = useState(isControlled ? controlledValue : defaultValue);

    useEffect(() => {
        if (isControlled) {
            // Sync with controlled value
            setState(controlledValue);
        }
    }, [controlledValue]);

    const updateState = (value: any) => {
        if (!isControlled) {
            // Allow internal state update only when uncontrolled
            setState(value);
        }
    };

    return [state, updateState];
};

export default useStateControlled;
