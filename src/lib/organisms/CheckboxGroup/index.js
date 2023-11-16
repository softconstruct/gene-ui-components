import React, { useState, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { checkboxRadioSwitcherConfig } from 'configs';
import { noop } from 'utils';

import Checkbox from '../../molecules/Checkbox';

import 'src/assets/styles/globalStyling.scss';

function CheckboxGroup(props) {
    const {
        defaultSelected,
        hoveredState,
        labelAlignment,
        showSelectAll,
        labelPosition,
        checkAllText,
        description,
        errorText,
        className,
        disabled,
        onChange,
        readOnly,
        required,
        isValid,
        data,
        size,
        ...restProps
    } = props;

    const [valueState, setValueState] = useState(defaultSelected);
    const isControlled = 'value' in props && props.value;
    const values = isControlled ? props.value : valueState;

    useEffect(() => {
        setValueState(defaultSelected);
    }, [defaultSelected]);

    const handleChange = useCallback(
        (e) => {
            const { checked, value } = e.target;
            const newValues = checked ? values.concat(value) : values.filter((item) => item !== value);

            !isControlled && setValueState(newValues);
            onChange && onChange(newValues);
        },
        [isControlled, onChange, values]
    );

    const handleChangeAll = useCallback(
        (e) => {
            const { checked } = e.target;
            const newValues = checked ? data.filter((option) => !option.disabled).map((option) => option.value) : [];

            !isControlled && setValueState(newValues);
            onChange && onChange(newValues);
        },
        [data, isControlled, onChange]
    );

    const dataLength = data.filter((item) => !item.disabled).length;
    const valuesLength = values.length;

    return (
        <div className={classnames('cha-ra-group', className)} {...restProps}>
            {showSelectAll && data.length > 1 && (
                <Checkbox
                    value="all"
                    disabled={dataLength ? disabled : true}
                    checked={valuesLength === dataLength}
                    indeterminate={valuesLength > 0 && valuesLength < dataLength}
                    onChange={handleChangeAll}
                    label={checkAllText}
                    size={size}
                    labelPosition={labelPosition}
                    labelAlignment={labelAlignment}
                    readOnly={readOnly}
                />
            )}
            {data.map((option, index) => {
                const isTypeofString = typeof option === 'string';
                const label = isTypeofString ? option : option.label;
                const value = isTypeofString ? option : option.value;

                return (
                    <Checkbox
                        labelTooltip={option.labelTooltip || ''}
                        className={classnames(option.className, {
                            active: hoveredState === index
                        })}
                        key={value}
                        disabled={disabled || option.disabled}
                        label={label}
                        value={value}
                        checked={values.includes(value)}
                        onChange={handleChange}
                        description={description || option.description}
                        readOnly={readOnly || option.readOnly}
                        required={required || option.required}
                        isValid={!(isValid || option.isValid)}
                        errorText={errorText || option.errorText}
                        size={size}
                        labelPosition={labelPosition}
                        labelAlignment={labelAlignment}
                    />
                );
            })}
        </div>
    );
}

CheckboxGroup.propTypes = {
    /** Initially selected value */
    defaultSelected: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number])),
    /**
     * Disables events
     */
    disabled: PropTypes.bool,
    /**
     * If data item is typeof string than value will apply both as checkbox label and value,
     * Label: The text of the associated element.
     * Value: The input value
     * Disabled: A checkbox can appear disabled and be unable to change states
     * readOnly: A checkbox can be read-only and unable to change states.
     * required: If true, the input element will be required.
     * labelTooltip: Tooltip for label.
     * description: Checkbox description.
     * isValid: Check validity of input value
     * errorText: Displays custom error text when input value is not valid
     */
    data: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                label: PropTypes.node,
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
                disabled: PropTypes.bool,
                description: PropTypes.string,
                labelTooltip: PropTypes.string,
                readOnly: PropTypes.bool,
                required: PropTypes.bool,
                isValid: PropTypes.bool,
                errorText: PropTypes.string
            })
        ])
    ),
    /**
     * Custom text for checkAll checkbox
     */
    checkAllText: PropTypes.string,
    /**
     * Displays select all checkbox
     */
    showSelectAll: PropTypes.bool,
    /**
     * Array of values of the input elements
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    /**
     * Fires an event when Checkbox is clicked or "enter" key is pressed
     * (event: SyntheticEvent) => void
     */
    onChange: PropTypes.func,
    /**
     * Additional className which applies to group holder div element
     */
    className: PropTypes.string,
    /**
     * Accepts same values as Checkbox component(check in Checkbox component(molecules) propTable)
     */
    size: PropTypes.oneOf(checkboxRadioSwitcherConfig.size),
    /**
     * Specify "label" position
     */
    labelPosition: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelPosition),
    /**
     * Specify "label" alignment
     */
    labelAlignment: PropTypes.oneOf(checkboxRadioSwitcherConfig.labelAlignment),
    /**
     * Description for checkboxes
     */
    description: PropTypes.string,
    /**
     * Define is field read only or no.
     */
    readOnly: PropTypes.bool,
    /**
     * Define is field required or no.
     */
    required: PropTypes.bool,
    /**
     * Additional state for field validation
     */
    isValid: PropTypes.bool,
    /**
     * Text that will be shown id field is invalid
     */
    errorText: PropTypes.string
};

CheckboxGroup.defaultProps = {
    defaultSelected: [],
    disabled: false,
    showSelectAll: true,
    data: [],
    description: '',
    checkAllText: 'Select All',
    readOnly: false,
    required: false,
    isValid: true,
    onChange: noop,
    errorText: '',
    size: checkboxRadioSwitcherConfig.size[0],
    labelPosition: checkboxRadioSwitcherConfig.labelPosition[0],
    labelAlignment: checkboxRadioSwitcherConfig.labelAlignment[0]
};

export default CheckboxGroup;
