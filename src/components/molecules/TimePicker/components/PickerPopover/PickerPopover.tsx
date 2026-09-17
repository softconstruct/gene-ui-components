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
import { IPopoverProps, IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import Tooltip from "@components/molecules/Tooltip";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Constants & Helpers
import { headerTextVariantMap, KEYS, TIME_COLUMNS_ORDER, TIME_PARTS } from "../../constants";
import { getTimePartValues, isPickerPartDisabled, resolveLocalization } from "../../helpers";
// Types
import { TimeParts, TimePickerLocalization, TimePickerRangeFields, TimePickerSizes } from "../../types";
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
     * Callback invoked on `Tab` while the focus is inside the popover, before the browser moves it,
     * so the owner can hand the focus back to the field and let `Tab` continue from there.
     */
    onTabOut?: () => void;
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
}

const VERTICAL_KEYS: string[] = [KEYS.ARROW_UP, KEYS.ARROW_DOWN];
const HORIZONTAL_KEYS: string[] = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT];
const EDGE_KEYS: string[] = [KEYS.HOME, KEYS.END];

/**
 * Presses inside the popover must not move the focus away from the input: the field keeps the caret
 * while values are picked with the mouse, and `Tab` continues from the field afterwards.
 */
const keepReferenceFocus = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
};

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

const getScrollableAncestor = (element: HTMLElement, boundary: HTMLElement | null): HTMLElement | null => {
    let node: HTMLElement | null = element.parentElement;

    while (node) {
        const { overflowY } = getComputedStyle(node);

        if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) return node;
        if (node === boundary) return null;

        node = node.parentElement;
    }

    return null;
};

const hasAnyValue = (parts: TimeParts | undefined): boolean =>
    !!parts && Object.values(parts).some((value) => value !== undefined);

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

const PickerPopover: FC<IPickerPopoverProps> = ({
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
    const pendingScrollRef = useRef(false);
    const pendingFocusRef = useRef(false);
    const pickedColumnRef = useRef<keyof TimeParts | null>(null);
    const previousPartsRef = useRef<TimeParts | undefined>(undefined);
    const previousActiveFieldRef = useRef(activeField);

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

    const getEnabledButtons = (part: keyof TimeParts): HTMLButtonElement[] =>
        Array.from(columnRefs.current[part]?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []);

    const focusColumnItem = (part: keyof TimeParts, index: number) => {
        const buttons = getEnabledButtons(part);

        buttons[Math.max(0, Math.min(index, buttons.length - 1))]?.focus();
    };

    const focusSelectedInColumn = (part?: keyof TimeParts) => {
        if (!part) return;

        const buttons = getEnabledButtons(part);

        focusColumnItem(
            part,
            buttons.findIndex((button) => button.getAttribute("aria-selected") === "true")
        );
    };

    /**
     * Centers the selected value of the given columns.
     */
    const scrollColumnsToSelection = (targets: (keyof TimeParts)[]) => {
        if (!wrapperRef.current) return;

        setScrollbarsHidden(true);

        targets.forEach((part) => {
            const selected = columnRefs.current[part]?.querySelector<HTMLElement>('[aria-selected="true"]');
            const scroller = selected && getScrollableAncestor(selected, wrapperRef.current);

            if (!selected || !scroller) return;

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

    useEffect(() => {
        if (!open) {
            previousPartsRef.current = undefined;
            pickedColumnRef.current = null;
            setScrollbarsHidden(false);
            return;
        }

        const previous = previousPartsRef.current;
        previousPartsRef.current = parts;

        if (!previous || hasAnyValue(previous) || !hasAnyValue(parts)) return;

        scrollColumnsToSelection(
            columnOrder.filter(
                (part) =>
                    part !== pickedColumnRef.current && previous[part] === undefined && parts?.[part] !== undefined
            )
        );
    }, [open, parts, columnOrder]);

    const handleWrapperKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === KEYS.TAB) onTabOut?.();
    };

    const handleColumnClick = (part: keyof TimeParts) => (event: MouseEvent<HTMLDivElement>) => {
        const button = (event.target as HTMLElement).closest("button");

        if (!button || button.disabled || !button.dataset.value) return;

        pickedColumnRef.current = part;
        onSelect?.(part, button.dataset.value);
    };

    const handleColumnKeyDown = (part: keyof TimeParts) => (event: KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;

        if (!VERTICAL_KEYS.includes(key) && !HORIZONTAL_KEYS.includes(key) && !EDGE_KEYS.includes(key)) return;

        event.preventDefault();
        revealScrollbars();

        if (HORIZONTAL_KEYS.includes(key)) {
            focusSelectedInColumn(columnOrder[columnOrder.indexOf(part) + (key === KEYS.ARROW_RIGHT ? 1 : -1)]);
            return;
        }

        const buttons = getEnabledButtons(part);
        const currentIndex = buttons.indexOf(event.target as HTMLButtonElement);

        if (key === KEYS.HOME) focusColumnItem(part, 0);
        else if (key === KEYS.END) focusColumnItem(part, buttons.length - 1);
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
            onClick={handleColumnClick(column.part)}
            onKeyDown={handleColumnKeyDown(column.part)}
        >
            {column.entries.map((entry, index) => (
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
            ))}
        </div>
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
                            timePicker__wrapper_mobile: isMobile,
                            timePicker__wrapper_scrollbarsHidden: scrollbarsHidden
                        })}
                        onBlur={onFocusOut}
                        onKeyDown={handleWrapperKeyDown}
                        onMouseDown={keepReferenceFocus}
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
                                        <Scrollbar>{renderList(column, "timePicker__list")}</Scrollbar>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </PopoverBody>
        </Popover>
    );
};

export default PickerPopover;
