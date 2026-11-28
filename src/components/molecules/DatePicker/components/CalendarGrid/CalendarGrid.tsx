import React, { FC, KeyboardEvent, MouseEvent, useEffect } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

import { PickerButton } from "@internal/components/Picker";

// Hooks
import useElementRefs from "../../hooks/useElementRefs";
// Types
import { CalendarView, DatePickerSizes } from "../../types";

export type CalendarGridCell = {
    /**
     * Identifies the cell: an ISO day, a `YYYY-MM` month or a `YYYY` year.
     */
    key: string;
    /**
     * The visible text of the cell: a day number, a month name or a year.
     */
    text: string;
    /**
     * Accessible name of the cell, like the full date of a day.
     */
    label: string;
    /**
     * Whether the cell shows a selected day, or the month or year of the edited one.
     */
    selected?: boolean;
    /**
     * Whether the cell is outside the selectable days.
     */
    disabled?: boolean;
    /**
     * Whether the cell is today, or today's month or year.
     */
    current?: boolean;
    /**
     * Keeps the place of a day or a year the grid leaves out, as a cell with nothing to pick.
     */
    empty?: boolean;
    /**
     * Classes of the cell's state, like a day of the range.
     */
    className?: string;
};

type CalendarGridColumnHeader = {
    /**
     * The visible text of the header, like a narrow weekday name.
     */
    text: string;
    /**
     * Accessible name of the header, like the full weekday name.
     */
    label: string;
};

interface ICalendarGridProps {
    /**
     * Accessible name of the grid, like the month it shows.
     */
    label: string;
    /**
     * The size of the cells.
     */
    size: DatePickerSizes;
    /**
     * Whether the grid shows days, months or years.
     */
    view: CalendarView;
    /**
     * The weekday names above the days; left out by the month and the year view.
     */
    columnHeaders?: CalendarGridColumnHeader[];
    /**
     * The cells, row by row.
     */
    rows: CalendarGridCell[][];
    /**
     * The cell that takes part in the tab sequence.
     */
    focusKey: string;
    /**
     * Moves the focus to the `focusKey` cell once it is rendered; `onFocusMoved` confirms it.
     */
    shouldFocus: boolean;
    /**
     * Confirms that the focus moved to the `focusKey` cell.
     */
    onFocusMoved: () => void;
    /**
     * Handles a key pressed inside the grid.
     */
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
    /**
     * Picks the cell with `key`.
     */
    onCellClick: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Reports the cell with `key` taking the focus.
     */
    onCellFocus: (key: string) => void;
    /**
     * Reports the cell under the pointer, `null` when the pointer leaves the grid.
     */
    onCellHover?: (key: string | null) => void;
}

/**
 * The cells of one calendar view, with a single tab stop that the arrow keys move around.
 */
const CalendarGrid: FC<ICalendarGridProps> = ({
    label,
    size,
    view,
    columnHeaders,
    rows,
    focusKey,
    shouldFocus,
    onFocusMoved,
    onKeyDown,
    onCellClick,
    onCellFocus,
    onCellHover
}) => {
    const cells = useElementRefs<HTMLButtonElement>();

    useEffect(() => {
        if (!shouldFocus) return;

        onFocusMoved();
        cells.get(focusKey)?.focus({ preventScroll: true });
    }, [shouldFocus, focusKey]);

    return (
        <div
            role="grid"
            tabIndex={-1}
            aria-label={label}
            className={classNames("datePicker__grid", `datePicker__grid_view_${view}`)}
            onKeyDown={onKeyDown}
            onMouseLeave={() => onCellHover?.(null)}
        >
            {columnHeaders && (
                <div role="row" className="datePicker__row">
                    {columnHeaders.map((header) => (
                        <div
                            key={header.label}
                            role="columnheader"
                            aria-label={header.label}
                            className="datePicker__weekday"
                        >
                            <Text as="span" variant={size === "small" ? "labelSmallSemibold" : "labelMediumSemibold"}>
                                {header.text}
                            </Text>
                        </div>
                    ))}
                </div>
            )}
            {rows.map((row) => (
                <div key={row[0].key} role="row" className="datePicker__row">
                    {row.map((cell) =>
                        cell.empty ? (
                            <div
                                key={cell.key}
                                role="cell"
                                className={classNames("datePicker__cell", "datePicker__cell_empty", cell.className)}
                            />
                        ) : (
                            <PickerButton
                                key={cell.key}
                                ref={cells.getRef(cell.key)}
                                role="gridcell"
                                value={cell.key}
                                size={size}
                                tabIndex={cell.key === focusKey ? 0 : -1}
                                selected={cell.selected}
                                disabled={cell.disabled}
                                aria-label={cell.label}
                                aria-current={cell.current ? "date" : undefined}
                                className={classNames("datePicker__cell", cell.className, {
                                    datePicker__cell_selected: cell.selected
                                })}
                                onClick={onCellClick}
                                onFocus={onCellFocus}
                                onMouseEnter={onCellHover}
                            >
                                {cell.text}
                            </PickerButton>
                        )
                    )}
                </div>
            ))}
        </div>
    );
};

export default CalendarGrid;
