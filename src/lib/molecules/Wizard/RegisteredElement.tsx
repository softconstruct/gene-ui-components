import React, { FC, useEffect } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import { IDrawConfigData } from './Types';

const DrawConfigData: FC<IDrawConfigData> = ({
    Element,
    props,
    name,
    rules,
    getFieldState,
    elementError,
    watch,
    register,
    value,
    trigger,
    Wrapper
}) => {
    const getErrorState = getFieldState(name).invalid;
    const valueWithDebounce = useDebounce(watch(name));

    useEffect(() => {
        if (props) {
            const { onChange } = props;
            if (valueWithDebounce && onChange) {
                onChange(valueWithDebounce);
            }
        }
    }, [valueWithDebounce]);

    const getValuesForEveryElement = typeof value === 'boolean' ? { checked: value } : { value };

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
                    register={register}
                    name={name}
                    rules={rules}
                    errorText={elementError?.message}
                    hasError={getErrorState}
                    isValid={!getErrorState}
                    {...getValuesForEveryElement}
                />
            </Wrapper>
        );
    } else {
        return (
            <Element
                {...props}
                register={register}
                name={name}
                rules={rules}
                errorText={elementError?.message}
                hasError={getErrorState}
                isValid={!getErrorState}
                {...getValuesForEveryElement}
            />
        );
    }
};

export default DrawConfigData;
