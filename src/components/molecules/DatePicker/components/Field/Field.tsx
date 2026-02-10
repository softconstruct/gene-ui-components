import React, { KeyboardEvent, MouseEvent } from "react";
import classNames from "classnames";

import { Calendar, Minus, X } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";
import Skeleton from "@components/atoms/Skeleton";

// Styles
import "./Field.scss";

import { Button, HelperText } from "../../../../../index";
// Types
import { DatePickerSizes } from "../../types";

interface IDatePickerInputProps {
    /**
     * Additional CSS classes for the root element.
     */
    className?: string;
    /**
     * Selected start date as a string.
     */
    startDate: string | null;
    /**
     * Selected end date as a string.
     */
    endDate?: string | null;
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
    startDatePlaceholder?: string;
    /**
     * Placeholder for the end date input.
     */
    endDatePlaceholder?: string;
    /**
     * Callback when the clear icon is clicked.
     */
    onClear?: () => void;
    /**
     * Defines the size of DatePicker field
     * Only "small" and "medium" are supported for the field itself.
     */
    size?: Exclude<DatePickerSizes, "large">;
    /**
     * */
    loading?: boolean;
}

const DatePickerInput: React.FC<IDatePickerInputProps> = ({
    startDate,
    endDate,
    onStartClick,
    onEndClick,
    className,
    onFocus,
    onBlur,
    clearable,
    withRange,
    required,
    labelText = "Date",
    errorMessage,
    error = false,
    disabled,
    readOnly,
    startDatePlaceholder = "Start Date",
    endDatePlaceholder = "End Date",
    onClear,
    size,
    loading
}) => {
    const shouldShowClearableIcon = clearable && (startDate || endDate) && !disabled && !readOnly;

    const handleClear = (e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();
        onClear?.();
    };

    const handleWrapperClick = () => {
        if (!disabled && !readOnly) {
            onStartClick?.();
        }
    };

    const renderInput = (value: string | null | undefined, placeholder: string, onClickHandler?: () => void) => (
        <input
            type="text"
            className="datePicker__input"
            placeholder={placeholder}
            value={value || ""}
            disabled={disabled}
            readOnly
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled && !readOnly) onClickHandler?.();
            }}
            aria-haspopup="dialog"
        />
    );

    if (loading) {
        return (
            <div className="datePicker__skeleton">
                <Skeleton rounded="rounded3X" width={68} />
                <Skeleton rounded="rounded3X" width={withRange ? 280 : 160} />
            </div>
        );
    }

    return (
        <div
            className={classNames("datePicker", className, {
                datePicker_withRange: withRange,
                [`datePicker_size_${size}`]: size
            })}
        >
            <Label disabled={disabled} className="datePicker__label" required={required} text={labelText} />

            <span
                className={classNames("datePicker__imitationHolder", {
                    datePicker__imitationHolder_error: error,
                    datePicker__imitationHolder_disabled: disabled,
                    datePicker__imitationHolder_readOnly: readOnly
                })}
                onFocus={onFocus}
                onBlur={onBlur}
            >
                {renderInput(startDate, startDatePlaceholder, onStartClick)}
                {withRange && (
                    <>
                        <Minus className="datePicker__icon" size={16} />
                        {renderInput(endDate, endDatePlaceholder, onEndClick)}
                    </>
                )}

                <span className="datePicker__iconWrapper" onClick={handleWrapperClick} onKeyDown={handleWrapperClick}>
                    {shouldShowClearableIcon && (
                        <Button
                            tabIndex={0}
                            className="datePicker__clearIcon"
                            onClick={handleClear}
                            Icon={X}
                            appearance="inverse"
                            aria-label="Clear date"
                            size="small"
                        />
                    )}

                    <Calendar size={20} className="datePicker__icon" />
                </span>
            </span>

            {error && errorMessage && (
                <HelperText size="medium" text={errorMessage} status="error" className="datePicker__errorMessage" />
            )}
        </div>
    );
};

export default DatePickerInput;
