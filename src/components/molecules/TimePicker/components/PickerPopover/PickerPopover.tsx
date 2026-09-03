import React, {
    Dispatch,
    FC,
    FocusEvent,
    KeyboardEvent,
    MouseEvent,
    Ref,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef
} from "react";
import classNames from "classnames";

// Components
import { IPopoverProps, IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Constants & Helpers
import { headerTextVariantMap, KEYS, MERIDIEM_LIST, MERIDIEMS, TIME_COLUMNS_ORDER, TIME_PARTS } from "../../constants";
import { getTimePartValues, isPickerPartDisabled, resolveLocalization } from "../../helpers";
// Types
import {
    ShouldDisableTime,
    TimeParts,
    TimePickerLocalization,
    TimePickerRangeFields,
    TimePickerSizes
} from "../../types";
import PickerButton from "../PickerButton/PickerButton";

type PickerColumnEntry = {
    value: string;
    text: string;
    selected: boolean;
    disabled: boolean;
};

type PickerColumn = {
    /**
     * Time part of the column.
     */
    part: keyof TimeParts;
    /**
     * Header text of the column.
     */
    header: string;
    /**
     * ARIA label of the column.
     */
    ariaLabel: string;
    /**
     * List of entries of the column.
     */
    entries: PickerColumnEntry[];
    /**
     * Index of the single item of this column that takes part in the tab sequence,
     * so `Tab` moves between columns instead of through every value.
     */
    tabStopIndex: number;
};

interface IPickerPopoverProps {
    /**
     * Controls whether the popover is open.
     */
    open?: boolean;
    /**
     * Moves focus into the popover once it is opened. Used when it was opened from the keyboard,
     * so that a click on the input keeps the caret in the field.
     */
    focusOnOpen?: boolean;
    /**
     * Callback invoked when the popover should be closed.
     */
    onClose?: IPopoverProps["onClose"];
    /**
     * Callback invoked when the focus leaves an element inside the popover; the owner decides
     * whether it went outside the picker.
     */
    onFocusOut?: (event: FocusEvent<HTMLDivElement>) => void;
    /**
     * Popover placement position.
     */
    position?: string;
    /**
     * Controls the popover height mode on mobile.
     */
    mobileHeightMode?: "fit" | "full";
    /**
     * Size of the popover and its items.
     */
    size?: TimePickerSizes;
    /**
     * Reference to the popover element.
     */
    popoverRef?: Ref<IPopoverRef>;
    /**
     * Popover positioning props passed to the underlying popover component.
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    /**
     * `id` of the popover, referenced by the input through `aria-controls`.
     */
    id: string;
    /**
     * Callback invoked with the edited column and the picked value.
     */
    onSelect?: (column: keyof TimeParts, val: string) => void;
    /**
     * Currently selected time parts of the edited field.
     */
    parts?: TimeParts;
    /**
     * Whether the time picker is in 12-hour format.
     */
    is12Hour: boolean;
    /**
     * Custom localization for the component.
     */
    localization?: TimePickerLocalization;
    /**
     * Current active field of the range picker.
     */
    activeField?: TimePickerRangeFields;
    /**
     * Time parts of both range fields, used to keep start and end in order.
     */
    partsStart?: TimeParts;
    /**
     * Time parts of both range fields, used to keep start and end in order.
     */
    partsEnd?: TimeParts;
    /**
     * Callback invoked to determine whether a time part should be disabled.
     */
    shouldDisableTime?: ShouldDisableTime;
}

const VERTICAL_KEYS: string[] = [KEYS.ARROW_UP, KEYS.ARROW_DOWN];

/**
 * @description
 * Presses on the non focusable parts of the popover (headers, scrollbars, padding) must not take
 * the focus away from the input: the field would blur and the popover would close itself.
 * Buttons keep the default so the keyboard can continue from the clicked value.
 */
const keepReferenceFocus = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;

    event.preventDefault();
};
const HORIZONTAL_KEYS: string[] = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT];
const EDGE_KEYS: string[] = [KEYS.HOME, KEYS.END];

/**
 * @description
 * Returns the index of the item that should be reachable with `Tab`: the selected one when there
 * is a selection, otherwise the first enabled one.
 */
const getTabStopIndex = (entries: PickerColumnEntry[]): number => {
    const selectedIndex = entries.findIndex((entry) => entry.selected);
    if (selectedIndex >= 0) return selectedIndex;

    const firstEnabledIndex = entries.findIndex((entry) => !entry.disabled);
    return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
};

const getScrollableAncestor = (element: HTMLElement, boundary: HTMLElement | null): HTMLElement | null => {
    let node: HTMLElement | null = element.parentElement;

    while (node) {
        if (node.scrollHeight > node.clientHeight) return node;
        if (node === boundary) return null;

        node = node.parentElement;
    }

    return null;
};

