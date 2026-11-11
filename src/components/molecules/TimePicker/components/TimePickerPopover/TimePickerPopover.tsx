import React, {
    Dispatch,
    FC,
    FocusEvent,
    KeyboardEvent,
    MouseEvent,
    Ref,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import classNames from "classnames";

// Components
import { IPopoverProps, IPopoverRef } from "@components/atoms/Popover";
import Scrollbar, { ScrollbarRefType } from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

import { headerTextVariantMap, KEYS, PickerButton, PickerPopover, PickerPosition } from "@internal/components/Picker";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Constants
import { TIME_COLUMNS_ORDER, TIME_PARTS } from "../../constants";
// Helpers
import { getTimePartValues, isPickerPartDisabled, resolveLocalization } from "../../helpers";
// Types
import { ITimePickerLocalization, TimeParts, TimePickerRangeFields, TimePickerSizes } from "../../types";

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

type ItemClickHandler = (value: string, event: MouseEvent<HTMLButtonElement>) => void;

interface ITimePickerPopoverProps {
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
     * Callback invoked on `Tab` while the focus is inside the popover, before the browser moves it,
     * so the owner can hand the focus back to the field and let `Tab` continue from there.
     */
    onTabOut?: () => void;
    /**
     * Popover placement position.
     */
    position?: PickerPosition;
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
     * Callback invoked with the edited column, the picked value and the click that picked it (a key
     * press on an option arrives as a click as well).
     */
    onSelect?: (column: keyof TimeParts, val: string, event: MouseEvent<HTMLButtonElement>) => void;
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
    localization?: ITimePickerLocalization;
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
}

const VERTICAL_KEYS: string[] = [KEYS.ARROW_UP, KEYS.ARROW_DOWN];
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

    return Math.max(
        0,
        entries.findIndex((entry) => !entry.disabled)
    );
};

type ColumnHeaderProps = {
    text: string;
    size: TimePickerSizes;
};

/**
 * Header of a picker column: long texts are truncated and shown in full in a tooltip, on hover or,
 * for touch devices, after a tap on the header. A tap anywhere else hides it again.
 */
const ColumnHeader: FC<ColumnHeaderProps> = ({ text, size }) => {
    const textRef = useRef<HTMLParagraphElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const isTruncated = useEllipsisDetection(textRef, [text]);
    const [isPinned, setIsPinned] = useState(false);

    useEffect(() => {
        if (!isPinned) return undefined;

        const unpin = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) setIsPinned(false);
        };

        document.addEventListener("pointerdown", unpin);

        return () => document.removeEventListener("pointerdown", unpin);
    }, [isPinned]);

    const togglePinned = () => {
        if (isTruncated) setIsPinned((pinned) => !pinned);
    };

    return (
        <div className="timePicker__headerWrapper">
            <div ref={headerRef} role="presentation" className="timePicker__header" onClick={togglePinned}>
                <Tooltip text={text} isVisible={isTruncated} alwaysShow={isPinned && isTruncated}>
                    <Text
                        ref={textRef}
                        as="p"
                        className="ellipsis-text timePicker__headerText"
                        variant={headerTextVariantMap[size]}
                    >
                        {text}
                    </Text>
                </Tooltip>
            </div>
        </div>
    );
};

/**
 * The time columns of the TimePicker in the picker popover.
 */
