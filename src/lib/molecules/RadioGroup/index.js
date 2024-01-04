import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { childrenOf } from 'utils';
import Radio from '../../atoms/Radio';

function RadioGroup(props) {
    const { defaultValue, name, options, descriptionKey, disabled, onChange, required, type, ...restProps } = props;

    const [valueState, setValueState] = useState(defaultValue);

    const isControlled = !!props.value;

    const value = isControlled ? props.value : valueState;

    const handleChange = useCallback(
        (e) => {
            !isControlled && setValueState(e.target.value);

            onChange && onChange(e);
        },
        [isControlled, onChange]
    );

    return (
        <div className={classnames('cha-ra-group', `t-${type}`)}>
            {options.map((option) => {
                const isOptionsString = typeof option === 'string';
                const optionValue = isOptionsString ? option : option.value;
                const label = isOptionsString ? option : option.label;

                return (
                    <Radio
                        key={optionValue}
                        name={name}
                        label={label}
                        description={option[descriptionKey]}
                        disabled={disabled || option.disabled}
                        checked={optionValue === value}
                        onChange={handleChange}
                        {...restProps}
                        value={optionValue}
                        type={type}
                    />
                );
            })}
        </div>
    );
}

RadioGroup.propTypes = {
    /**
     * Disabled state
     */
    disabled: PropTypes.bool,
    /**
     * Validation state
     */
    required: PropTypes.bool,
    /**
     * Options/items for radio group
     */
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([
            childrenOf([Radio]),
            PropTypes.shape({
                label: Radio.propTypes.label,
                value: Radio.propTypes.value,
                disabled: Radio.propTypes.disabled
            })
        ])
    ),
    /**
     * Initial value.
     */
    defaultValue: Radio.propTypes.value,
    /**
     * Name of appropriate radio group
     */
    name: Radio.propTypes.name.isRequired,
    /**
     * Selected option's value
     */
    value: Radio.propTypes.value,
    /**
     * Fires an event on change((event: Event) => void)
     */
    onChange: PropTypes.func,
    /**
     * Type defines the appearance of the radio
     */
    type: PropTypes.oneOf(['default', 'tab']),
    /**
     * Description definer: one of keys from your object
     */
    descriptionKey: PropTypes.string
};

RadioGroup.defaultProps = {
    disabled: false,
    required: false,
    options: [],
    type: 'default',
    descriptionKey: 'description'
};

export default RadioGroup;
