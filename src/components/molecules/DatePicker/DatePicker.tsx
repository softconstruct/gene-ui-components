import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import { format, getHours, getMinutes, getSeconds, isValid, subDays, subMonths } from "date-fns";
import DatePicker, { CalendarContainer, ReactDatePickerCustomHeaderProps } from "react-datepicker";
import { CalendarContainerProps } from "react-datepicker/dist/calendar_container";

// Components
import Button from "@components/atoms/Button";
import { Popover, PopoverBody, PopoverFooter } from "@components/atoms/Popover";

import "./DatePicker.scss";

// Styles
import "react-datepicker/dist/react-datepicker.css";
import Day from "./components/Day/Day";
import Field from "./components/Field/Field";
import Header from "./components/Header/Header";
import MonthYearViewItem from "./components/MonthYearView/MonthYearView";
import Preset from "./components/Preset/Preset";
// Constants
import { presetsList, presetsListRange } from "./constants";
import { DatePickerExcludedDates, DatePickerSizes, DatePickerViewMode } from "./types";

type PresetAction = "today" | "yesterday" | "7days" | "14days" | "1month";

interface IPresetItem {
    key: string;
    label: string;
    action: PresetAction;
}

interface ICalendarWrapperProps extends CalendarContainerProps {
    withPreset?: boolean;
    presets: IPresetItem[];
    onPresetClick: (action: PresetAction) => void;
    presetSize?: DatePickerSizes;
    disabledPresets?: PresetAction[];
    presetClassName?: string;
}

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
    excludedMonths?:
        | Array<{
              month: number;
              message?: string;
          }>
        | Array<number>;
    /**
     * Years that should be excluded (will not be interactive from year picker)
     */
    excludedYears?:
        | Array<{
              year: number;
              message?: string;
          }>
        | Array<number>;
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
    weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
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

