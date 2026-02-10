import React, { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import classNames from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import {
    subDays,
    subMonths,
    getHours,
    getMinutes,
    getSeconds,
    format,
    isValid
} from "date-fns";

// Components
import { Popover, PopoverBody, PopoverFooter } from "@components/atoms/Popover";
import Field from "./components/Field/Field";
import Preset from "./components/Preset/Preset";
import Header from "./components/Header/Header";
import Button from "@components/atoms/Button";
import Tooltip from "@components/molecules/Tooltip";
import Day from "./components/Day/Day";

// Constants
import { presetsList, presetsListRange } from "./constants";

import "./DatePicker.scss";
import { DatePickerExcludedDates, DatePickerSizes, DatePickerViewMode } from "./types";

type PresetAction = "today" | "yesterday" | "7days" | "14days" | "1month";

interface IDatePickerProps {
    /**
     * If true displays range picker
     */
    withRange?: boolean;
    /**
     * If true on datepicker field will be shown icon for clearing the selected dates
     */
    clearable?: boolean;
    /**
     * The date format of datepicker
     */
    format?: string;
    /**
     * If true shows the presets - 'Yesterday' | 'Last month'
     */
    withPreset?: boolean;
    /**
     * If true the date changes will be applied only after clicking on "Apply" button
     */
    withApplyButton?: boolean;
    /**
     * The label of apply button
     */
    applyButtonLabel?: string;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Custom classname for preset items
     */
    presetClassName?: string;
    /**
     * */
    required?: boolean;
    /**
     * If true the selected date isn't available for changing
     */
    readOnly?: boolean;
    /**
     * If true will make datepicker field disabled
     */
    disabled?: boolean;
    /**
     * If true will show errored state of component
     */
    error?: boolean;
    /**
     * Error message which can be displayed under picker field
     */
    errorMessage?: string;
    /**
     * */
    open?: boolean;
    /**
     * Shows skeleton if datepicker data is loading
     */
    loading?: boolean;
    /**
     * Date(s) that should be excluded, if message also passed it will be displayed when date is hovered
     */
    excludedDates?: DatePickerExcludedDates;
    /**
     * Months that should be excluded (will not be interactive from month picker)
     */
    excludedMonths?: Array<{
        month: number;
        message?: string;
    }>
    | Array<number>
    /**
     * Years that should be excluded (will not be interactive from year picker)
     */
    excludedYears?: Array<{
        year: number;
        message?: string;
    }>
    | Array<number>
    /**
     * Sets up the minimum available date
     */
    minDate?: Date;
    /**
     * Sets up the maximum available date
     */
    maxDate?: Date;
    /**
     * The size of the preset item
     * Possible values: `small | medium | large`
     */
    presetSize?: DatePickerSizes;
    /**
     * The size of the picker
     */
    size?: DatePickerSizes;
    /**
     * Array of disabled presets
     */
    disabledPresets?: PresetAction[];
    /**
     * The day of the week start, default 1 which is equivalent to Monday
     */
    weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /**
     * */
    pickerInputContainerClassName?: string;
    /**
     * * @param date 
     * @returns 
     */
    shouldDisableDate?: (date: Date) => boolean;
    /**
     * Callback getting triggered when user selects next month from calendar header
     * @returns 
     */
    onNextMonthClick?: () => void;
    /**
     * Callback getting triggered when user selects previous month from calendar header
     * @returns 
     */
    onPrevMonthClick?: () => void;
    /**
     * Callback getting triggered when user changes the year from calendar header
     * @param year 
     * @returns 
     */
    onYearChange?: (year: number) => void;
    /**
     * Callback which is getting triggered when user cleans the selected dates
     * @returns void
     */
    onClean?: () => void;
}


interface IPickerGridItemProps {
    label: string | number;
    value: number;
    excludedList: any[];
    excludeKey?: "month" | "year";
    onClick: () => void;
}

const PickerGridItem: React.FC<IPickerGridItemProps> = ({ label, value, excludedList, excludeKey, onClick }) => {
    const disabledEntry = excludedList?.find(item => {
        if (typeof item === "number") return item === value;
        return item?.[excludeKey || ""] === value;
    });

    const isDisabled = !!disabledEntry;
    const tooltipMsg = typeof disabledEntry === "object" && disabledEntry.message ? disabledEntry.message : undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
        }
    };

    const content = (
        <div
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            className={classNames("x-datepicker__grid-item", {
                "x-datepicker__grid-item--disabled": isDisabled
            })}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDisabled) onClick();
            }}
            onKeyDown={handleKeyDown}
            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
        >
            {label}
        </div>
    );

    if (isDisabled && tooltipMsg) {
        return (
            <Tooltip text={tooltipMsg} position="bottom-center">
                {content}
            </Tooltip>
        );
    }
    return content;
};

const CalendarWrapper = ({ children, withPreset, presets, onPresetClick, presetSize, disabledPresets, presetClassName }: any) => (
    <div className="datePicker__popover_content">
        {withPreset && (
            <div className="datePicker__presets">
                {presets.map((preset: any) => (
                    <Preset
                        key={preset.key}
                        label={preset.label}
                        onClick={() => onPresetClick(preset.action)}
                        className={presetClassName}
                        selected={true}
                        size={presetSize}
                        disabled={disabledPresets?.includes(preset.key)}
                    />
                ))}
            </div>
        )}
        <div style={{ padding: 0, display: "flex" }}>
            <CalendarContainer className="datePicker__calendar">
                {children}
            </CalendarContainer>
        </div>
    </div>
);

