import React, { FC, KeyboardEvent, MouseEvent, RefObject, useEffect, useMemo, useRef } from "react";
import classNames from "classnames";

import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";

import { headerTextVariantMap, KEYS, PICKER_RANGE_FIELDS } from "@internal/components/Picker";

// Constants
import {
    CALENDAR_PAGE_MONTHS,
    FIRST_SUPPORTED_DATE,
    MONTH_AND_YEAR_VIEW_COLUMNS,
    MONTHS_IN_YEAR,
    YEARS_PER_PAGE
} from "../../constants";
// Helpers
import {
    addMonths,
    compareDates,
    formatDay,
    formatFullDate,
    formatMonth,
    formatMonthYear,
    formatYear,
    getCalendarCellKey,
    getCalendarKeyTarget,
    getMonthWeeks,
    getNearestAvailableDate,
    getWeekdayNames,
    getYearPageStart,
    getYearPageYears,
    isCalendarCellOutOfBounds,
    isCalendarPageOutOfBounds,
    isDateOutOfBounds,
    isDocumentRTL,
    isMonthOutOfBounds,
    isSameDate,
    isSupportedDate,
    isYearOutOfBounds,
    normalizeDate
} from "../../helpers";
// Types
import {
    CalendarDate,
    CalendarRange,
    CalendarSelection,
    CalendarView,
    DateBounds,
    DatePickerRangeFields,
    DatePickerSizes,
    IDatePickerLocalization
} from "../../types";
import CalendarGrid, { CalendarGridCell } from "../CalendarGrid/CalendarGrid";

