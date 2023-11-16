import React, { useMemo, useCallback } from 'react';
import dayjs from 'dayjs';

import Button from '../../../atoms/Button';

import { useDatePickerContext } from '../Context';

import { getDefaultOptions, getOptionIndex } from './options';

function RangeOption({ start, end, selected, children, onClick, ...restProps }) {
    const handleClick = useCallback(() => onClick && onClick([start, end]), [onClick, start, end]);

    return (
        <Button
            appearance={selected ? 'default' : 'minimal'}
            color="default"
            flexibility="full-width"
            onClick={handleClick}
            {...restProps}
        >
            {children}
        </Button>
    );
}

function RangeOptions({ rangeStart, rangeEnd, onClick, customOptions, defaultTimeValues, customText }) {
    const [contextConfigs] = useDatePickerContext();

    const options = useMemo(
        () =>
            customOptions
                ? customOptions.map(({ start, end, ...props }) => ({
                      ...props,
                      start: dayjs.isDayjs(start) ? start : dayjs(start),
                      end: dayjs.isDayjs(end) ? end : dayjs(end)
                  }))
                : getDefaultOptions(defaultTimeValues, contextConfigs.actions),
        [customOptions, contextConfigs]
    );

    const selectedIndex = useMemo(() => getOptionIndex(rangeStart, rangeEnd, options), [rangeStart, rangeEnd, options]);

    return (
        <>
            {options.map(({ start, end, name }, i) => (
                <RangeOption key={i} start={start} end={end} selected={i === selectedIndex} onClick={onClick}>
                    {name}
                </RangeOption>
            ))}
            <RangeOption className="pointer-events-none" selected={rangeStart && rangeEnd && selectedIndex === -1}>
                {customText || contextConfigs.actions.custom}
            </RangeOption>
        </>
    );
}

export default RangeOptions;