const TimePickerPopover: FC<ITimePickerPopoverProps> = ({
    popoverRef,
    open,
    focusOnOpen,
    setProps,
    onClose,
    onFocusOut,
    onTabOut,
    size = "medium",
    position,
    onSelect,
    mobileHeightMode,
    id,
    parts,
    is12Hour,
    localization,
    activeField,
    partsStart,
    partsEnd
}) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const isMobile = breakpoint?.isMobileBreakpoint;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const columnRefs = useRef<Partial<Record<keyof TimeParts, HTMLDivElement | null>>>({});
    const scrollbarRefs = useRef<Partial<Record<keyof TimeParts, ScrollbarRefType | null>>>({});
    const itemRefs = useRef(new Map<string, HTMLButtonElement>());
    const itemRefCallbacks = useRef(new Map<string, (node: HTMLButtonElement | null) => void>());
    const pendingScrollRef = useRef(false);
    const pendingFocusRef = useRef(false);
    const pickedColumnRef = useRef<keyof TimeParts | null>(null);
    const previousPartsRef = useRef<TimeParts | undefined>(undefined);
    const previousActiveFieldRef = useRef(activeField);
    const onSelectRef = useRef(onSelect);

    onSelectRef.current = onSelect;

    /**
     * The column scrollbars stay hidden after the picker positions the columns itself and come back
     * with the first scroll gesture of the user.
     */
    const [scrollbarsHidden, setScrollbarsHidden] = useState(false);
    const revealScrollbars = () => setScrollbarsHidden(false);

    const texts = useMemo(() => resolveLocalization(localization), [localization]);

    const columnOrder = useMemo<(keyof TimeParts)[]>(
        () => (is12Hour ? [...TIME_COLUMNS_ORDER, TIME_PARTS.MERIDIEM] : [...TIME_COLUMNS_ORDER]),
        [is12Hour]
    );

    const columns = useMemo<PickerColumn[]>(() => {
        if (!open) return [];

        const headers: Partial<Record<keyof TimeParts, string>> = {
            hours: texts.hours,
            minutes: texts.minutes,
            seconds: texts.seconds
        };
        const ariaLabels: Record<keyof TimeParts, string> = {
            hours: texts.selectHours,
            minutes: texts.selectMinutes,
            seconds: texts.selectSeconds,
            meridiem: texts.selectMeridiem
        };

        return columnOrder.map((part) => {
            const entries = getTimePartValues(part, is12Hour).map((value) => ({
                value,
                text: value,
                selected: parts?.[part] === value,
                disabled: isPickerPartDisabled(part, value, parts, is12Hour, activeField, partsStart, partsEnd)
            }));

            return {
                part,
                header: headers[part] ?? "",
                ariaLabel: ariaLabels[part],
                entries,
                tabStopIndex: getTabStopIndex(entries)
            };
        });
    }, [open, texts, columnOrder, parts, is12Hour, activeField, partsStart, partsEnd]);

    // Read by the deferred scroll and focus, which run after the render that scheduled them.
    const columnsRef = useRef(columns);

    columnsRef.current = columns;

    const itemKey = (part: keyof TimeParts, value: string) => `${part}:${value}`;

    const getItem = (part: keyof TimeParts, value: string) => itemRefs.current.get(itemKey(part, value));

    const getItemRef = (part: keyof TimeParts, value: string) => {
        const key = itemKey(part, value);
        let callback = itemRefCallbacks.current.get(key);

        if (!callback) {
            callback = (node: HTMLButtonElement | null) => {
                if (node) itemRefs.current.set(key, node);
                else itemRefs.current.delete(key);
            };
            itemRefCallbacks.current.set(key, callback);
        }

        return callback;
    };

    // One stable handler per column, so the memoized items only re-render when their own props change.
    const itemClickHandlers = useMemo(
        () =>
            Object.fromEntries(
                Object.values(TIME_PARTS).map((part) => [
                    part,
                    (value: string, event: MouseEvent<HTMLButtonElement>) => {
                        pickedColumnRef.current = part;
                        onSelectRef.current?.(part, value, event);
                    }
                ])
            ) as Record<keyof TimeParts, ItemClickHandler>,
        []
    );

    const getEnabledEntries = (part: keyof TimeParts): PickerColumnEntry[] =>
        columnsRef.current.find((column) => column.part === part)?.entries.filter((entry) => !entry.disabled) ?? [];

    const focusColumnItem = (part: keyof TimeParts, index: number) => {
        const entries = getEnabledEntries(part);
        const entry = entries[Math.max(0, Math.min(index, entries.length - 1))];

        if (entry) getItem(part, entry.value)?.focus();
    };

    const focusSelectedInColumn = (part?: keyof TimeParts) => {
        if (!part) return;

        focusColumnItem(
            part,
            getEnabledEntries(part).findIndex((entry) => entry.selected)
        );
    };

    /**
     * Centers the selected value of the given columns.
     */
    const scrollColumnsToSelection = (targets: (keyof TimeParts)[]) => {
        if (!wrapperRef.current) return;

        setScrollbarsHidden(true);

        targets.forEach((part) => {
            const selectedEntry = columnsRef.current
                .find((column) => column.part === part)
                ?.entries.find((entry) => entry.selected);
            const selected = selectedEntry && getItem(part, selectedEntry.value);
            const scroller = scrollbarRefs.current[part]?.scrollbarRef?.scrollerElement;

            if (!selected || !scroller || scroller.scrollHeight <= scroller.clientHeight) return;

            const selectedRect = selected.getBoundingClientRect();
            const scrollerRect = scroller.getBoundingClientRect();
            const centered = selectedRect.top - scrollerRect.top - (scroller.clientHeight - selectedRect.height) / 2;

            scroller.scrollTo({ top: Math.max(0, scroller.scrollTop + centered) });
        });
    };

    const applyPendingColumnEffects = () => {
        if (!columnOrder.every((part) => columnRefs.current[part])) return;

        if (pendingScrollRef.current) {
            pendingScrollRef.current = false;
            queueMicrotask(() => scrollColumnsToSelection(columnOrder));
        }

        if (pendingFocusRef.current) {
            pendingFocusRef.current = false;
            queueMicrotask(() => focusSelectedInColumn(columnOrder[0]));
        }
    };

    const registerColumn = (part: keyof TimeParts) => (node: HTMLDivElement | null) => {
        columnRefs.current[part] = node;

        if (node) applyPendingColumnEffects();
    };

    const registerScrollbar = (part: keyof TimeParts) => (instance: ScrollbarRefType | null) => {
        scrollbarRefs.current[part] = instance;
    };

    useEffect(() => {
        pendingScrollRef.current = open === true;
        pendingFocusRef.current = open === true && focusOnOpen === true;

        if (open) applyPendingColumnEffects();
    }, [open, focusOnOpen, columnOrder]);

    useEffect(() => {
        if (!open) {
            previousActiveFieldRef.current = activeField;
            return;
        }

        if (previousActiveFieldRef.current !== activeField) {
            previousActiveFieldRef.current = activeField;
            scrollColumnsToSelection(columnOrder);
        }
    }, [open, activeField, columnOrder]);

    /**
     * Keeps the selection in view while the popover is open: every column whose value changed —
     * typed in, filled with a default around a pick, or set from outside — scrolls to its selected
     * item. The column that was just picked is left alone, its item is already in view.
     */
    useEffect(() => {
        if (!open) {
            previousPartsRef.current = undefined;
            pickedColumnRef.current = null;
            setScrollbarsHidden(false);
            return;
        }

        const previous = previousPartsRef.current;
        const picked = pickedColumnRef.current;

        previousPartsRef.current = parts;
        pickedColumnRef.current = null;

        if (!previous) return;

        const changed = columnOrder.filter(
            (part) => part !== picked && parts?.[part] !== undefined && parts?.[part] !== previous[part]
        );

        if (changed.length) scrollColumnsToSelection(changed);
    }, [open, parts, columnOrder]);

    const handleColumnKeyDown = (part: keyof TimeParts) => (event: KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;

        if (!VERTICAL_KEYS.includes(key) && !HORIZONTAL_KEYS.includes(key) && !EDGE_KEYS.includes(key)) return;

        event.preventDefault();
        revealScrollbars();

        if (HORIZONTAL_KEYS.includes(key)) {
            focusSelectedInColumn(columnOrder[columnOrder.indexOf(part) + (key === KEYS.ARROW_RIGHT ? 1 : -1)]);
            return;
        }

        const entries = getEnabledEntries(part);
        const currentIndex = entries.findIndex((entry) => getItem(part, entry.value) === event.target);

        if (key === KEYS.HOME) focusColumnItem(part, 0);
        else if (key === KEYS.END) focusColumnItem(part, entries.length - 1);
        else focusColumnItem(part, key === KEYS.ARROW_DOWN ? currentIndex + 1 : currentIndex - 1);
    };

    const renderList = (column: PickerColumn, className: string) => (
        <div
            key={column.part}
            ref={registerColumn(column.part)}
            className={className}
            role="listbox"
            tabIndex={-1}
            aria-label={column.ariaLabel}
            onKeyDown={handleColumnKeyDown(column.part)}
        >
            {column.entries.map((entry, index) => (
                <PickerButton
                    key={entry.value}
                    ref={getItemRef(column.part, entry.value)}
                    value={entry.value}
                    tabIndex={index === column.tabStopIndex ? 0 : -1}
                    selected={entry.selected}
                    disabled={entry.disabled}
                    size={size}
                    className={classNames("timePicker__pickerButton", `timePicker__pickerButton_size_${size}`)}
                    onClick={itemClickHandlers[column.part]}
                >
                    {entry.text}
                </PickerButton>
            ))}
        </div>
    );

    return (
        <PickerPopover
            id={id}
            open={open}
            position={position}
            mobileHeightMode={mobileHeightMode}
            popoverRef={popoverRef}
            setProps={setProps}
            onClose={onClose}
            onFocusOut={onFocusOut}
            onTabOut={onTabOut}
        >
            <div
                ref={wrapperRef}
                role="presentation"
                className={classNames("timePicker__wrapper", `timePicker__wrapper_size_${size}`, {
                    timePicker__wrapper_mobile: isMobile,
                    timePicker__wrapper_scrollbarsHidden: scrollbarsHidden
                })}
                onWheel={revealScrollbars}
                onTouchMove={revealScrollbars}
            >
                {columns.map((column) =>
                    column.part === TIME_PARTS.MERIDIEM ? (
                        renderList(column, "timePicker__column timePicker__column_meridiem")
                    ) : (
                        <div key={column.part} className="timePicker__column">
                            <ColumnHeader text={column.header} size={size} />
                            <div className="timePicker__body">
                                <Scrollbar ref={registerScrollbar(column.part)}>
                                    {renderList(column, "timePicker__list")}
                                </Scrollbar>
                            </div>
                        </div>
                    )
                )}
            </div>
        </PickerPopover>
    );
};

export default TimePickerPopover;