/**
 * @description
 * Centers the selected value inside its own scroll container, without scrolling the page
 * (which `scrollIntoView` would do).
 */
const scrollIntoCenter = (element: HTMLElement, boundary: HTMLElement | null) => {
    const scroller = getScrollableAncestor(element, boundary);
    if (!scroller) return;

    const elementRect = element.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();

    scroller.scrollTop += elementRect.top - scrollerRect.top - (scroller.clientHeight - elementRect.height) / 2;
};

const PickerPopover: FC<IPickerPopoverProps> = ({
    popoverRef,
    open,
    focusOnOpen,
    setProps,
    onClose,
    onFocusOut,
    size = "medium",
    position,
    onSelect,
    mobileHeightMode,
    id,
    parts,
    is12Hour,
    localization,
    shouldDisableTime,
    activeField,
    partsStart,
    partsEnd
}) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const isMobile = breakpoint?.isMobileBreakpoint;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const columnRefs = useRef<Partial<Record<keyof TimeParts, HTMLDivElement | null>>>({});
    const pendingScrollRef = useRef(false);
    const pendingFocusRef = useRef(false);

    const texts = useMemo(() => resolveLocalization(localization), [localization]);

    const columnOrder = useMemo<(keyof TimeParts)[]>(
        () => (is12Hour ? [...TIME_COLUMNS_ORDER, TIME_PARTS.MERIDIEM] : [...TIME_COLUMNS_ORDER]),
        [is12Hour]
    );

    const buildEntries = useCallback(
        (part: keyof TimeParts, values: string[], getText: (value: string) => string): PickerColumnEntry[] =>
            values.map((value) => ({
                value,
                text: getText(value),
                selected: parts?.[part] === value,
                disabled: isPickerPartDisabled(
                    part,
                    value,
                    parts,
                    is12Hour,
                    activeField,
                    partsStart,
                    partsEnd,
                    shouldDisableTime
                )
            })),
        [parts, is12Hour, activeField, partsStart, partsEnd, shouldDisableTime]
    );

    const columns = useMemo<PickerColumn[]>(() => {
        if (!open) return [];

        const headers: Record<string, string> = {
            [TIME_PARTS.HOURS]: texts.hours,
            [TIME_PARTS.MINUTES]: texts.minutes,
            [TIME_PARTS.SECONDS]: texts.seconds
        };

        const ariaLabels: Record<string, string> = {
            [TIME_PARTS.HOURS]: texts.selectHours,
            [TIME_PARTS.MINUTES]: texts.selectMinutes,
            [TIME_PARTS.SECONDS]: texts.selectSeconds
        };

        return TIME_COLUMNS_ORDER.map((part) => {
            const entries = buildEntries(part, getTimePartValues(part, is12Hour), (value) => value);

            return {
                part,
                header: headers[part],
                ariaLabel: ariaLabels[part],
                entries,
                tabStopIndex: getTabStopIndex(entries)
            };
        });
    }, [open, texts, buildEntries, is12Hour]);

    const meridiemColumn = useMemo<PickerColumn | null>(() => {
        if (!open || !is12Hour) return null;

        const meridiemTexts: Record<string, string> = {
            [MERIDIEMS.AM]: texts.am,
            [MERIDIEMS.PM]: texts.pm
        };

        const entries = buildEntries(TIME_PARTS.MERIDIEM, MERIDIEM_LIST, (value) => meridiemTexts[value]);

        return {
            part: TIME_PARTS.MERIDIEM,
            header: "",
            ariaLabel: texts.selectMeridiem,
            entries,
            tabStopIndex: getTabStopIndex(entries)
        };
    }, [open, is12Hour, texts, buildEntries]);

    const getEnabledButtons = (part: keyof TimeParts): HTMLButtonElement[] => {
        const container = columnRefs.current[part];
        if (!container) return [];

        return Array.from(container.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
    };

    const focusColumnItem = (part: keyof TimeParts, index: number) => {
        const buttons = getEnabledButtons(part);
        if (!buttons.length) return;

        buttons[Math.max(0, Math.min(index, buttons.length - 1))].focus();
    };

    const focusSelectedInColumn = (part?: keyof TimeParts) => {
        if (!part) return;

        const buttons = getEnabledButtons(part);
        if (!buttons.length) return;

        const selectedIndex = buttons.findIndex((button) => button.getAttribute("aria-selected") === "true");
        buttons[selectedIndex < 0 ? 0 : selectedIndex].focus();
    };

    const applyPendingColumnEffects = () => {
        if (!pendingScrollRef.current && !pendingFocusRef.current) return;
        if (!columnOrder.every((part) => columnRefs.current[part])) return;

        if (pendingScrollRef.current) {
            pendingScrollRef.current = false;

            columnOrder.forEach((part) => {
                const selected = columnRefs.current[part]?.querySelector<HTMLElement>('[aria-selected="true"]');

                if (selected) {
                    scrollIntoCenter(selected, wrapperRef.current);
                }
            });
        }

        if (pendingFocusRef.current) {
            pendingFocusRef.current = false;
            queueMicrotask(() => focusSelectedInColumn(columnOrder[0]));
        }
    };

    const registerColumn = (part: keyof TimeParts) => (node: HTMLDivElement | null) => {
        columnRefs.current[part] = node;

        if (node) {
            applyPendingColumnEffects();
        }
    };

    useEffect(() => {
        pendingScrollRef.current = open === true;
        pendingFocusRef.current = open === true && focusOnOpen === true;

        if (open) {
            applyPendingColumnEffects();
        }
    }, [open, focusOnOpen, columnOrder]);

    const handleColumnClick = (part: keyof TimeParts) => (event: MouseEvent<HTMLDivElement>) => {
        const button = (event.target as HTMLElement).closest("button");

        if (!button || button.disabled || !button.dataset.value) return;

        onSelect?.(part, button.dataset.value);
    };

    const handleColumnKeyDown = (part: keyof TimeParts) => (event: KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;

        if (!VERTICAL_KEYS.includes(key) && !HORIZONTAL_KEYS.includes(key) && !EDGE_KEYS.includes(key)) return;

        event.preventDefault();

        if (HORIZONTAL_KEYS.includes(key)) {
            const step = key === KEYS.ARROW_RIGHT ? 1 : -1;
            focusSelectedInColumn(columnOrder[columnOrder.indexOf(part) + step]);
            return;
        }

        const buttons = getEnabledButtons(part);
        if (!buttons.length) return;

        if (key === KEYS.HOME) {
            focusColumnItem(part, 0);
            return;
        }

        if (key === KEYS.END) {
            focusColumnItem(part, buttons.length - 1);
            return;
        }

        const currentIndex = buttons.indexOf(event.target as HTMLButtonElement);
        focusColumnItem(part, key === KEYS.ARROW_DOWN ? currentIndex + 1 : currentIndex - 1);
    };

    const renderEntry = (column: PickerColumn, entry: PickerColumnEntry, index: number) => (
        <PickerButton
            key={entry.value}
            role="option"
            aria-selected={entry.selected}
            tabIndex={index === column.tabStopIndex ? 0 : -1}
            data-value={entry.value}
            selected={entry.selected}
            disabled={entry.disabled}
            size={size}
            className={classNames("timePicker__pickerButton", `timePicker__pickerButton_size_${size}`)}
        >
            {entry.text}
        </PickerButton>
    );

    return (
        <Popover
            size="fitContent"
            open={open}
            position={position}
            setProps={setProps}
            onClose={onClose}
            ref={popoverRef}
            mobileHeightMode={mobileHeightMode}
            withArrow={false}
        >
            <PopoverBody withPadding={false}>
                {open && (
                    <div
                        id={id}
                        ref={wrapperRef}
                        role="presentation"
                        className={classNames("timePicker__wrapper", `timePicker__wrapper_size_${size}`, {
                            timePicker__wrapper_mobile: isMobile
                        })}
                        onBlur={onFocusOut}
                        onMouseDown={keepReferenceFocus}
                    >
                        {columns.map((column) => (
                            <div key={column.part} className="timePicker__column">
                                <div className="timePicker__headerWrapper">
                                    <div className="timePicker__header">
                                        <Text className="ellipsis-text" as="p" variant={headerTextVariantMap[size]}>
                                            {column.header}
                                        </Text>
                                    </div>
                                </div>
                                <div className="timePicker__body">
                                    <Scrollbar>
                                        <div
                                            ref={registerColumn(column.part)}
                                            className="timePicker__list"
                                            role="listbox"
                                            tabIndex={-1}
                                            aria-label={column.ariaLabel}
                                            onClick={handleColumnClick(column.part)}
                                            onKeyDown={handleColumnKeyDown(column.part)}
                                        >
                                            {column.entries.map((entry, index) => renderEntry(column, entry, index))}
                                        </div>
                                    </Scrollbar>
                                </div>
                            </div>
                        ))}
                        {meridiemColumn && (
                            <div
                                ref={registerColumn(meridiemColumn.part)}
                                className="timePicker__column timePicker__column_meridiem"
                                role="listbox"
                                tabIndex={-1}
                                aria-label={meridiemColumn.ariaLabel}
                                onClick={handleColumnClick(meridiemColumn.part)}
                                onKeyDown={handleColumnKeyDown(meridiemColumn.part)}
                            >
                                {meridiemColumn.entries.map((entry, index) =>
                                    renderEntry(meridiemColumn, entry, index)
                                )}
                            </div>
                        )}
                    </div>
                )}
            </PopoverBody>
        </Popover>
    );
};

export default PickerPopover;
