import React, { useCallback } from 'react';

import Button from '../../../atoms/Button';

const format = (value) => `${String(value).length === 1 ? '0' : ''}${value}`;

function TimeInput({ value, onChange }) {
    const handleChange = useCallback(
        (val, unit) => {
            if (val || val === 0) {
                onChange && onChange(value.set(unit, value.get(unit) + val));
            }
        },
        [value, onChange]
    );

    return (
        <ul className="time-inputs-str">
            <li>
                <Button
                    onClick={() => handleChange(1, 'h')}
                    color="default"
                    appearance="minimal"
                    icon="bc-icon-arrow-up"
                />
                <Button
                    onClick={() => handleChange(-1, 'h')}
                    color="default"
                    appearance="minimal"
                    icon="bc-icon-arrow-down"
                />
                <div className="time-input-el">{format(value.get('h'))}</div>
            </li>
            <li>
                <span>:</span>
            </li>
            <li>
                <Button
                    onClick={() => handleChange(1, 'm')}
                    color="default"
                    appearance="minimal"
                    icon="bc-icon-arrow-up"
                />
                <Button
                    onClick={() => handleChange(-1, 'm')}
                    color="default"
                    appearance="minimal"
                    icon="bc-icon-arrow-down"
                />
                <div className="time-input-el">{format(value.get('m'))}</div>
            </li>
            <li>
                <span>:</span>
            </li>
            <li>
                <Button
                    onClick={() => handleChange(1, 's')}
                    color="default"
                    appearance="minimal"
                    icon="bc-icon-arrow-up"
                />
                <Button
                    onClick={() => handleChange(-1, 's')}
                    color="default"
                    appearance="minimal"
                    icon="bc-icon-arrow-down"
                />
                <div className="time-input-el">{format(value.get('s'))}</div>
            </li>
        </ul>
    );
}

export default TimeInput;
