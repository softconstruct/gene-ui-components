import React, { useState, forwardRef, useRef, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Helpers
import { inputConfig, screenTypes } from 'configs';
import { noop, stopEvent } from 'utils';
import { useDeviceType, useEllipsisDetection } from 'hooks';

// Components
import Icon from '../../atoms/Icon';
import SuggestionList from '../SuggestionList';
import Tooltip from '../Tooltip';

// Styles
import './index.scss';

function replaceBetween(start, end, initial, what) {
    return initial.substring(0, start) + what + initial.substring(end);
}

function createCustomInputEvent(ref, value = '') {
    const event = new Event('input', { bubbles: true });
    ref.value = String(value);
    ref.dispatchEvent(event);
    return event;
}

const ExtendedInput = forwardRef((props, ref) => {
    const {
        max,
        min,
        icon,
        type,
        step,
        value,
        label,
        onBlur,
        onFocus,
        onClear,
        isValid,
        onClick,
        canClear,
        disabled,
        onChange,
        required,
        readOnly,
        className,
        errorText,
        inputSize,
        maxLength,
        isDropdown,
        appearance,
        screenType,
        placeholder,
        flexibility,
        description,
        onIconClick,
        withInfoIcon,
        colorOnValid,
        defaultValue,
        cornerRadius,
        showErrorIcon,
        clickableIcon,
        infoIconTitle,
        writeProtected,
        showNumberIcon,
        itemsDirection,
        showIconOnValid,
        labelAppearance,
        colorBorderOnError,
        showRemainingLength,
        showErrorWithTooltip,
        showClickableTooltipOnError,
        startAdornment,
        tooltipText,
        endAdornment,
        suggestionData,
        ...restProps
    } = props;
    const { isMobile } = useDeviceType(screenType);

    const inputRef = useRef();
    const textareaRef = useRef();
    const iconRef = useRef();

    const [localValue, setLocalValue] = useState(defaultValue);
    const [focused, setFocused] = useState(false);
    const [isBlurInitiatorIcon, setIsBlurInitiatorIcon] = useState(false);

    const isControlled = 'value' in props && typeof value !== 'undefined';
    // non strict equality is needed for covering 'undefined' case also
    const inputValue = isControlled ? (value != null ? value : '') : localValue;

    const [isTextTruncated, setIsTextTruncated] = useState(false);
    const isTruncated = useEllipsisDetection(inputRef, [inputValue]);
    useEffect(() => setIsTextTruncated(isTruncated), [isTruncated]);

    useEffect(() => {
        isControlled && value && value !== inputValue && setLocalValue(value);
    }, [value, isControlled, inputValue]);

    const hasError = !isValid;

    const showTooltip =
        tooltipText && isValid ? tooltipText : showErrorWithTooltip && hasError && errorText ? errorText : '';

    const handleChange = (e) => {
        const { value } = e.target;

        !isControlled && setLocalValue(value);
        onChange(e);
    };

    const handleFocus = useCallback(
        (e) => {
            if (isDropdown && (writeProtected || isMobile)) {
                stopEvent(e, true);
                inputRef?.current?.blur();
            } else {
                setFocused(true);
                onFocus(e);
            }
        },
        [onFocus, isTextTruncated, isMobile, value]
    );

    const handleIconClick = useCallback(
        (e) => {
            // We will remove this later, when get report who use this
            if (clickableIcon) {
                onClick(e);
                onIconClick(e, isBlurInitiatorIcon);

                if (isBlurInitiatorIcon) {
                    iconRef.current.blur();
                    setIsBlurInitiatorIcon(false);
                }
            }
        },
        [clickableIcon, onClick, onIconClick, isBlurInitiatorIcon]
    );

    const handleBlur = useCallback(
        (e) => {
            setFocused(false);
            setIsBlurInitiatorIcon(iconRef.current === e.relatedTarget);
            onBlur(e);
        },
        [onBlur]
    );

    const handleDropdownIconClick = useCallback(
        (e) => {
            if (isDropdown) {
                onClick(e);
                if (!readOnly) {
                    focused ? inputRef.current.blur() : inputRef.current.focus();
                }
            }
        },
        [isDropdown, onClick, focused, inputRef.current]
    );

    const handleStepUp = (e) => {
        const number = Math.floor(inputValue) + step;
        const nextValue = number < min ? min : number > max ? max : number;
        const event = createCustomInputEvent(inputRef.current, nextValue);

        handleChange(event);
    };

    const handleStepDown = (e) => {
        const number = Math.ceil(inputValue) - step;
        const nextValue = number < min ? min : number > max ? max : number;
        const event = createCustomInputEvent(inputRef.current, nextValue);

        handleChange(event);
    };

    const handleClear = () => {
        const event = createCustomInputEvent(type === 'textarea' ? textareaRef.current : inputRef.current);
        handleChange(event);
        onClear(event);
    };

    const handleRef = (val) => {
        if (ref) {
            ref.current = val;
        }

        if (type !== 'textarea') {
            inputRef.current = val;
        } else {
            textareaRef.current = val;
        }
    };

    const fieldStep = type === 'number' ? { step } : {};
    const numberedValue = Number(inputValue);
    const inputLabel = label || placeholder;
    const asterisk = required ? '* ' : '';

    const inputPlaceholder = !readOnly && placeholder ? `${asterisk}${placeholder}` : '';
    const hasFakePlaceholder = type === 'date' || type === 'time' || type === 'datetime-local';

    const sharedProps = {
        onClick,
        required,
        ref: handleRef,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onChange: handleChange,
        disabled,
        maxLength,
        placeholder: inputPlaceholder,
        readOnly: readOnly || writeProtected,
        className: classnames('input-element', {
            'read-only': readOnly,
            placeholder: !inputValue,
            'write-protected': writeProtected,
            'textarea-element': type === 'textarea',
            hide: !inputValue && hasFakePlaceholder
        }),
        ...restProps
    };

    const onChangeSuggestionData = useCallback(
        ({ from, to, data }) => {
            const { value } = data;
            const input = textareaRef.current;
            const lastValue = input.value;
            input.value = replaceBetween(from, to, inputValue, value);
            const event = new Event('input', { bubbles: true });
            const tracker = input._valueTracker;
            tracker && tracker.setValue(lastValue);
            input.dispatchEvent(event);
        },
        [inputValue]
    );

    const onAddPlaceholder = useCallback(
        ({ from, to, data }) => {
            const { value } = data;
            textareaRef.current.value = replaceBetween(from, to, inputValue, value);
        },
        [inputValue]
    );

    const maxMinValidator = useCallback(
        (num, type) =>
            disabled ||
            (num?.toString().length &&
                (Math.ceil(num) === 0 || Math.ceil(num)) &&
                (type === 'max' ? numberedValue >= num : numberedValue <= num)),
        [max, min, numberedValue]
    );

    useEffect(() => {
        if (document.activeElement !== inputRef.current && focused) inputRef.current.focus();
    }, [showTooltip, inputRef, focused]);

    return (
        <Tooltip position="bottom" title={showTooltip} isVisible={!!showTooltip}>
            <div
                className={classnames(
                    'input-holder',
                    `a-${appearance}`,
                    `s-${inputSize}`,
                    `id-${itemsDirection}`,
                    `f-${flexibility}`,
                    `cr-${cornerRadius}`,
                    `t-${type}`,
                    className,
                    {
                        disabled,
                        'read-only': readOnly,
                        'error-color': hasError && colorBorderOnError,
                        'success-color': isValid && colorOnValid,
                        filled: inputValue
                    }
                )}
            >
                {type === 'textarea' &&
                    !readOnly &&
                    !isDropdown &&
                    !isMobile &&
                    suggestionData &&
                    Array.isArray(suggestionData) && (
                        <SuggestionList
                            elemRef={textareaRef}
                            onChange={onChangeSuggestionData}
                            onHover={onAddPlaceholder}
                            data={suggestionData}
                        />
                    )}
                {labelAppearance === inputConfig.labelAppearance[1] && (
                    <div className="input-title ellipsis-text">
                        <Tooltip position="auto" title={`${asterisk} ${inputLabel}`}>
                            <span className="ellipsis-text">
                                {asterisk} {inputLabel}
                            </span>
                        </Tooltip>
                        {withInfoIcon && (
                            <Tooltip position="auto" title={infoIconTitle}>
                                <Icon type="bc-icon-info" />
                            </Tooltip>
                        )}
                    </div>
                )}
                <div className="input-structure">
                    {startAdornment}
                    {icon && (
                        <span
                            ref={iconRef}
                            tabIndex="0"
                            className={classnames('icon-holder', {
                                'icon-holder-disabled': disabled
                            })}
                        >
                            <Icon type={icon} onClick={handleIconClick} onMouseDown={handleDropdownIconClick} />
                        </span>
                    )}
                    <label>
                        <div className="input-element-relative">
                            {readOnly || (isDropdown && isMobile) ? (
                                <div {...sharedProps}>
                                    <div className={type === 'textarea' ? 'textarea-element-content' : 'ellipsis-text'}>
                                        {typeof inputValue === 'number' ? inputValue : inputValue || inputPlaceholder}
                                    </div>
                                </div>
                            ) : type !== 'textarea' ? (
                                <input
                                    {...sharedProps}
                                    {...fieldStep}
                                    max={max}
                                    min={min}
                                    type={type}
                                    size={flexibility === 'content-size' ? 1 : null}
                                    value={inputValue}
                                />
                            ) : (
                                <textarea
                                    {...sharedProps}
                                    value={
                                        textareaRef.current?.isSuggestionListOpen
                                            ? textareaRef.current.value
                                            : inputValue
                                    }
                                />
                            )}
                            {hasFakePlaceholder && (
                                <div
                                    className={classnames('input-fake-placeholder', {
                                        hide: inputValue
                                    })}
                                >
                                    {inputPlaceholder && <div className="ellipsis-text">{inputPlaceholder}</div>}
                                </div>
                            )}
                        </div>
                        {flexibility === 'content-size' && (
                            <div className="fit-content-hack">
                                <div className="input-element">
                                    {asterisk} {placeholder.length > `${inputValue}`.length ? placeholder : inputValue}
                                </div>
                            </div>
                        )}
                        <div className="input-element-back">
                            {labelAppearance === inputConfig.labelAppearance[2] && (
                                <div className="input-swap-label">
                                    <div className="input-swap">
                                        <div
                                            className={classnames('input-swap-animate ellipsis-text', {
                                                hide: !inputValue && inputValue !== 0
                                            })}
                                        >
                                            <span className="ellipsis-text">
                                                {asterisk} {inputLabel}
                                            </span>
                                            {withInfoIcon && (
                                                <Tooltip position="auto" title={infoIconTitle}>
                                                    <Icon type="bc-icon-info" />
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </label>
                    {canClear && !!inputValue && !readOnly && (
                        <Icon
                            type="bc-icon-clear"
                            disabled={disabled}
                            onClick={handleClear}
                            className="cursor-pointer"
                        />
                    )}
                    {isDropdown && <Icon type="bc-icon-arrow-down" onMouseDown={handleDropdownIconClick} />}
                    {type === 'number' && showNumberIcon && !readOnly && (
                        <div className="number-actions-holder">
                            <ul>
                                <li
                                    className={classnames('number-action', 'bc-icon-input-number-up', {
                                        disabled: maxMinValidator(max, 'max')
                                    })}
                                    onClick={handleStepUp}
                                />
                                <li
                                    className={classnames('number-action', 'bc-icon-input-number-down', {
                                        disabled: maxMinValidator(min, 'min')
                                    })}
                                    onClick={handleStepDown}
                                />
                            </ul>
                        </div>
                    )}
                    {hasError && showErrorIcon && (
                        <Icon className="validation-icon pointer-events-none color-danger" type="bc-icon-error-info" />
                    )}
                    {isValid && showIconOnValid && (
                        <Icon className="validation-icon pointer-events-none color-confirm" type="bc-icon-validated" />
                    )}
                    {showRemainingLength && !!maxLength && (
                        <div className="end-add-on">{maxLength - `${inputValue}`.length}</div>
                    )}
                    {endAdornment}
                </div>
                {!showErrorWithTooltip && hasError && errorText && (
                    <div className="information-message color-danger">{errorText}</div>
                )}
                {description && <div className="input-description">{description}</div>}
            </div>
        </Tooltip>
    );
});

ExtendedInput.propTypes = {
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Control ExtendedInput disabled state with this prop
     */
    disabled: PropTypes.bool,
    /**
     * Borders will be colored on when "isValid" and this props are set to "true"
     */
    colorBorderOnError: PropTypes.bool,
    /**
     * Shows an icon to clear ExtendedInput's value when set to "true"
     */
    showClearIcon: PropTypes.bool,
    /**
     * Use this props in combo with "icon" prop. This will fire on icon click when set to "true"
     */
    clickableIcon: PropTypes.bool,
    /**
     * Shows an error icon when "isValid" is set to "false" and this prop is set to "true"
     */
    showErrorIcon: PropTypes.bool,
    /**
     * Shows an "Icon" for number inputs, when "type" is set to "number" and this prop is et to "true"
     */
    showNumberIcon: PropTypes.bool,
    /**
     *.
     */
    showClickableTooltipOnError: PropTypes.bool,
    /**
     * ExtendedInput borders are colored when "isValid" and this props are set to "true"
     */
    colorOnValid: PropTypes.bool,
    /**
     * ExtendedInput will display an icon when "isValid" and this props are set to "true"
     */
    showIconOnValid: PropTypes.bool,
    /**
     * Shows the "errorText" value in "Tooltip" when set to "true"
     */
    showErrorWithTooltip: PropTypes.bool,
    /**
     * Control ExtendedInput validation. For more info see "ValidatableNumberInput", "ValidatableTextInput"(integrated ExtendedInputs with "Form" organism).
     */
    isValid: PropTypes.bool,
    /**
     * Use this prop to specify error message. This will be displayed when "isValid" is set to "false"
     */
    errorText: PropTypes.string,
    /**
     * Use this prop to specify tooltip message.
     */
    tooltipText: PropTypes.string,
    /**
     * Specify increment or decrement value, when arrow up or down are clicked
     */
    step: PropTypes.number,
    /**
     * Valid values are same as "Icon" type
     */
    icon: PropTypes.string,
    /**
     * ExtendedInput placeholder
     */
    placeholder: PropTypes.string,
    /**
     * Control items direction
     */
    itemsDirection: PropTypes.oneOf(inputConfig.itemsDirection),
    /**
     * Use this prop to control ExtendedInput state. Note that when you specify this prop, the ExtendedInput will not functionate itself
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * ExtendedInput type
     */
    type: PropTypes.oneOf(inputConfig.type).isRequired,
    /**
     * ExtendedInput appearance
     */
    appearance: PropTypes.oneOf(inputConfig.appearance),
    /**
     * ExtendedInput size
     */
    inputSize: PropTypes.oneOf(inputConfig.size),
    /**
     * ExtendedInput corner radius
     */
    cornerRadius: PropTypes.oneOf(inputConfig.cornerRadius),
    /**
     * Will make ExtendedInput readonly when set to "true"
     */
    readOnly: PropTypes.bool,
    /**
     * How to display inscription in relation to it's parent in ExtendedInput
     */
    flexibility: PropTypes.oneOf(inputConfig.flexibility),
    /**
     * This prop will only applied once as defaultState for "value" when ExtendedInput mounts.
     * Note that specifying this prop is not mean controlling it.
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Shows an "Icon" to remove ExtendedInput's value
     */
    canClear: PropTypes.bool,
    /**
     * Fires an event on clear "Icon" click((element: Element) => void)
     */
    onClear: PropTypes.func,
    /**
     * Fires an event on ExtendedInput change((event: Event) => void)
     */
    onChange: PropTypes.func,
    /**
     * Specify a label for ExtendedInput
     */
    label: PropTypes.string,
    /**
     * Specify a "label" appearance
     */
    labelAppearance: PropTypes.oneOf(inputConfig.labelAppearance),
    /**
     * Will add an additional description field
     */
    description: PropTypes.node,
    /**
     * Property is needed for "Dropdown" organism usage
     */
    isDropdown: PropTypes.bool,
    /**
     * Fires an event on ExtendInput <input /> click((event: Event => void))
     */
    onClick: PropTypes.func,
    /**
     * Typing will be blocked when set to "true". Note design is different from "readonly" prop's design
     */
    writeProtected: PropTypes.bool,
    /**
     * Input field maximum value
     */
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Input field minimum value
     */
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Callback fires when input is focused
     */
    onFocus: PropTypes.func,
    /**
     * Callback fires when input loose focus
     */
    onBlur: PropTypes.func,
    /**
     * Callback fires when clicked the icon </br>
     * as a first parameter passed native event </br>
     * as a second parameter passed is blur function </br>
     * initiated by icon click
     */
    onIconClick: PropTypes.func,
    /**
     * Define is input required or no.
     */
    required: PropTypes.bool,
    /**
     * The switch between mobile and desktop version
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Define is  need input info icon required.
     */
    withInfoIcon: PropTypes.bool,
    /**
     * ExtendedInput info icon title.
     */
    infoIconTitle: PropTypes.string,
    /**
     * Max Length of input Value
     */
    maxLength: PropTypes.number,
    /**
     * Show Remaining Length of input value, works only with maxLength
     */
    showRemainingLength: PropTypes.bool,
    /**
     * Decoration that can be added to the inner input field at the start
     */
    startAdornment: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number, PropTypes.node]),
    /**
     * Decoration that can be added to the inner input field at the end
     */
    endAdornment: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number, PropTypes.node])
};

ExtendedInput.defaultProps = {
    step: 1,
    placeholder: '',
    itemsDirection: inputConfig.itemsDirection[0],
    type: inputConfig.type[0],
    appearance: inputConfig.appearance[0],
    inputSize: inputConfig.size[1],
    cornerRadius: inputConfig.cornerRadius[0],
    clickableIcon: false,
    readOnly: false,
    flexibility: inputConfig.flexibility[0],
    colorBorderOnError: true,
    showErrorIcon: false,
    showNumberIcon: true,
    showClickableTooltipOnError: true,
    showErrorWithTooltip: false,
    colorOnValid: false,
    showIconOnValid: false,
    canClear: false,
    isValid: true,
    onChange: noop,
    onClick: noop,
    onClear: noop,
    onFocus: noop,
    onBlur: noop,
    onIconClick: noop,
    withInfoIcon: false,
    infoIconTitle: '',
    label: '',
    labelAppearance: inputConfig.labelAppearance[0],
    description: '',
    isDropdown: false,
    writeProtected: false,
    defaultValue: '',
    screenType: screenTypes[0]
};

export default ExtendedInput;