const CustomDatePicker: React.FC<IDatePickerProps> = ({
    withRange = false,
    clearable = false,
    format: dateFormat = "MM/dd/yyyy",
    withPreset = false,
    withApplyButton = true,
    applyButtonLabel = "Apply",
    className,
    presetClassName,
    required = false,
    readOnly = false,
    disabled = false,
    error = false,
    errorMessage,
    open = false,
    loading = false,
    shouldDisableDate,
    excludedDates = [],
    presetSize = "medium",
    disabledPresets,
    weekStartDay = 1,
    size = "medium",
    excludedMonths = [],
    excludedYears = [],
    minDate,
    maxDate,
    pickerInputContainerClassName,
}) => {
    const inputClickWrapperRef = useRef<HTMLDivElement>(null);
    const popoverClickWrapperRef = useRef<HTMLDivElement>(null);

    const [anchorProps, setAnchorProps] = useState<any>({});
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(open);
    const [view, setView] = useState<DatePickerViewMode>("day");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;
            const target = event.target as Node;
            const isInsideInput = inputClickWrapperRef.current?.contains(target);
            const isInsidePopover = popoverClickWrapperRef.current?.contains(target);

            if (!isInsideInput && !isInsidePopover) {
                setIsOpen(false);
                setView('day');
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleChange = (dates: Date | null | [Date | null, Date | null]) => {
        if (withRange && Array.isArray(dates)) {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
        } else if (!Array.isArray(dates)) {
            setStartDate(dates);
            setEndDate(null);
        }
    };

    const handleClear = useCallback(() => {
        setStartDate(null);
        setEndDate(null);
    }, []);

    const handlePreset = useCallback((action: PresetAction) => {
        const date = new Date();
        if (startDate && isValid(startDate)) {
            date.setHours(getHours(startDate), getMinutes(startDate), getSeconds(startDate));
        }

        setEndDate(null);
        setView("day");

        switch (action) {
            case 'today': setStartDate(date); break;
            case 'yesterday': setStartDate(subDays(date, 1)); break;
            case '7days': setStartDate(subDays(date, 7)); break;
            case '14days': setStartDate(subDays(date, 14)); break;
            case '1month': setStartDate(subMonths(date, 1)); break;
        }
    }, [startDate]);

    const presetsToUse = withRange ? presetsListRange : presetsList;

    return (
        <div className={className}>
            <div ref={inputClickWrapperRef}>
                <div {...anchorProps}>
                    <Field
                        onStartClick={() => setIsOpen(true)}
                        onEndClick={() => setIsOpen(true)}
                        startDate={startDate ? format(startDate, dateFormat) : null}
                        endDate={endDate ? format(endDate, dateFormat) : null}
                        clearable={clearable}
                        required={required}
                        error={error}
                        disabled={disabled}
                        readOnly={readOnly}
                        errorMessage={errorMessage}
                        withRange={withRange}
                        onClear={handleClear}
                        loading={loading}
                        className={pickerInputContainerClassName}
                        size={size}
                    />
                </div>
            </div>

            <Popover
                open={isOpen}
                position="bottom-left"
                withArrow
                size="fitContent"
                setProps={setAnchorProps}
                onClose={() => setIsOpen(false)}
            >
                <div ref={popoverClickWrapperRef}>
                    <PopoverBody withPadding={false}>
                        <DatePicker
                            inline
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleChange}
                            minDate={minDate}
                            maxDate={maxDate}
                            excludeDates={excludedDates}
                            selectsRange={withRange}
                            shouldCloseOnSelect={!withApplyButton}
                            dateFormat={dateFormat}
                            readOnly={readOnly}
                            isClearable={clearable}
                            calendarStartDay={weekStartDay}

                            swapRange
                            showMonthYearPicker={view === "month"}
                            showYearPicker={view === "year"}
                            monthsShown={withRange && view === "day" ? 2 : 1}

                            // dayClassName={getCustomDayClass}

                            calendarContainer={(props) => (
                                <CalendarWrapper
                                    {...props}
                                    withPreset={withPreset}
                                    presets={presetsToUse}
                                    onPresetClick={handlePreset}
                                    presetSize={presetSize}
                                    disabledPresets={disabledPresets}
                                    presetClassName={presetClassName}
                                />
                            )}

                            renderMonthContent={(monthIndex, shortMonth) => (
                                <PickerGridItem
                                    label={shortMonth}
                                    value={monthIndex}
                                    excludedList={excludedMonths}
                                    excludeKey="month"
                                    onClick={() => setView("day")}
                                />
                            )}

                            renderYearContent={(year) => (
                                <PickerGridItem
                                    label={year}
                                    value={year}
                                    excludedList={excludedYears}
                                    excludeKey="year"
                                    onClick={() => setView("day")}
                                />
                            )}

                            renderCustomHeader={(headerProps) => (
                                <Header
                                    {...headerProps}
                                    size={size}
                                    view={view}
                                    setView={setView}
                                    date={headerProps.monthDate}
                                />
                            )}

                            renderDayContents={(day, date) => (
                                <Day
                                    day={day}
                                    date={date}
                                    startDate={startDate}
                                    endDate={endDate}
                                    withRange={withRange}
                                    excludedDates={[{ date: new Date(), message: "Sqich" }]}
                                />
                            )}
                        />
                    </PopoverBody>
                    {withApplyButton && (
                        <PopoverFooter>
                            <div className="datePicker__footer">
                                <Button onClick={() => setIsOpen(false)}>
                                    {applyButtonLabel}
                                </Button>
                            </div>
                        </PopoverFooter>
                    )}
                </div>
            </Popover>
        </div>
    );
};

export { CustomDatePicker as default, IDatePickerProps };