interface ICalendarPanelProps {
    /**
     * The size of the cells and the header.
     */
    size: DatePickerSizes;
    /**
     * Locale of the month and weekday names, as a BCP 47 language tag.
     */
    locale: string;
    /**
     * The accessible texts of the calendar, with their defaults filled in.
     */
    texts: Required<IDatePickerLocalization>;
    /**
     * Leaves out the header arrows: phones page from the header month and year.
     */
    isMobile: boolean;
    /**
     * The current day, marked in the grid.
     */
    today: CalendarDate;
    /**
     * Whether the panel shows days, months or years.
     */
    view: CalendarView;
    /**
     * The day the panel shows the page of, and its tab stop.
     */
    date: CalendarDate;
    /**
     * The selected day, or the selected start and end of a range.
     */
    selection: CalendarSelection;
    /**
     * The edited field of a range picker; left out by a single picker.
     */
    activeField?: DatePickerRangeFields;
    /**
     * The days highlighted as a range, with the range the pointer previews.
     */
    range: CalendarRange | null;
    /**
     * The days that can be picked; the others are disabled.
     */
    bounds: DateBounds;
    /**
     * The pages the header arrows can lead to.
     */
    pageBounds: DateBounds;
    /**
     * Moves the focus to the tab stop of the grid once it is rendered.
     */
    shouldFocusGrid: boolean;
    /**
     * Confirms that the grid took the focus `shouldFocusGrid` asked for.
     */
    onFocusMoved: () => void;
    /**
     * Changes the view or the day of the panel; `focusGrid` moves the focus into the grid with it.
     */
    onNavigate: (changes: { view?: CalendarView; date?: CalendarDate }, focusGrid: boolean) => void;
    /**
     * Moves the keyboard focus to a day: in this panel, or in another one that shows it.
     */
    onKeyMove: (date: CalendarDate) => void;
    /**
     * Picks a day.
     */
    onSelect: (date: CalendarDate, event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Reports the day under the pointer, `null` when the pointer leaves the grid; left out where
     * nothing previews it.
     */
    onHover?: (date: CalendarDate | null) => void;
    /**
     * Leaves the calendar on `Shift+Tab` from the first tab stop of the panel; left out where the
     * calendar has tab stops before it.
     */
    onTabOutBackward?: () => void;
    /**
     * Leaves the calendar on `Tab` from the grid; left out where the calendar has tab stops after it.
     */
    onTabOutForward?: () => void;
}

const toRows = (cells: CalendarGridCell[], columns: number): CalendarGridCell[][] =>
    Array.from({ length: Math.ceil(cells.length / columns) }, (_, row) =>
        cells.slice(row * columns, (row + 1) * columns)
    );

const emptyCell = (key: string): CalendarGridCell => ({ key, text: "", label: "", empty: true });

/**
 * One page of the calendar with its header: a month of days, or the months of a year or the years
 * of a decade behind the header month and year. A range calendar leaves the days of the months
 * around the page, and the years around the decade, empty.
 */
const CalendarPanel: FC<ICalendarPanelProps> = ({
    size,
    locale,
    texts,
    isMobile,
    today,
    view,
    date,
    selection,
    activeField,
    range,
    bounds,
    pageBounds,
    shouldFocusGrid,
    onFocusMoved,
    onNavigate,
    onKeyMove,
    onSelect,
    onHover,
    onTabOutBackward,
    onTabOutForward
}) => {
    const { start, end } = selection;
    const activeDate = activeField === PICKER_RANGE_FIELDS.END ? end : start;
    const isRange = !!activeField;
    const isRTL = isDocumentRTL();

    const panelRef = useRef<HTMLDivElement | null>(null);
    const hasFocusRef = useRef(false);
    const previousJumpRef = useRef<HTMLButtonElement | null>(null);
    const previousStepRef = useRef<HTMLButtonElement | null>(null);
    const monthItemRef = useRef<HTMLButtonElement | null>(null);
    const yearItemRef = useRef<HTMLButtonElement | null>(null);
    const nextStepRef = useRef<HTMLButtonElement | null>(null);
    const nextJumpRef = useRef<HTMLButtonElement | null>(null);

    const pageStep = CALENDAR_PAGE_MONTHS[view];
    const jumpStep = view === "days" ? MONTHS_IN_YEAR : pageStep;
    const isPreviousDisabled = isCalendarPageOutOfBounds(view, addMonths(date, -pageStep), pageBounds);
    const isNextDisabled = isCalendarPageOutOfBounds(view, addMonths(date, pageStep), pageBounds);
    const yearPageStart = getYearPageStart(date.year);
    const focusKey = getCalendarCellKey(view, date);

    const weekdays = useMemo(
        () => getWeekdayNames(locale).map((name) => ({ text: name.narrow, label: name.long })),
        [locale]
    );

    // An element replaced under the focus, as the page or the view changes, drops the focus without a
    // blur, so the grid takes it over.
    useEffect(() => {
        if (!hasFocusRef.current || panelRef.current?.contains(document.activeElement)) return;

        hasFocusRef.current = false;
        onNavigate({}, true);
    });

    const keyToDate = (key: string): CalendarDate => {
        const [year, month = date.month, day = date.day] = key.split("-").map(Number);

        return normalizeDate({ year, month, day });
    };

    const handlePageChange = (months: number) => (event: MouseEvent<HTMLButtonElement>) => {
        const next = getNearestAvailableDate(addMonths(date, months), pageBounds);

        // A button disabled under the focus would drop it, so the focus moves on to the grid.
        onNavigate(
            { date: next },
            event.currentTarget === document.activeElement &&
                isCalendarPageOutOfBounds(view, addMonths(next, Math.sign(months) * pageStep), pageBounds)
        );
    };

    // The header item gives way to the next view, so the focus moves on to its grid.
    const handleViewOpen = (nextView: CalendarView) => (event: MouseEvent<HTMLButtonElement>) =>
        onNavigate({ view: nextView }, event.currentTarget === document.activeElement);

    const handleCellClick = (key: string, event: MouseEvent<HTMLButtonElement>) => {
        const target = keyToDate(key);
        // A cell picked from the keyboard is replaced when the page or the view changes, so the focus follows it.
        const focusGrid = event.currentTarget === document.activeElement;

        if (view === "days") {
            onNavigate({ date: target }, focusGrid);
            onSelect(target, event);
            return;
        }

        onNavigate({ date: target, view: view === "years" ? "months" : "days" }, focusGrid);
    };

    const handleCellFocus = (key: string) => {
        if (key !== focusKey) onNavigate({ date: keyToDate(key) }, false);
    };

    const getHeaderStops = () =>
        [
            isPreviousDisabled ? null : previousJumpRef.current,
            isPreviousDisabled ? null : previousStepRef.current,
            monthItemRef.current,
            yearItemRef.current,
            isNextDisabled ? null : nextStepRef.current,
            isNextDisabled ? null : nextJumpRef.current
        ].filter((element) => !!element);

    const tabOutBackward = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!onTabOutBackward) return;

