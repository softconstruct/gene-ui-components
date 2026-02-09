import classNames from "classnames";
import React, { KeyboardEvent, MouseEvent } from "react";

// Components
import Label from "@components/atoms/Label";
import { Calendar, X, Minus } from "@geneui/icons";
import HelperText from "@components/atoms/HelperText";
import Skeleton from "@components/atoms/Skeleton";

// Styles
import "./Field.scss";

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
    loading,
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

    const renderInput = (
        value: string | null | undefined,
        placeholder: string,
        onClickHandler?: () => void
    ) => (
        <input
            type="text"
            className="datePickerInput__input"
            placeholder={placeholder}
            value={value || ""}
            disabled={disabled}
            readOnly={true}
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
            className={classNames("datePickerInput", className, {
                "datePickerInput__withRange": withRange,
                [`datePickerInput_${size}`]: size
            })}
        >
            <Label
                disabled={disabled}
                className="datePickerInput__label"
                required={required}
                text={labelText}
            />

            <div
                className={classNames("datePickerInput__inputWrapper", {
                    "datePickerInput__inputWrapper_error": error,
                    "datePickerInput__inputWrapper_disabled": disabled,
                    "datePickerInput__inputWrapper_readOnly": readOnly
                })}
                onFocus={onFocus}
                onBlur={onBlur}
            >
                {renderInput(startDate, startDatePlaceholder, onStartClick)}

                {withRange && (
                    <>
                        <Minus className="datePickerInput__separator" />
                        {renderInput(endDate, endDatePlaceholder, onEndClick)}
                    </>
                )}

                <div className="datePickerInput__icon" onClick={handleWrapperClick}>
                    {shouldShowClearableIcon && (
                        <div
                            role="button"
                            tabIndex={0}
                            className="datePickerInput__clearIcon"
                            onClick={handleClear}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleClear(e);
                                }
                            }}
                            aria-label="Clear date"
                        >
                            <X />
                        </div>
                    )}
                    <Calendar />
                </div>
            </div>

            {error && errorMessage && (
                <HelperText
                    size={size}
                    text={errorMessage}
                    status="error"
                    className="datePickerInput__errorMessage"
                />
            )}
        </div>
    );
};

export default DatePickerInput;