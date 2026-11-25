import React, { FC, MouseEvent, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

// Components
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

import { PICKER_RANGE_FIELDS } from "@internal/components/Picker";

// Constants
import { RANGE_CALENDAR_PANELS } from "../../constants";
// Helpers
import {
    addMonths,
    compareDates,
    createBounds,
    getCalendarCellKey,
    getMonthDistance,
    getNearestAvailableDate,
    getPanelPageBounds,
    getToday,
    isCalendarPageOutOfBounds,
    isMonthOutOfBounds,
    isSameCalendarPage,
    orderPanelDates,
    toRange
} from "../../helpers";
// Types
import {
    CalendarDate,
    CalendarPresetState,
    CalendarSelection,
    CalendarView,
    DateBounds,
    DatePickerRangeFields,
    DatePickerSizes,
    IDatePickerLocalization
} from "../../types";
import CalendarPanel from "../CalendarPanel/CalendarPanel";
import CalendarPresets from "../CalendarPresets/CalendarPresets";

interface ICalendarProps {
    /**
     * The size of the cells and the header; phones always get the large one.
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
     * The selected day, or the selected start and end of a range.
     */
    selection: CalendarSelection;
    /**
     * The edited field of a range picker; left out by a single picker.
     */
    activeField?: DatePickerRangeFields;
    /**
     * The only day a range picker holds, which the next picked day completes the range with; `null`
     * while it holds no day or both. Left out by a single picker.
     */
    rangeAnchor?: CalendarDate | null;
    /**
     * The days that can be picked; the others are disabled.
     */
    bounds: DateBounds;
    /**
     * The presets shown beside the calendar, or under it on phones; left out without presets.
     */
    presets?: CalendarPresetState[];
    /**
     * Moves the focus into the calendar, when it was opened from the keyboard.
     */
    focusOnOpen?: boolean;
    /**
     * Picks a day.
     */
    onSelect: (date: CalendarDate, event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Picks the preset with `key`.
     */
    onPresetSelect: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Leaves the calendar for the field: `Tab` on its last tab stop or `Shift+Tab` on its first one.
     */
    onTabOut: () => void;
}

type PanelState = {
    /**
     * The place of the panel, which never changes.
     */
    id: number;
    /**
     * Whether the panel shows days, months or years.
     */
    view: CalendarView;
    /**
     * The day the panel shows the page of.
     */
    date: CalendarDate;
};

/**
 * The days the panels open on. A single panel opens on the edited day. Side by side panels open on
 * the months of the start and the end, or on a month after the start or before the end, or on
 * today's month and the next one; a month with nothing to pick gives way to the one at the other end.
 */
const getInitialDates = (
    panelCount: number,
    stateCount: number,
    { start, end }: CalendarSelection,
    activeDate: CalendarDate | null,
    bounds: DateBounds,
    today: CalendarDate
): CalendarDate[] => {
    if (panelCount === 1) {
        const date = activeDate ?? start ?? end ?? today;

        return Array.from({ length: stateCount }, (_, index) => addMonths(date, index));
    }

    // The months of a value are shown whatever the bounds; without one, the bounds decide.
    const limits = start || end ? createBounds() : bounds;
    const isEmpty = (date: CalendarDate) => isCalendarPageOutOfBounds("days", date, limits);
    const first = start ?? (end ? addMonths(end, -1) : getNearestAvailableDate(today, bounds));
    const second = end && getMonthDistance(first, end) > 0 ? end : addMonths(first, 1);

    if (isEmpty(second) && !isEmpty(addMonths(first, -1))) return [addMonths(first, -1), first];
    if (isEmpty(first) && !isEmpty(addMonths(second, 1))) return [second, addMonths(second, 1)];

    return [first, second];
};

/**
 * The calendar of the DatePicker popover with its optional presets. A single picker shows one
 * month; a range picker shows two side by side (one on phones), each paged on its own and never
 * meeting the other. The arrow keys move the focus inside a grid, on to the panel that shows the
 * day, and inside the presets; `Tab` goes through the presets, the headers and the grids (the
 * presets last on phones, where they are under the calendar) and from there back to the field.
 */
const Calendar: FC<ICalendarProps> = ({
    size,
    locale,
    texts,
    selection,
    activeField,
    rangeAnchor,
    bounds,
    presets,
    focusOnOpen,
    onSelect,
    onPresetSelect,
    onTabOut
}) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const isMobile = !!breakpoint?.isMobileBreakpoint;
    const calendarSize = isMobile ? "large" : size;
    const isRange = !!activeField;
    const stateCount = isRange ? RANGE_CALENDAR_PANELS : 1;
    const panelCount = isMobile ? 1 : stateCount;

    const today = useMemo(getToday, []);
    const { start, end } = selection;
    const activeDate = activeField === PICKER_RANGE_FIELDS.END ? end : start;

    const [panels, setPanels] = useState<PanelState[]>(() =>
        getInitialDates(panelCount, stateCount, selection, activeDate, bounds, today).map((date, id) => ({
            id,
            view: "days",
            date
        }))
    );
    const [focusedPanel, setFocusedPanel] = useState<number | null>(null);
    const [hoverDate, setHoverDate] = useState<CalendarDate | null>(null);

    const visiblePanels = panels.slice(0, panelCount);
    // A panel alone moves to a day it can pick; one beside another keeps its page, which may have none.
    const pageDates = visiblePanels.map(({ view, date }) => {
        const nearest = getNearestAvailableDate(date, bounds);

        return panelCount === 1 || isSameCalendarPage(view, nearest, date) ? nearest : date;
    });

    const previewRange = rangeAnchor && hoverDate ? toRange(rangeAnchor, hoverDate) : null;
    // A start typed past the end, or an end typed before the start, is not a range until the field is left.
    const selectedRange = start && end && compareDates(start, end) <= 0 ? { start, end } : null;
    const range = isRange ? (previewRange ?? selectedRange) : null;

    const updatePanel = (index: number, changes: Partial<PanelState>, focusGrid = false) => {
        setPanels((current) => {
            const next = current.map((panel) => (panel.id === index ? { ...panel, ...changes } : panel));

            // A panel browsing months or years moves the others only once it shows days again.
            if (next[index].view !== "days") return next;

            const dates = orderPanelDates(
                next.map((panel) => panel.date),
                index
            );

            return next.map((panel) => ({ ...panel, date: dates[panel.id] }));
        });

        if (focusGrid) setFocusedPanel(index);
    };

    const findPanelShowing = (date: CalendarDate, inDayView = false) =>
        pageDates.findIndex(
            (pageDate, index) =>
                (!inDayView || visiblePanels[index].view === "days") && isSameCalendarPage("days", pageDate, date)
        );

    // A panel leaves room for the others inside the bounds, so a month it has no room for goes to one that has.
    const getPanelFor = (date: CalendarDate, preferred: number): number => {
        const fits = (index: number) =>
            !isMonthOutOfBounds(date.year, date.month, getPanelPageBounds(bounds, index, panelCount));

        if (fits(preferred)) return preferred;

        const other = visiblePanels.findIndex((panel) => fits(panel.id));

        return other >= 0 ? other : preferred;
    };

    // The only request to focus a grid on open: one made at mount too would come back after the grid took
    // the focus, and pull it back from the header on the next page change.
    useEffect(() => {
        if (focusOnOpen) setFocusedPanel(Math.max(activeDate ? findPanelShowing(activeDate) : 0, 0));
    }, [focusOnOpen]);

    // The calendar follows the edited field: a typed or picked day, or a switch to the other range field.
    const startKey = start && getCalendarCellKey("days", start);
    const endKey = end && getCalendarCellKey("days", end);
    const activeKey = activeField === PICKER_RANGE_FIELDS.END ? endKey : startKey;
    const previousKeysRef = useRef({ field: activeField, start: startKey, end: endKey });

    useEffect(() => {
        const previous = previousKeysRef.current;
        const previousKey = previous.field === PICKER_RANGE_FIELDS.END ? previous.end : previous.start;

        previousKeysRef.current = { field: activeField, start: startKey, end: endKey };

        // A picked day moves the editing on to the other field, and leaves the months where they are.
        if (previous.field !== activeField && (previous.start !== startKey || previous.end !== endKey)) return;

        // A range set at once, like by a preset, is shown from the month of its start, its end beside it.
        if (panelCount > 1 && start && end && previous.start !== startKey && previous.end !== endKey) {
            const dates = getInitialDates(panelCount, stateCount, selection, activeDate, bounds, today);

            setPanels((current) => current.map((panel) => ({ ...panel, view: "days", date: dates[panel.id] })));
            return;
        }

        if (!activeDate || (previous.field === activeField && previousKey === activeKey)) return;

        const shown = findPanelShowing(activeDate);
        const preferred = activeField === PICKER_RANGE_FIELDS.END ? panelCount - 1 : 0;

        updatePanel(shown >= 0 ? shown : getPanelFor(activeDate, preferred), { view: "days", date: activeDate });
    }, [activeField, startKey, endKey]);

    const handleKeyMove = (index: number, date: CalendarDate) => {
        const shown = visiblePanels[index].view === "days" ? findPanelShowing(date, true) : index;

        updatePanel(shown >= 0 ? shown : getPanelFor(date, index), { date }, true);
    };

    // The presets are a tab stop while one of them can be picked: the first one beside the calendar,
    // the last one under it on phones.
    const hasPresetStop = !!presets?.some((preset) => !preset.disabled);
    const isPresetStopFirst = hasPresetStop && !isMobile;
    const isPresetStopLast = hasPresetStop && isMobile;

    const presetList = !!presets?.length && (
        <CalendarPresets
            label={texts.presets}
            size={calendarSize}
            orientation={isMobile ? "horizontal" : "vertical"}
            presets={presets}
            onSelect={onPresetSelect}
            onTabOutBackward={isPresetStopFirst ? onTabOut : undefined}
            onTabOutForward={isPresetStopLast ? onTabOut : undefined}
        />
    );

    return (
        <div
            className={classNames("datePicker__calendar", `datePicker__calendar_size_${calendarSize}`, {
                datePicker__calendar_mobile: isMobile
            })}
        >
            {!isMobile && presetList}
            <div className="datePicker__panels">
                {visiblePanels.map((panel, index) => (
                    <CalendarPanel
                        key={panel.id}
                        size={calendarSize}
                        locale={locale}
                        texts={texts}
                        isMobile={isMobile}
                        today={today}
                        view={panel.view}
                        date={pageDates[index]}
                        selection={selection}
                        activeField={activeField}
                        range={range}
                        bounds={bounds}
                        pageBounds={getPanelPageBounds(bounds, index, panelCount)}
                        shouldFocusGrid={focusedPanel === index}
                        onFocusMoved={() => setFocusedPanel(null)}
                        onNavigate={(changes, focusGrid) => updatePanel(index, changes, focusGrid)}
                        onKeyMove={(date) => handleKeyMove(index, date)}
                        onSelect={onSelect}
                        onHover={isRange ? setHoverDate : undefined}
                        onTabOutBackward={index === 0 && !isPresetStopFirst ? onTabOut : undefined}
                        onTabOutForward={index === panelCount - 1 && !isPresetStopLast ? onTabOut : undefined}
                    />
                ))}
            </div>
            {isMobile && presetList}
        </div>
    );
};

export default Calendar;
