import React, { CSSProperties, FC, KeyboardEvent, MouseEvent, Ref, useEffect, useRef } from "react";
import classNames from "classnames";

// Components
import Text from "@components/atoms/Text";

import { PickerButton } from "@internal/components/Picker";

// Types
import { CalendarRangeBand, CalendarView, DatePickerSizes } from "../../types";

export type CalendarGridCell = {
    /**
     * Identifies the cell: an ISO day, a `YYYY-MM` month or a `YYYY` year.
     */
    key: string;
    text: string;
    /**
     * Accessible name of the cell, like the full date of a day.
     */
    label: string;
    selected?: boolean;
    disabled?: boolean;
    /**
     * Whether the cell is today, or today's month or year.
     */
    current?: boolean;
    /**
     * Keeps the place of a day or a year outside the supported dates, with nothing to pick.
     */
    empty?: boolean;
    className?: string;
};

export type CalendarGridColumnHeader = {
    text: string;
    label: string;
};

interface ICalendarGridProps {
    /**
     * Accessible name of the grid, like the month it shows.
     */
    label: string;
    size: DatePickerSizes;
    view: CalendarView;
    columnHeaders?: CalendarGridColumnHeader[];
    rows: CalendarGridCell[][];
    /**
     * The band of each row behind the days of a range, by the index of the row.
     */
    bands?: (CalendarRangeBand | null)[];
    /**
     * The cell that takes part in the tab sequence.
     */
    focusKey: string;
    /**
     * Moves the focus to the `focusKey` cell once it is rendered; `onFocusMoved` confirms it.
     */
    shouldFocus: boolean;
    onFocusMoved: () => void;
    gridRef: Ref<HTMLDivElement>;
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
    onCellClick: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
    onCellFocus: (key: string) => void;
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
    bands,
    focusKey,
    shouldFocus,
    onFocusMoved,
    gridRef,
    onKeyDown,
    onCellClick,
    onCellFocus,
    onCellHover
}) => {
    const cellRefs = useRef(new Map<string, HTMLButtonElement>());
    const cellRefCallbacks = useRef(new Map<string, (node: HTMLButtonElement | null) => void>());

    const getCellRef = (key: string) => {
        let callback = cellRefCallbacks.current.get(key);

        if (!callback) {
            callback = (node: HTMLButtonElement | null) => {
                if (node) cellRefs.current.set(key, node);
                else cellRefs.current.delete(key);
            };
            cellRefCallbacks.current.set(key, callback);
        }

        return callback;
    };

    useEffect(() => {
        if (!shouldFocus) return;

        onFocusMoved();
        // The popover may still be on its way to its position, so the page must not scroll to it.
        cellRefs.current.get(focusKey)?.focus({ preventScroll: true });
    }, [shouldFocus, focusKey]);

    // One band behind the cells, so the range also covers the gaps between its days.
    const renderBand = (band?: CalendarRangeBand | null) =>
        band && (
            <span
                aria-hidden
                className={classNames("datePicker__band", {
                    datePicker__band_start: band.isStart,
                    datePicker__band_end: band.isEnd
                })}
                style={
                    {
                        "--date-picker-band-from": band.from,
                        "--date-picker-band-days": band.to - band.from + 1
                    } as CSSProperties
                }
            />
        );

    return (
        <div
            ref={gridRef}
            role="grid"
            tabIndex={-1}
            aria-label={label}
            className={classNames("datePicker__grid", `datePicker__grid_view_${view}`)}
            onKeyDown={onKeyDown}
            onMouseLeave={onCellHover && (() => onCellHover(null))}
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
            {rows.map((row, rowIndex) => (
                <div key={row[0].key} role="row" className="datePicker__row">
                    {renderBand(bands?.[rowIndex])}
                    {row.map((cell) =>
                        cell.empty ? (
                            <div
                                key={cell.key}
                                role="gridcell"
                                aria-hidden
                                className={classNames("datePicker__cell", "datePicker__cell_empty", cell.className)}
                            />
                        ) : (
                            <PickerButton
                                key={cell.key}
                                ref={getCellRef(cell.key)}
                                role="gridcell"
                                value={cell.key}
                                size={size}
                                tabIndex={cell.key === focusKey ? 0 : -1}
                                selected={cell.selected}
                                disabled={cell.disabled}
                                aria-label={cell.label}
                                aria-current={cell.current ? "date" : undefined}
                                className={classNames(
                                    "datePicker__cell",
                                    `datePicker__cell_size_${size}`,
                                    cell.className
                                )}
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