        event.preventDefault();
        onTabOutBackward();
    };

    const handleHeaderKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== KEYS.TAB) return;

        const stops = getHeaderStops();

        if (event.shiftKey) {
            if (event.target === stops[0]) tabOutBackward(event);
        } else if (event.target === stops[stops.length - 1] && isCalendarCellOutOfBounds(view, date, bounds)) {
            // A page with nothing to pick has no tab stop in its grid to leave the calendar from.
            onTabOutForward?.();
        }
    };

    const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === KEYS.TAB) {
            if (!event.shiftKey) onTabOutForward?.();
            else if (!getHeaderStops().length) tabOutBackward(event);
            return;
        }

        const target = getCalendarKeyTarget(view, date, event.key, { shiftKey: event.shiftKey, isRTL });

        if (!target) return;

        event.preventDefault();
        onKeyMove(getNearestAvailableDate(target, bounds));
    };

    const decade = `${formatYear(Math.max(yearPageStart, FIRST_SUPPORTED_DATE.year), locale)}-${formatYear(
        yearPageStart + YEARS_PER_PAGE - 1,
        locale
    )}`;

    const gridLabels: Record<CalendarView, string> = {
        days: formatMonthYear(date.year, date.month, locale),
        months: formatYear(date.year, locale),
        years: decade
    };

    const getDayRows = (): CalendarGridCell[][] =>
        getMonthWeeks(date.year, date.month).map((week) =>
            week.map((day) => {
                const key = getCalendarCellKey("days", day);
                const isOutside = day.year !== date.year || day.month !== date.month;

                if (!isSupportedDate(day) || (isRange && isOutside)) return emptyCell(key);

                const isToday = isSameDate(day, today);
                const isRangeStart = isSameDate(day, range?.start);
                const isRangeEnd = isSameDate(day, range?.end);
                const isInRange = !!range && compareDates(day, range.start) > 0 && compareDates(day, range.end) < 0;

                return {
                    key,
                    text: formatDay(day, locale),
                    label: formatFullDate(day, locale),
                    selected: isSameDate(day, start) || isSameDate(day, end),
                    disabled: isDateOutOfBounds(day, bounds),
                    current: isToday,
                    className: classNames({
                        datePicker__cell_outside: isOutside,
                        datePicker__cell_today: isToday,
                        datePicker__cell_inRange: isInRange,
                        datePicker__cell_band: isRangeStart || isInRange || isRangeEnd,
                        datePicker__cell_bandStart: isRangeStart,
                        datePicker__cell_bandEnd: isRangeEnd
                    })
                };
            })
        );

    const getMonthRows = (): CalendarGridCell[][] =>
        toRows(
            Array.from({ length: MONTHS_IN_YEAR }, (_, index) => {
                const month = index + 1;
                const isCurrent = today.year === date.year && today.month === month;

                return {
                    key: getCalendarCellKey("months", { year: date.year, month, day: 1 }),
                    text: formatMonth(month, locale, "short"),
                    label: formatMonthYear(date.year, month, locale),
                    selected: activeDate?.year === date.year && activeDate.month === month,
                    disabled: isMonthOutOfBounds(date.year, month, bounds),
                    current: isCurrent,
                    className: classNames({ datePicker__cell_today: isCurrent })
                };
            }),
            MONTH_AND_YEAR_VIEW_COLUMNS
        );

    const getYearRows = (): CalendarGridCell[][] => {
        const years = getYearPageYears(date.year);

        return toRows(
            years.map((year, index) => {
                const key = getCalendarCellKey("years", { year, month: 1, day: 1 });
                const isOutside = index === 0 || index === years.length - 1;

                if (!isSupportedDate({ year, month: 1, day: 1 }) || (isRange && isOutside)) return emptyCell(key);

                const text = formatYear(year, locale);
                const isCurrent = today.year === year;

                return {
                    key,
                    text,
                    label: text,
                    selected: activeDate?.year === year,
                    disabled: isYearOutOfBounds(year, bounds),
                    current: isCurrent,
                    className: classNames({
                        datePicker__cell_outside: isOutside,
                        datePicker__cell_today: isCurrent
                    })
                };
            }),
            MONTH_AND_YEAR_VIEW_COLUMNS
        );
    };

    const rowsByView: Record<CalendarView, () => CalendarGridCell[][]> = {
        days: getDayRows,
        months: getMonthRows,
        years: getYearRows
    };

    const jumpLabels =
        view === "years"
            ? { previous: texts.previousDecade, next: texts.nextDecade }
            : { previous: texts.previousYear, next: texts.nextYear };

    const renderArrow = (
        ref: RefObject<HTMLButtonElement>,
        Icon: typeof ChevronLeft,
        label: string,
        disabled: boolean,
        months: number
    ) => (
        <Button
            ref={ref}
            Icon={Icon}
            appearance="secondary"
            layout="text"
            size={size}
            aria-label={label}
            disabled={disabled}
            onClick={handlePageChange(months)}
        />
    );

    const renderHeaderText = (text: string) => (
        <Text as="span" variant={headerTextVariantMap[size]}>
            {text}
        </Text>
    );

    return (
        <div
            ref={panelRef}
            className="datePicker__picker"
            onFocus={() => {
                hasFocusRef.current = true;
            }}
            onBlur={() => {
                hasFocusRef.current = false;
            }}
        >
            <div role="presentation" className="datePicker__header" onKeyDown={handleHeaderKeyDown}>
                {!isMobile &&
                    renderArrow(
                        previousJumpRef,
                        isRTL ? ChevronDoubleRight : ChevronDoubleLeft,
                        jumpLabels.previous,
                        isPreviousDisabled,
                        -jumpStep
                    )}
                {!isMobile &&
                    view === "days" &&
                    renderArrow(
                        previousStepRef,
                        isRTL ? ChevronRight : ChevronLeft,
                        texts.previousMonth,
                        isPreviousDisabled,
                        -pageStep
                    )}
                <div className="datePicker__title" aria-live="polite">
                    {view === "days" && (
                        <button
                            ref={monthItemRef}
                            type="button"
                            className="datePicker__headerItem"
                            aria-label={`${formatMonth(date.month, locale, "long")}, ${texts.chooseMonth}`}
                            onClick={handleViewOpen("months")}
                        >
                            {renderHeaderText(formatMonth(date.month, locale, "short"))}
                        </button>
                    )}
                    {view === "years" ? (
                        <span className="datePicker__headerItem datePicker__headerItem_readOnly">
                            {renderHeaderText(decade)}
                        </span>
                    ) : (
                        <button
                            ref={yearItemRef}
                            type="button"
                            className="datePicker__headerItem"
                            aria-label={`${formatYear(date.year, locale)}, ${texts.chooseYear}`}
                            onClick={handleViewOpen("years")}
                        >
                            {renderHeaderText(formatYear(date.year, locale))}
                        </button>
                    )}
                </div>
                {!isMobile &&
                    view === "days" &&
                    renderArrow(
                        nextStepRef,
                        isRTL ? ChevronLeft : ChevronRight,
                        texts.nextMonth,
                        isNextDisabled,
                        pageStep
                    )}
                {!isMobile &&
                    renderArrow(
                        nextJumpRef,
                        isRTL ? ChevronDoubleLeft : ChevronDoubleRight,
                        jumpLabels.next,
                        isNextDisabled,
                        jumpStep
                    )}
            </div>
            <CalendarGrid
                label={gridLabels[view]}
                size={size}
                view={view}
                columnHeaders={view === "days" ? weekdays : undefined}
                rows={rowsByView[view]()}
                focusKey={focusKey}
                shouldFocus={shouldFocusGrid}
                onFocusMoved={onFocusMoved}
                onKeyDown={handleGridKeyDown}
                onCellClick={handleCellClick}
                onCellFocus={handleCellFocus}
                onCellHover={view === "days" ? (key) => onHover?.(key ? keyToDate(key) : null) : undefined}
            />
        </div>
    );
};

export default CalendarPanel;
