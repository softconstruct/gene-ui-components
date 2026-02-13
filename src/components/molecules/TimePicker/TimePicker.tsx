import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { isValid, parse } from "date-fns";

// Components
import { Clock } from "@geneui/icons";

import { Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";

// Styles
import "./TimePicker.scss";

import PickerButton from "./components/PickerButton/PickerButton";
import PickerInput from "./components/PickerInput/PickerInput";

// Types
type TimeValue = string | Date | null;
type Meridiem = "AM" | "PM";

interface ITimePickerProps<M extends "single" | "range" = "single"> {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Additional class for the parent element of picker input field.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    pickerFieldClassName?: string;
    /**
     * Whether picker is in open state.
     */
    open?: boolean;
    /**
     * Whether disabled the component.
     */
    disabled?: boolean;
    /**
     * Whether the component is read-only.
     */
    readOnly?: boolean;
    /**
     * Whether to display a loading skeleton.
     */
    loading?: boolean;
    /**
     * Whether the picker is in errored state .
     */
    error?: boolean;
    /**
     * To display error message label.
     */
    errorMessage?: string;
    /**
     * Format time string.
     */
    format?: string;
    /**
     * A label displayed at the top of picker field.
     */
    label?: string;
    /**
     * Meridiem format for 12-hour time.
     */
    showMeridiem?: boolean;
    /**
     * Defined the selection mode.<br/>
     * 'range' renders combined input (start -> end), single renders one.<br/>
     * Possible values: `single | range`.
     */
    mode?: M;
    /**
     * Current value of time picker.
     */
    value?: M extends "range" ? [TimeValue, TimeValue] : TimeValue;
    /**
     * Default value of time picker.
     */
    defaultValue?: M extends "range" ? [TimeValue, TimeValue] : TimeValue;
    /**
     * If true, adds a required asterisk (*) to the label.
     */
    required?: boolean;
    /**
     * Placeholder text. Pass an array of 2 things if mode is 'range'. <br/>
     * `e.g. "Select time" or ["Start time", "End time"]`.
     */
    placeholder?: M extends "range" ? [string, string] : string;
    /**
     * Visual size of the input. <br/>
     * Possible values: `small | medium | large`.
     */
    size?: "small" | "medium" | "large";
    /**
     * Header text for hours column.
     */
    hourHeaderText?: string;
    /**
     * Header text for minutes column.
     */
    minuteHeaderText?: string;
    /**
     * Header text for seconds column.
     */
    secondHeaderText?: string;
    /**
     * Called when selected value is cleaned.
     */
    onClean?: () => void;
    /**
     * Called when time is selected.
     */
    // onSelect?: (date: Date, even: SyntheticEvent) => void;
    /**
     * Called when picker is opened.
     */
    onOpen?: () => void;
    /**
     * Called when picker is getting closed.
     */
    onClose?: () => void;
    /**
     * Called when picker is getting focused.
     */
    onFocus?: () => void;
}

const generateRange = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString().padStart(2, "0"));

/**
 * Time Picker component allows users to easily select a specific time,
 * typically using an intuitive visual interface like a clock or list of time values.
 */
