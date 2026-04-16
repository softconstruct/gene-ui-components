import React, { ChangeEvent, forwardRef, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { Clock } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";
import { IPopoverRef } from "@components/atoms/Popover";
import Skeleton from "@components/atoms/Skeleton";
import PickerInput from "@components/molecules/TimePicker/components/PickerInput/PickerInput";
import PickerPopover from "@components/molecules/TimePicker/components/PickerPopover/PickerPopover";

import { useClickOutside } from "@hooks/index";

// Styles
import "./TimePicker.scss";

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
    value: {
        start: string | null;
        end: string | null;
    };
}

const SingleTimePicker = forwardRef<HTMLDivElement, ISingleTimePickerProps>(
    ({ className, loading, size = "medium", label, disabled, required, readOnly, placeholder, value }, ref) => {
        const [popoverOpen, setPopoverOpen] = useState(false);
        const [anchorProps, setAnchorProps] = useState({});

        const [internalValue, setInternalValue] = useState(value ?? null);

        const [parts, setParts] = useState<Record<string, string | undefined>>({
            hours: undefined,
            minutes: undefined,
            seconds: undefined,
            meridiem: undefined
        });

        const popoverRef = useRef<IPopoverRef>({
            floatingElement: { current: null },
            referenceElement: { current: null }
        });

        const composeTime = (p: Record<string, string | undefined>) => {
            const hh = p.hours ?? "00";
            const mm = p.minutes ?? "00";
            const ss = p.seconds ?? "00";
            return `${hh}:${mm}:${ss}`;
        };

        const handlePopoverSelect = (column: string, val: string) => {
            setParts((prev) => {
                const next = { ...prev, [column]: val };
                const composed = composeTime(next);
                setInternalValue(composed);
                return next;
            });
        };

        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setInternalValue(v);
            const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(v);
            if (match) {
                setParts({
                    hours: match[1],
                    minutes: match[2],
                    seconds: match[3] ?? "00",
                    meridiem: undefined
                });
            }
        };

        const valueToUse = value !== undefined ? value : internalValue;

        useEffect(() => {
            setInternalValue(value ?? null);
        }, [value]);

        useClickOutside(() => {
            setPopoverOpen(false);
        }, [popoverRef?.current?.floatingElement, popoverRef?.current?.referenceElement]);

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
                    onSelect={handlePopoverSelect}
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
        const [popoverOpen, setPopoverOpen] = useState(false);
        const [anchorProps, setAnchorProps] = useState({});

        const popoverRef = useRef<IPopoverRef>({
            floatingElement: { current: null },
            referenceElement: { current: null }
        });

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
                    value={value}
                    EndIcon={Clock}
                    disabled={disabled}
                    readOnly={readOnly}
                    popoverRefData={anchorProps}
                />
                <PickerPopover
                    popoverRef={popoverRef}
                    open={popoverOpen}
                    setProps={setAnchorProps}
                    onClose={() => setPopoverOpen(false)}
                    size={size}
                    position="bottom-left"
                    mobileHeightMode="fit"
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
