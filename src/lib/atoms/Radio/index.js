import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { checkboxRadioSwitcherConfig } from 'configs';
import { interceptValue, guid } from 'utils';

import 'src/assets/styles/checkboxRadioSwitcher.scss';

const Radio = forwardRef(
    (
        {
            size,
            label,
            labelPosition,
            labelAlignment,
            description,
            readOnly,
            disabled,
            required,
            isValid,
            errorText,
            value,
            onChange,
            checked,
            className,
            type,
            ...restProps
        },
        ref
    ) => {
        const randomId = useMemo(guid, []);

        const handleChange = (e) => {
            onChange && onChange(interceptValue(e, value));
        };

        const hasError = !isValid;

        return (
            <div
                className={classnames(
                    'crs-holder',
                    className,
                    `lp-${labelPosition}`,
                    `la-${labelAlignment}`,
                    `t-${type}`,
                    {
                        disabled,
                        error: hasError,
                        'read-only': readOnly,
                        'input-active': checked
                    }
                )}
            >
                <div
                    className={classnames('label-holder', {
                        'has-label': !!label
                    })}
                >
                    {label && (
                        <div className="crs-item crs-label">
                            <label className="ellipsis-text" htmlFor={randomId}>
                                {required && `* `}
                                {label}
                            </label>
                        </div>
                    )}
                    <div className="crs-item crs-component">
                        <input
                            type="radio"
                            onChange={handleChange}
                            ref={ref}
                            id={randomId}
                            checked={checked}
                            {...restProps}
                        />
                        <label
                            className={classnames('radio', 'cr-element', `s-${size}`, {
                                active: checked,
                                'error-color': !checked && !errorText && hasError
                            })}
                            htmlFor={randomId}
                        />
                    </div>
                </div>
                {hasError && errorText && <div className="information-message color-danger">{errorText}</div>}
                {description && type !== 'tab' && <div className="input-description">{description}</div>}
            </div>
        );
    }
);

Radio.propTypes = {
    /**
     * Radio size
     */
    size: PropTypes.oneOf(checkboxRadioSwitcherConfig.size),
    /**
     * A label will be added to the Radio
     */
    label: PropTypes.string,
    /**
     * Specify the label position
     */
    labelPosition: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelPosition),
    /**
     * Specify the label alignment
     */
    labelAlignment: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelAlignment),
    /**
     * Optional description field
     */
    description: PropTypes.string,
    /**
     * Will make Radio readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * Will make Radio disabled when set to "true"
     */
    disabled: PropTypes.bool,
    /**
     * Radio will add an extra asterix to the "label". For more info see "ValidatableRadio"(integrated Radio with "Form" organism).
     */
    required: PropTypes.bool,
    /**
     * Control Radio validation. For more info see "ValidatableRadio"(integrated Radio with "Form" organism).
     */
    isValid: PropTypes.bool,
    /**
     * Shows error text when "isValid" is set to "false".
     */
    errorText: PropTypes.string,
    /**
     * Use this prop to get specified value when "onChange" is fired
     */
    value: PropTypes.any,
    /**
     * Fires an event when Radio is clicked((event: Event) => void).
     */
    onChange: PropTypes.func,
    /**
     * Specifies does the Radio checked or not.
     */
    checked: PropTypes.bool,
    /**
     * Needed for "RadioGroup" molecule
     */
    name: PropTypes.string,
    /**
     * Type defines the appearance of the radio
     */
    type: PropTypes.oneOf(['default', 'tab'])
};

Radio.defaultProps = {
    size: checkboxRadioSwitcherConfig.size[0],
    label: '',
    labelPosition: checkboxRadioSwitcherConfig.labelPosition[0],
    labelAlignment: checkboxRadioSwitcherConfig.labelAlignment[0],
    description: '',
    readOnly: false,
    disabled: false,
    required: false,
    isValid: true,
    errorText: '',
    checked: false,
    type: 'default'
};

export default Radio;
