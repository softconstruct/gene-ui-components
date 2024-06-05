import React, { FC, useEffect } from 'react';
import { IDrawConfigData } from './Types';

interface IDrawElementDataProps extends Omit<IDrawConfigData, 'rules' | 'watch' | 'register'> {}

const DrawElementData: FC<IDrawElementDataProps> = ({
    Element,
    trigger,
    props,
    getFieldState,
    elementError,
    name,
    Wrapper,
    value
}) => {
    const getErrorState = getFieldState(name);

    const defaultValue = value ? { defaultValue: value, value } : {};
    useEffect(() => {
        if (elementError) {
            trigger(name);
        }
    }, [elementError]);

    if (Wrapper) {
        return (
            <Wrapper>
                <Element
                    {...props}
                    errorText={elementError?.message}
                    isValid={!getErrorState.invalid}
                    {...defaultValue}
                />
            </Wrapper>
        );
    } else {
        return (
            <Element {...props} errorText={elementError?.message} isValid={!getErrorState.invalid} {...defaultValue} />
        );
    }
};

export default DrawElementData;