const TimePicker = <M extends "single" | "range" = "single">({
    className,
    pickerFieldClassName,
    open = false,
    disabled = false,
    readOnly = false,
    loading = false,
    error = false,
    errorMessage,
    format = "HH:mm:ss",
    label = "Time",
    showMeridiem = false,
    mode: propMode,
    required = false,
    size = "medium",
    value,
    defaultValue,
    placeholder,
    hourHeaderText = "Hour",
    minuteHeaderText = "Minute",
    secondHeaderText = "Second",
    onClean,
    // onSelect,
    onOpen,
    onClose,
    onFocus
}: ITimePickerProps<M>) => {
    const mode = propMode ?? "single";
    const [pickerValue, setPickerValue] = useState(defaultValue);
    const [isPickerOpen, setIsPickerOpen] = useState(open);
    const [activeMeridiem, setActiveMeridiem] = useState("AM");
    const [openPickerAs, setOpenPickerAs] = useState("start");

    const parsedDefaultDate = useMemo(() => {
        if (!pickerValue || Array.isArray(pickerValue)) return new Date();
        const parsed = parse(String(pickerValue), format, new Date());
        return isValid(parsed) ? parsed : new Date();
    }, [pickerValue, format]);

    const [activeHour, setActiveHour] = useState<string | null>(String(parsedDefaultDate.getHours()) || null);
    const [activeMinute, setActiveMinute] = useState<string | null>(String(parsedDefaultDate.getMinutes()) || null);
    const [activeSecond, setActiveSecond] = useState<string | null>(String(parsedDefaultDate.getSeconds()) || null);

    const [anchorProps, setAnchorProps] = useState({});

    const placeholders = useMemo(() => {
        if (!placeholder) return mode === "single" ? ["Select Time"] : ["Start Time", "End Time"];
        return Array.isArray(placeholder) ? placeholder : [placeholder];
    }, [placeholder, mode]);

    const hours = useMemo(() => generateRange(0, showMeridiem ? 12 : 24), [showMeridiem]);
    const minutes = useMemo(() => generateRange(0, 59), []);
    const seconds = useMemo(() => generateRange(0, 59), []);

    const handleClose = () => {
        onClose?.();
        setIsPickerOpen(false);
    };

    const handleOpen = (field: "start" | "end") => {
        onOpen?.();
        setOpenPickerAs(field);
        setIsPickerOpen(true);
    };

    const handleClean = () => {
        onClean?.();
        setPickerValue(null);
    };

    const handleMeridiemChange = (meridiem: Meridiem) => {
        setActiveMeridiem(meridiem);
    };

    useEffect(() => setIsPickerOpen(open), [open]);

    useEffect(() => setPickerValue(value), [value]);

    const timeColumns = [
        { header: hourHeaderText, data: hours, active: activeHour, setActive: setActiveHour },
        { header: minuteHeaderText, data: minutes, active: activeMinute, setActive: setActiveMinute },
        { header: secondHeaderText, data: seconds, active: activeSecond, setActive: setActiveSecond }
    ];

    return (
        <div className={classNames("timePicker", className)}>
            <PickerInput
                className={pickerFieldClassName}
                onStartClick={() => handleOpen("start")}
                startValue={pickerValue}
                popoverRefData={anchorProps}
                clearable={Boolean(onClean)}
                onClear={handleClean}
                required={required}
                disabled={disabled}
                error={error}
                errorMessage={errorMessage}
                readOnly={readOnly}
                loading={loading}
                size={size}
                format={format}
                withRange={mode === "range"}
                startFieldPlaceholder={placeholders[0]}
                endFieldPlaceholder={placeholders[1]}
                EndIcon={Clock}
                labelText={label}
                onEndClick={() => handleOpen("end")}
                onFocus={onFocus}
                onBlur={handleClose}
            />
            <Popover
                size={size}
                open={isPickerOpen}
                position={openPickerAs === "start" ? "bottom-left" : "bottom-right"}
                withArrow={false}
                setProps={setAnchorProps}
                onClose={handleClose}
            >
                <PopoverBody withPadding={false}>
                    <div className="timePicker__body">
                        {timeColumns.map((col) => (
                            <div key={col.header} className="timePicker__column">
                                <div className="timePicker__header">{col.header}</div>
                                <Scrollbar className="timePicker__list">
                                    {col.data.map((item) => (
                                        <PickerButton
                                            key={item}
                                            active={col.active === item}
                                            onClick={() => col.setActive(item)}
                                            className="timePicker__item"
                                            size={size}
                                        >
                                            {item}
                                        </PickerButton>
                                    ))}
                                </Scrollbar>
                            </div>
                        ))}

                        {showMeridiem && (
                            <div className="timePicker__meridiem">
                                <PickerButton
                                    active={activeMeridiem === "AM"}
                                    className={classNames("timePicker__meridiem__button")}
                                    onClick={() => handleMeridiemChange("AM")}
                                    size={size}
                                >
                                    AM
                                </PickerButton>
                                <PickerButton
                                    active={activeMeridiem === "PM"}
                                    className={classNames("timePicker__meridiem__button")}
                                    onClick={() => handleMeridiemChange("PM")}
                                    size={size}
                                >
                                    PM
                                </PickerButton>
                            </div>
                        )}
                    </div>
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { ITimePickerProps, TimePicker as default };
