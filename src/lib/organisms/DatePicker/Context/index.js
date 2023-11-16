import React, { createContext, useState, useCallback, useContext } from 'react';
import defaultConfigs from './configs';

const Context = createContext([defaultConfigs]);

function Provider({ children }) {
    const [state, setState] = useState(defaultConfigs);

    const setter = useCallback((next) => {
        setState({ ...defaultConfigs, ...next });
    }, []);

    return <Context.Provider value={[state, setter]}>{children}</Context.Provider>;
}

const useDatePickerContext = () => {
    const [configs, setConfigs] = useContext(Context);
    return [configs, setConfigs];
};

export { Provider, useDatePickerContext };
export default Context;
