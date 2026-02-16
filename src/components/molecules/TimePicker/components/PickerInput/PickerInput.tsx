import React, { FC, KeyboardEvent, MouseEvent } from "react";
import classNames from "classnames";
import { MaskedPattern } from "imask/esm/index";

import { IconProps, Minus, X } from "@geneui/icons";

import Button from "@components/atoms/Button";
import HelperText from "@components/atoms/HelperText";
// Components
import Label from "@components/atoms/Label";
import Skeleton from "@components/atoms/Skeleton";

// Styles
import "./PickerInput.scss";

import { TimeValue } from "../../TimePicker";
import MaskedInput from "../MaskedInput/MaskedInput";

interface IPickerInputProps {
    /**
     * Additional CSS classes for the root element.
     */
    className?: string;
    /**
     * Selected start date as a string.
     */
    startValue?: [TimeValue, TimeValue] | TimeValue;
    /**
     * Selected end date as a string.
     */
    endValue?: string | null;
    /**
     * Callback when the start date input is clicked.
     */
    onStartClick: () => void;
    /**
     * Callback when the end date input is clicked.
     */
    onEndClick?: () => void;
    /** * Callback when the input gains focus.
     */
    onFocus?: () => void;
    /** * Callback when the input loses focus.
     * */
    onBlur?: () => void;
    /**
     * Whether the input is clearable.
     */
    clearable?: boolean;
    /**
     * Whether the date picker is in range mode.
     */
    withRange?: boolean;
    /**
     * Whether the input is required.
     */
    required?: boolean;
    /**
     * Label text for the date picker input.
     */
    labelText?: string;
    /**
     * Error message to display below the input.
     */
    errorMessage?: string;
    /**
     * Whether the input is in an error state.
     */
    error?: boolean;
    /**
     * Whether the input is disabled.
     */
    disabled?: boolean;
    /**
     * Whether the input is read-only.
     */
    readOnly?: boolean;
    /**
     * Placeholder for the start date input.
     */
    startFieldPlaceholder?: string;
    /**
     * Placeholder for the end date input.
     */
    endFieldPlaceholder?: string;
    /**
     * Callback when the clear icon is clicked.
     */
    onClear?: () => void;
    /**
     * Defines the size of DatePicker field.
     * Only "small" and "medium" are supported for the field itself.
     */
    size?: "small" | "medium" | "large";
    /*
     * Whether the component is in loading state
     */
    loading?: boolean;
    /**
     * Format time string.
     */
    format: MaskedPattern<string> | string;
    /**
     * End icon of field.
     */
    EndIcon?: FC<IconProps>;
    /**
     * Ref data of popover that should be displayed for picker input.
     */
    popoverRefData?: any;
    /**
     * Triggered when picker value is getting changed.
     */
    onChange?: () => void;
}

const PickerInput: React.FC<IPickerInputProps> = ({
    startValue,
    endValue,
    onStartClick,
    onEndClick,
    className,
    onFocus,
    onBlur,
    clearable,
    withRange,
    required,
    labelText,
    errorMessage,
    error = false,
    disabled,
    readOnly,
    startFieldPlaceholder,
    endFieldPlaceholder,
    onClear,
    size,
    loading,
    onChange,
    popoverRefData,
    format,
    EndIcon
}) => {
    const shouldShowClearableIcon = clearable && (startValue || endValue) && !disabled && !readOnly;

    const handleClear = (e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();
        onClear?.();
    };

    const handleWrapperClick = () => {
        if (!disabled && !readOnly) {
            onStartClick?.();
        }
    };

    const renderInput = (
        value?: [TimeValue, TimeValue] | TimeValue,
        placeholder?: string,
        onClickHandler?: () => void
    ) => (
        <MaskedInput
            className="pickerInput__input"
            value={value || ""}
            format={format}
            aria-haspopup="dialog"
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            lazy
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            onClick={onClickHandler}
        />
    );

    if (loading) {
        return (
            <div className="pickerInput__skeleton" aria-busy="true">
                <Skeleton rounded="rounded3X" width={68} />
                <Skeleton rounded="rounded3X" width={withRange ? 280 : 160} />
            </div>
        );
    }

    return (
        <div
            className={classNames("pickerInput", className, {
                pickerInput_withRange: withRange,
                [`pickerInput_size_${size}`]: size
            })}
        >
            <Label disabled={disabled} className="pickerInput__label" required={required} text={labelText} />

            <span
                className={classNames("pickerInput__imitationHolder", {
                    pickerInput__imitationHolder_error: error,
                    pickerInput__imitationHolder_disabled: disabled,
                    pickerInput__imitationHolder_readOnly: readOnly
                })}
                onFocus={onFocus}
                onBlur={onBlur}
                {...popoverRefData}
            >
                {renderInput(startValue, startFieldPlaceholder, onStartClick)}
                {withRange && (
                    <>
                        <Minus className="pickerInput__icon" size={16} />
                        {renderInput(endValue, endFieldPlaceholder, onEndClick)}
                    </>
                )}

                <span
                    role="button"
                    tabIndex={0}
                    className="pickerInput__iconWrapper"
                    onClick={handleWrapperClick}
                    onKeyDown={handleWrapperClick}
                >
                    {shouldShowClearableIcon && (
                        <Button
                            tabIndex={0}
                            className="pickerInput__clearIcon"
                            onClick={handleClear}
                            Icon={X}
                            appearance="inverse"
                            aria-label="Clear"
                            size="small"
                        />
                    )}

                    {EndIcon && <EndIcon size={20} className="pickerInput__icon" />}
                </span>
            </span>

            {error && errorMessage && (
                <HelperText size="medium" text={errorMessage} status="error" className="pickerInput__errorMessage" />
            )}
        </div>
    );
};

export default PickerInput;
