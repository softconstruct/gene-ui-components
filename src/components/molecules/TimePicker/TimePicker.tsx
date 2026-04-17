import React, { forwardRef } from "react";
import classNames from "classnames";

import { Clock } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";
import Skeleton from "@components/atoms/Skeleton";
import PickerInput from "@components/molecules/TimePicker/components/PickerInput/PickerInput";
import PickerPopover from "@components/molecules/TimePicker/components/PickerPopover/PickerPopover";

// Styles
import "./TimePicker.scss";

import { useRangeTimePicker, useSingleTimePicker } from "./hooks/useTimePicker";

interface ITimePickerBaseProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    loading?: boolean;
    size?: "small" | "medium" | "large";
    label?: string;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
}

interface ISingleTimePickerProps extends ITimePickerBaseProps {
    placeholder?: string;
    value?: string | null;
}

interface IRangeTimePickerProps extends ITimePickerBaseProps {
    placeholder?: {
        start: string;
        end: string;
    };
    value?: {
        start: string | null;
        end: string | null;
    };
}

const SingleTimePicker = forwardRef<HTMLDivElement, ISingleTimePickerProps>(
    ({ className, loading, size = "medium", label, disabled, required, readOnly, placeholder, value }, ref) => {
        const {
            popoverOpen,
            setPopoverOpen,
            anchorProps,
            setAnchorProps,
            internalValue,
            parts,
            popoverRef,
            handleInputChange,
            handleSelect
        } = useSingleTimePicker(value);

        const valueToUse = value !== undefined ? value : internalValue;

        if (loading) {
            return (
                <div className="timePicker__skeleton" aria-busy="true">
                    <Skeleton rounded="rounded3X" className={`timePicker__skeleton_${size}`} width={68} />
                    <Skeleton rounded="rounded3X" className={`timePicker__skeleton_${size}`} width={160} />
                </div>
            );
        }
        return (
            <div className={classNames("timePicker", className)} ref={ref}>
                {label && <Label disabled={disabled} className="pickerInput__label" required={required} text={label} />}
                <PickerInput
                    placeholder={placeholder}
                    value={valueToUse}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={readOnly}
                    popoverRefData={anchorProps}
                    onClick={() => setPopoverOpen(true)}
                    onChange={handleInputChange}
                />
                <PickerPopover
                    open={popoverOpen}
                    setProps={setAnchorProps}
                    popoverRef={popoverRef}
                    onClose={() => setPopoverOpen(false)}
                    size={size}
                    position="bottom-left"
                    mobileHeightMode="fit"
                    onSelect={handleSelect}
                    parts={parts}
                />
            </div>
        );
    }
);

const RangeTimePicker = forwardRef<HTMLDivElement, IRangeTimePickerProps>(
    (
        {
            className,
            loading,
            size = "medium",
            label,
            disabled,
            required,
            readOnly,
            placeholder = { start: undefined, end: undefined },
            value
        },
        ref
    ) => {
        const {
            popoverRef,
            popoverOpen,
            setPopoverOpen,
            anchorProps,
            setAnchorProps,
            activeField,
            // setActiveField,
            internalStart,
            internalEnd,
            partsStart,
            partsEnd,
            handleInputClick,
            handleInputChange,
            handleSelect
        } = useRangeTimePicker(value, placeholder);

        const valueToUse = {
            start: value?.start !== undefined ? value.start : internalStart,
            end: value?.end !== undefined ? value.end : internalEnd
        };

        if (loading) {
            return (
                <div className="timePicker__skeleton" aria-busy="true">
                    <Skeleton rounded="rounded3X" className={`timePicker__skeleton_${size}`} width={68} />
                    <Skeleton rounded="rounded3X" className={`timePicker__skeleton_${size}`} width={280} />
                </div>
            );
        }
        return (
            <div className={classNames("timePicker", className)} ref={ref}>
                {label && <Label disabled={disabled} className="pickerInput__label" required={required} text={label} />}
                <PickerInput.Range
                    placeholder={placeholder}
                    value={valueToUse}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={readOnly}
                    popoverRefData={anchorProps}
                    onClick={handleInputClick}
                    onChange={handleInputChange}
                />
                <PickerPopover
                    popoverRef={popoverRef}
                    open={popoverOpen}
                    setProps={setAnchorProps}
                    onClose={() => setPopoverOpen(false)}
                    size={size}
                    position="bottom-left"
                    mobileHeightMode="fit"
                    parts={activeField === "start" ? partsStart : partsEnd}
                    onSelect={handleSelect}
                />
            </div>
        );
    }
);

/**
 * Time Picker component allows users to easily select a specific time, typically using an intuitive visual interface like a clock or list of time values.
 */
const TimePicker = Object.assign(SingleTimePicker, {
    Range: RangeTimePicker
});

export { ISingleTimePickerProps, IRangeTimePickerProps, TimePicker as default };