const CalendarWrapper = React.memo(
    ({
        children,
        withPreset,
        presets,
        onPresetClick,
        presetSize,
        disabledPresets,
        presetClassName
    }: ICalendarWrapperProps) => (
        <div className="datePicker__popover_content">
            {withPreset && (
                <div className="datePicker__presets">
                    {presets.map((preset) => (
                        <Preset
                            key={preset.key}
                            label={preset.label}
                            onClick={() => onPresetClick(preset.action)}
                            className={presetClassName}
                            selected
                            size={presetSize}
                            disabled={disabledPresets?.includes(preset.key)}
                        />
                    ))}
                </div>
            )}
            <div style={{ padding: 0, display: "flex" }}>
                <CalendarContainer className="datePicker__calendar">{children}</CalendarContainer>
            </div>
        </div>
    )
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
    // shouldDisableDate,
    excludedDates = [],
    presetSize = "medium",
    disabledPresets,
    weekStartDay = 1,
    size = "medium",
    excludedMonths = [],
    excludedYears = [],
    minDate,
    maxDate,
    pickerInputContainerClassName
}) => {
    const [anchorProps, setAnchorProps] = useState({});
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(open);
    const [view, setView] = useState<DatePickerViewMode>("day");

    const onRangeChange = useCallback((dates: [Date | null, Date | null] | null) => {
        if (!dates) {
            setStartDate(null);
            setEndDate(null);
            return;
        }
        const [start, end] = dates;
        setStartDate(start ?? null);
        setEndDate(end ?? null);
    }, []);

    const onSingleChange = useCallback((date: Date | null) => {
        setStartDate(date ?? null);
        setEndDate(null);
    }, []);

    const handleClear = useCallback(() => {
        setStartDate(null);
        setEndDate(null);
    }, []);

    const handlePreset = useCallback(
        (action: PresetAction) => {
            const date = new Date();
            if (startDate && isValid(startDate)) {
                date.setHours(getHours(startDate), getMinutes(startDate), getSeconds(startDate));
            }

            setEndDate(null);
            setView("day");

            switch (action) {
                case "today":
                    setStartDate(date);
                    break;
                case "yesterday":
                    setStartDate(subDays(date, 1));
                    break;
                case "7days":
                    setStartDate(subDays(date, 7));
                    break;
                case "14days":
                    setStartDate(subDays(date, 14));
                    break;
                case "1month":
                    setStartDate(subMonths(date, 1));
                    break;
                default:
                    break;
            }
        },
        [startDate]
    );

    const generateDayClassName = useCallback(() => {
        return classNames("datePicker__day", `datePicker__day_size_${size}`);
    }, [size]);

    const handleOutsideClick = useCallback(() => {
        setIsOpen(false);
        setView("day");
    }, []);

    const presetsToUse = useMemo(() => (withRange ? presetsListRange : presetsList), [withRange]);

    const renderCalendarContainer = useCallback(
        (props: CalendarContainerProps) => (
            <CalendarWrapper
                {...props}
                withPreset={withPreset}
                presets={presetsToUse}
                onPresetClick={handlePreset}
                presetSize={presetSize}
                disabledPresets={disabledPresets}
                presetClassName={presetClassName}
            />
        ),
        [withPreset, presetsToUse, handlePreset, presetSize, disabledPresets, presetClassName]
    );

    const renderMonthContent = useCallback(
        (monthIndex: number, shortMonth: string) => (
            <MonthYearViewItem
                label={shortMonth}
                value={monthIndex}
                excludedList={excludedMonths}
                excludeKey="month"
                onClick={() => setView("day")}
            />
        ),
        [excludedMonths, setView]
    );

    const renderYearContent = useCallback(
        (year: number) => (
            <MonthYearViewItem
                label={year}
                value={year}
                excludedList={excludedYears}
                excludeKey="year"
                onClick={() => setView("day")}
            />
        ),
        [excludedYears, setView]
    );

    const renderCustomHeader = useCallback(
        (headerProps: ReactDatePickerCustomHeaderProps) => (
            <Header {...headerProps} size={size} view={view} setView={setView} date={headerProps.monthDate} />
        ),
        [size, view, setView]
    );

    const renderDayContents = useCallback(
        (day: number, date: Date) => (
            <Day
                day={day}
                date={date}
                startDate={startDate}
                endDate={endDate}
                withRange={withRange}
                excludedDates={excludedDates}
            />
        ),
        [startDate, endDate, withRange, excludedDates]
    );

    const commonProps = useMemo(
        () => ({
            inline: true,
            minDate,
            maxDate,
            excludeDates: excludedDates,
            shouldCloseOnSelect: !withApplyButton,
            dateFormat,
            readOnly,
            isClearable: clearable,
            calendarStartDay: weekStartDay,
            dayClassName: generateDayClassName,
            showMonthYearPicker: view === "month",
            showYearPicker: view === "year",
            monthsShown: withRange && view === "day" ? 2 : 1,
            onClickOutside: handleOutsideClick,
            calendarContainer: renderCalendarContainer,
            renderMonthContent,
            renderYearContent,
            renderCustomHeader,
            renderDayContents
        }),
        [
            minDate,
            maxDate,
            excludedDates,
            withApplyButton,
            dateFormat,
            readOnly,
            clearable,
            weekStartDay,
            generateDayClassName,
            view,
            withRange,
            handleOutsideClick,
            renderCalendarContainer,
            renderMonthContent,
            renderYearContent,
            renderCustomHeader,
            renderDayContents
        ]
    );

    return (
        <div className={className}>
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
                    size={size === "large" ? "medium" : size}
                />
            </div>

            <Popover
                open={isOpen}
                position="bottom-left"
                withArrow
                size="fitContent"
                setProps={setAnchorProps}
                onClose={() => setIsOpen(false)}
            >
                <PopoverBody withPadding={false}>
                    {withRange ? (
                        <DatePicker
                            {...commonProps}
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={onRangeChange}
                            swapRange
                            selected={startDate}
                        />
                    ) : (
                        <DatePicker
                            {...commonProps}
                            selectsRange={false}
                            selected={startDate}
                            onChange={onSingleChange}
                        />
                    )}
                </PopoverBody>
                {withApplyButton && (
                    <PopoverFooter>
                        <div className="datePicker__footer">
                            <Button onClick={() => setIsOpen(false)}>{applyButtonLabel}</Button>
                        </div>
                    </PopoverFooter>
                )}
            </Popover>
        </div>
    );
};

export { CustomDatePicker as default, IDatePickerProps };
