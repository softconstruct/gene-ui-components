import React, { FC, KeyboardEvent, MouseEvent, RefObject, useMemo, useRef } from "react";
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
    getRangeBand,
    getWeekdayNames,
    getYearPageStart,
    getYearPageYears,
    isCalendarPageOutOfBounds,
    isDateOutOfBounds,
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
    size: DatePickerSizes;
    /**
     * Locale of the month and weekday names, as a BCP 47 language tag.
     */
    locale: string;
    texts: Required<IDatePickerLocalization>;
    /**
     * Leaves out the header arrows: phones page from the header month and year.
     */
    isMobile: boolean;
    isRTL: boolean;
    today: CalendarDate;
    view: CalendarView;
    /**
     * The day the panel shows the page of, and its tab stop.
     */
    date: CalendarDate;
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
     * The days the edited field can take; the others are disabled.
     */
    bounds: DateBounds;
    /**
     * The pages the header arrows can lead to.
     */
    pageBounds: DateBounds;
    shouldFocusGrid: boolean;
    onFocusMoved: () => void;
    /**
     * Changes the view or the day of the panel; `focusGrid` moves the focus into the grid with it.
     */
    onNavigate: (changes: { view?: CalendarView; date?: CalendarDate }, focusGrid: boolean) => void;
    /**
     * Moves the keyboard focus to a day: in this panel, or in another one that shows it.
     */
    onKeyMove: (date: CalendarDate) => void;
    onSelect: (date: CalendarDate, event: MouseEvent<HTMLButtonElement>) => void;
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
    isRTL,
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

    const gridRef = useRef<HTMLDivElement | null>(null);
    const previousJumpRef = useRef<HTMLButtonElement | null>(null);
    const previousStepRef = useRef<HTMLButtonElement | null>(null);
    const monthItemRef = useRef<HTMLButtonElement | null>(null);
    const yearItemRef = useRef<HTMLButtonElement | null>(null);
    const nextStepRef = useRef<HTMLButtonElement | null>(null);
    const nextJumpRef = useRef<HTMLButtonElement | null>(null);

    const pageStep = CALENDAR_PAGE_MONTHS[view];
    // The double arrows of the day view skip a year, like the arrows of the month view.
    const jumpStep = view === "days" ? MONTHS_IN_YEAR : pageStep;
    const isPreviousDisabled = isCalendarPageOutOfBounds(view, addMonths(date, -pageStep), pageBounds);
    const isNextDisabled = isCalendarPageOutOfBounds(view, addMonths(date, pageStep), pageBounds);
    const yearPageStart = getYearPageStart(date.year);

    const weekdays = useMemo(
        () => getWeekdayNames(locale).map((name) => ({ text: name.narrow, label: name.long })),
        [locale]
    );

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

    const handleCellFocus = (key: string) => onNavigate({ date: keyToDate(key) }, false);

    const handleGridKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const target = getCalendarKeyTarget(view, date, event.key, { shiftKey: event.shiftKey, isRTL });

        if (!target) return;

        event.preventDefault();
        onKeyMove(getNearestAvailableDate(target, bounds));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== KEYS.TAB) return;

        const isInGrid = event.target instanceof Node && !!gridRef.current?.contains(event.target);

        if (!event.shiftKey) {
            if (isInGrid) onTabOutForward?.();
            return;
        }

        if (!onTabOutBackward) return;

        const firstStop = [
            isPreviousDisabled ? null : previousJumpRef.current,
            isPreviousDisabled ? null : previousStepRef.current,
            monthItemRef.current,
            yearItemRef.current,
            isNextDisabled ? null : nextStepRef.current,
            isNextDisabled ? null : nextJumpRef.current
        ].find((element) => !!element);

        if (event.target === firstStop || (!firstStop && isInGrid)) {
            event.preventDefault();
            onTabOutBackward();
        }
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

    const weeks = getMonthWeeks(date.year, date.month);
    const isShownDay = (day: CalendarDate) =>
        isSupportedDate(day) && (!isRange || (day.year === date.year && day.month === date.month));

    const getDayRows = (): CalendarGridCell[][] =>
        weeks.map((week) =>
            week.map((day) => {
                const key = getCalendarCellKey("days", day);

                if (!isShownDay(day)) return emptyCell(key);

                return {
                    key,
                    text: formatDay(day, locale),
                    label: formatFullDate(day, locale),
                    selected: isSameDate(day, start) || isSameDate(day, end),
                    disabled: isDateOutOfBounds(day, bounds),
                    current: isSameDate(day, today),
                    className: classNames({
                        datePicker__cell_outside: day.year !== date.year || day.month !== date.month,
                        datePicker__cell_today: isSameDate(day, today),
                        datePicker__cell_inRange:
                            !!range && compareDates(day, range.start) > 0 && compareDates(day, range.end) < 0
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

                return {
                    key,
                    text: formatYear(year, locale),
                    label: formatYear(year, locale),
                    selected: activeDate?.year === year,
                    disabled: isYearOutOfBounds(year, bounds),
                    current: today.year === year,
                    className: classNames({
                        datePicker__cell_outside: isOutside,
                        datePicker__cell_today: today.year === year
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

    const bands =
        view === "days" && range
            ? weeks.map((week) =>
                  getRangeBand(
                      week.map((day) => (isShownDay(day) ? day : null)),
                      range
                  )
              )
            : undefined;

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
        <div role="presentation" className="datePicker__picker" onKeyDown={handleKeyDown}>
            <div className="datePicker__header">
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
                bands={bands}
                focusKey={getCalendarCellKey(view, date)}
                shouldFocus={shouldFocusGrid}
                onFocusMoved={onFocusMoved}
                gridRef={gridRef}
                onKeyDown={handleGridKeyDown}
                onCellClick={handleCellClick}
                onCellFocus={handleCellFocus}
                onCellHover={onHover && view === "days" ? (key) => onHover(key ? keyToDate(key) : null) : undefined}
            />
        </div>
    );
};

export default CalendarPanel;
