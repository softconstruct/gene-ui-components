import React, {
    ChangeEvent,
    FC,
    KeyboardEvent,
    MouseEvent,
    MutableRefObject,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { ReferenceType } from "@floating-ui/react";
import classNames from "classnames";

import { CaretDownFilled, Magnifier } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Loader from "@components/atoms/Loader";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";
import Empty from "@components/molecules/Empty";
import TextField from "@components/molecules/TextField";
import { ITextFieldRef } from "@components/molecules/TextField/TextField";

// Hooks
import { useClickOutside, useDebounce, useWindowSize } from "@hooks/index";

// Styles
import "./Dropdown.scss";

// Constants
import {
    DEFAULT_CLEAR_LABEL,
    DEFAULT_EMPTY_TEXT,
    DEFAULT_LOADING_TEXT,
    DEFAULT_SEARCH_PLACEHOLDER,
    DEFAULT_SELECT_ALL_LABEL,
    FALLBACK_VISIBLE_ITEMS,
    MEASURE_SAFETY_OFFSET
} from "./constants";
// Internal components
import DropdownItem from "./DropdownItem/DropdownItem";
// Types
import { DropdownStatus, DropdownVariant, IDropdownFooterActions, IDropdownOption } from "./types";

const getTextWidth = (text: string, font: string): number => {
    if (typeof document === "undefined") return text.length * 8;
    const context = document.createElement("canvas").getContext("2d");
    if (!context) return text.length * 8;
    context.font = font;
    return context.measureText(text).width;
};

const getInputFont = (inputNode: HTMLInputElement): string => {
    return getComputedStyle(inputNode).font || "400 14px Arial";
};

const getFallbackCompactText = (selectedLabels: string[]): { visibleText: string; suffixText: string } => {
    if (selectedLabels.length <= FALLBACK_VISIBLE_ITEMS) {
        return { visibleText: selectedLabels.join(", "), suffixText: "" };
    }

    const visibleText = selectedLabels.slice(0, FALLBACK_VISIBLE_ITEMS).join(", ");
    const remainingCount = selectedLabels.length - FALLBACK_VISIBLE_ITEMS;
    return { visibleText, suffixText: `+${remainingCount}...` };
};

const getCompactSelectedView = (
    selectedLabels: string[],
    triggerInputWidth: number,
    inputNode: HTMLInputElement | null
): { visibleText: string; suffixText: string } => {
    if (selectedLabels.length <= 1) return { visibleText: selectedLabels.join(", "), suffixText: "" };
    if (!inputNode || !triggerInputWidth) return getFallbackCompactText(selectedLabels);

    const inputFont = getInputFont(inputNode);
    const availableWidth = Math.max(triggerInputWidth - MEASURE_SAFETY_OFFSET, 0);
    const fullText = selectedLabels.join(", ");

    if (getTextWidth(fullText, inputFont) <= availableWidth) {
        return { visibleText: fullText, suffixText: "" };
    }

    for (let visibleItems = selectedLabels.length - 1; visibleItems > 0; visibleItems--) {
        const remainingCount = selectedLabels.length - visibleItems;
        const visibleText = selectedLabels.slice(0, visibleItems).join(", ");
        const suffixText = `+${remainingCount}...`;
        const requiredWidth = getTextWidth(visibleText, inputFont) + getTextWidth(suffixText, inputFont);

        if (requiredWidth <= availableWidth) {
            return { visibleText, suffixText };
        }
    }

    // Always keep at least one selected item visible and keep the count suffix.
    // The input text will truncate if needed.
    return { visibleText: selectedLabels[0], suffixText: `+${selectedLabels.length - 1}...` };
};

interface IDropdownProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * List of available options.
     * Each option defines value, label, and optional visual metadata.
     */
    options: IDropdownOption[];
    /**
     * Selection mode of the dropdown.
     * Possible values: `single | multi`
     * @default "single"
     */
    variant?: DropdownVariant;
    /**
     * Dropdown size.
     * Possible values: `large | medium | small`
     * @default "medium"
     */
    size?: "large" | "medium" | "small";
    /**
     * Visual status of the trigger field.
     * Possible values: `rest | warning | error`
     * @default "rest"
     */
    status?: DropdownStatus;
    /**
     * Controlled selected value for `single` variant.
     */
    value?: string | null;
    /**
     * Initial selected value for `single` variant in uncontrolled mode.
     */
    defaultValue?: string | null;
    /**
     * Controlled selected values for `multi` variant.
     */
    values?: string[];
    /**
     * Initial selected values for `multi` variant in uncontrolled mode.
     */
    defaultValues?: string[];
    /**
     * Placeholder shown when nothing is selected.
     */
    placeholder?: string;
    /**
     * Label shown above the dropdown trigger.
     */
    label?: string;
    /**
     * Additional descriptive text shown in an info tooltip icon near the label.
     */
    infoText?: string;
    /**
     * Helper text displayed below the dropdown trigger.
     */
    helperText?: string;
    /**
     * Marks the dropdown as required.
     */
    required?: boolean;
    /**
     * Disables all dropdown interactions.
     */
    disabled?: boolean;
    /**
     * Makes dropdown non-editable and non-selectable while keeping it visible.
     */
    readOnly?: boolean;
    /**
     * Enables search input inside the dropdown panel.
     */
    searchable?: boolean;
    /**
     * Automatically focuses search input when dropdown opens.
     * @default true
     */
    searchAutoFocus?: boolean;
    /**
     * Placeholder text for search input.
     * @default "Search"
     */
    searchPlaceholder?: string;
    /**
     * Controlled search value. When defined, the input mirrors this value.
     * Pair with `onSearchChange` to react to user input.
     */
    searchValue?: string;
    /**
     * Initial search value in uncontrolled mode.
     * Ignored when `searchValue` is provided.
     */
    defaultSearchValue?: string;
    /**
     * Clears the search value when the popover closes.
     * In controlled mode only `onSearchChange("")` is emitted - the parent owns the actual reset.
     * @default false
     */
    resetSearchOnClose?: boolean;
    /**
     * Displays loading state in dropdown panel.
     */
    loading?: boolean;
    /**
     * Text shown with loader in loading state.
     * @default "Loading"
     */
    loadingText?: string;
    /**
     * Text shown when there are no options to render.
     * @default "No data"
     */
    emptyText?: string;
    /**
     * Label for the `Select all` checkbox in multi mode.
     * @default "Select All"
     */
    selectAllLabel?: string;
    /**
     * Label for inline clear action in multi mode.
     * @default "Clear"
     */
    clearLabel?: string;
    /**
     * Footer action buttons displayed in dropdown footer.
     * `primary` action is required, `secondary` is optional.
     * Button appearances are derived internally:
     * - `primary`: `primary` for `rest/warning`, `danger` for `error`
     * - `secondary`: always `secondary`
     */
    actions?: IDropdownFooterActions;
    /**
     * Controls how options are filtered.
     * - `undefined` (default): built-in internal filter matches the search term against `label` and `value`.
     * - `function`: custom internal filter; receives the option and the normalized lowercased search term.
     * - `false`: disables internal filtering. The parent must supply pre-filtered `options` (typical for async/external search). `onSearchChange` is then the place to fetch results.
     */
    filterFn?: false | ((option: IDropdownOption, searchTerm: string) => boolean);
    /**
     * Callback fired when the search value changes.
     * Always fires regardless of `filterFn` value, so it can be used safely for analytics,
     * form integrations, or async fetching. Subject to the built-in 200ms debounce.
     */
    onSearchChange?: (value: string) => void;
    /**
     * Callback fired when selection changes.
     * Returns selected option (single), selected options (multi), or null.
     */
    onChange?: (value: IDropdownOption | IDropdownOption[] | null) => void;
}

const Dropdown: FC<IDropdownProps> = ({
    className,
    options,
    variant = "single",
    size = "medium",
    status = "rest",
    value,
    defaultValue = null,
    values,
    defaultValues = [],
    placeholder,
    label,
    infoText,
    helperText,
    required,
    disabled,
    readOnly,
    searchable,
    searchAutoFocus = true,
    searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
    searchValue,
    defaultSearchValue,
    resetSearchOnClose = false,
    loading,
    loadingText = DEFAULT_LOADING_TEXT,
    emptyText = DEFAULT_EMPTY_TEXT,
    selectAllLabel = DEFAULT_SELECT_ALL_LABEL,
    clearLabel = DEFAULT_CLEAR_LABEL,
    actions,
    filterFn,
    onSearchChange,
    onChange
}) => {
    const isMulti = variant === "multi";
    const isControlledSearch = searchValue !== undefined;
    const isExternalSearch = filterFn === false;
    const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
    const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [popoverProps, setPopoverProps] = useState<Record<string, unknown>>({});
    const [internalSearchValue, setInternalSearchValue] = useState<string>(searchValue ?? defaultSearchValue ?? "");
    const triggerTextFieldRef = useRef<ITextFieldRef | null>(null);
    const [triggerInputWidth, setTriggerInputWidth] = useState(0);
    const { width: windowWidth } = useWindowSize();

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null } as MutableRefObject<ReferenceType | null>,
        referenceElement: { current: null } as MutableRefObject<ReferenceType | null>
    });

    useEffect(() => {
        if (isControlledSearch) {
            setInternalSearchValue(searchValue || "");
        }
    }, [searchValue, isControlledSearch]);

    const selectedSingleValue = value !== undefined ? value : internalValue;
    const selectedMultipleValues = values !== undefined ? values : internalValues;
    const searchTerm = isControlledSearch ? searchValue || "" : internalSearchValue;

    useEffect(() => {
        const inputNode = triggerTextFieldRef.current?.getInputRef();
        if (!inputNode) return;
        setTriggerInputWidth(inputNode.clientWidth);
    }, [windowWidth, selectedSingleValue, selectedMultipleValues, size, helperText, label]);

    useClickOutside(
        (event) => {
            const onReferenceClick =
                event.target instanceof Node &&
                popoverRef.current.referenceElement?.current instanceof Node &&
                popoverRef.current.referenceElement.current.contains(event.target as Node);

            if (!onReferenceClick && isOpen) {
                setIsOpen(false);
            }
        },
        [popoverRef.current.floatingElement]
    );

    const emitSearchRaw = (nextValue: string) => {
        onSearchChange?.(nextValue);
    };

    const { debouncedCallback: emitSearchDebounced, clearDebounce } = useDebounce(
        (...args: unknown[]) => emitSearchRaw(args[0] as string),
        200
    );

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        if (!isControlledSearch) setInternalSearchValue(nextValue);
        emitSearchDebounced(nextValue);
    };

    const clearSearchHandler = () => {
        clearDebounce();
        if (!isControlledSearch) setInternalSearchValue("");
        onSearchChange?.("");
    };

    const selectedSingleOption = useMemo(
        () => options.find((option) => option.value === selectedSingleValue) || null,
        [options, selectedSingleValue]
    );
    const selectedMultiOptions = useMemo(
        () => options.filter((option) => selectedMultipleValues.includes(option.value)),
        [options, selectedMultipleValues]
    );

    const selectedView = useMemo(() => {
        if (isMulti) {
            const selectedLabels = selectedMultiOptions.map((option) => option.label);
            const inputNode = triggerTextFieldRef.current?.getInputRef() || null;
            return getCompactSelectedView(selectedLabels, triggerInputWidth, inputNode);
        }

        return { visibleText: selectedSingleOption?.label || "", suffixText: "" };
    }, [isMulti, selectedMultiOptions, selectedSingleOption, triggerInputWidth]);

    const filteredOptions = useMemo(() => {
        if (!searchable || isExternalSearch) {
            return options;
        }
        const normalizedTerm = searchTerm.trim().toLowerCase();
        if (!normalizedTerm.length) {
            return options;
        }

        return options.filter((option) => {
            if (typeof filterFn === "function") {
                return filterFn(option, normalizedTerm);
            }
            const optionLabel = option.label.toLowerCase();
            const valueSnapshot = option.value.toLowerCase();
            return optionLabel.includes(normalizedTerm) || valueSnapshot.includes(normalizedTerm);
        });
    }, [options, filterFn, searchable, searchTerm, isExternalSearch]);

    const toggleOpen = () => {
        if (disabled) return;
        setIsOpen((prev) => !prev);
    };

    const triggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleOpen();
        }
    };

    const setSingleValue = (nextValue: string | null) => {
        if (value === undefined) {
            setInternalValue(nextValue);
        }
        const selectedOption = options.find((option) => option.value === nextValue) || null;
        onChange?.(selectedOption);
    };

    const setMultiValue = (nextValues: string[]) => {
        if (values === undefined) {
            setInternalValues(nextValues);
        }
        const selectedOptions = options.filter((option) => nextValues.includes(option.value));
        onChange?.(selectedOptions);
    };

    const optionSelectHandler = (option: IDropdownOption) => {
        if (disabled || readOnly || option.disabled) return;

        if (isMulti) {
            const isSelected = selectedMultipleValues.includes(option.value);
            const nextValues = isSelected
                ? selectedMultipleValues.filter((currentValue) => currentValue !== option.value)
                : [...selectedMultipleValues, option.value];
            setMultiValue(nextValues);
            return;
        }

        setSingleValue(option.value);
        setIsOpen(false);
    };

    const selectAllHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.checked) {
            setMultiValue([]);
            return;
        }

        const enabledValues = filteredOptions.filter((option) => !option.disabled).map((option) => option.value);
        setMultiValue(enabledValues);
    };

    const clearAllHandler = (event?: MouseEvent<HTMLButtonElement>) => {
        event?.stopPropagation();
        if (isMulti) {
            setMultiValue([]);
            return;
        }
        setSingleValue(null);
    };

    useEffect(() => {
        if (isOpen || !resetSearchOnClose) return;
        clearDebounce();
        if (!isControlledSearch) setInternalSearchValue("");
        onSearchChange?.("");
        // onSearchChange/clearDebounce are stable from useDebounce/parent; intentionally narrow deps to popover state and the toggle.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, resetSearchOnClose]);

    const selectAllChecked =
        !!filteredOptions.length &&
        filteredOptions.every((option) => option.disabled || selectedMultipleValues.includes(option.value));

    const triggerPopoverProps = {
        ...popoverProps,
        role: "button",
        tabIndex: disabled ? -1 : 0,
        onClick: toggleOpen,
        onKeyDown: triggerKeyDown
    };

    return (
        <div className={classNames("dropdown", className)}>
            <TextField
                ref={triggerTextFieldRef}
                className="dropdown__trigger"
                size={size}
                disabled={disabled}
                readOnly={readOnly}
                status={status}
                required={required}
                label={label}
                infoText={infoText}
                helperText={helperText}
                value={selectedView.visibleText}
                suffixText={selectedView.suffixText}
                placeholder={placeholder}
                IconAfter={CaretDownFilled}
                popoverProps={triggerPopoverProps}
                autoComplete="off"
            />

            <Popover
                setProps={setPopoverProps}
                ref={popoverRef}
                open={isOpen}
                position="bottom-left"
                withArrow={false}
                fitReference
                mobileHeightMode="fit"
            >
                <PopoverBody withPadding={false} withScrollbar={false} className="dropdown__body">
                    <div className="dropdown__content">
                        {searchable && (
                            <div className="dropdown__search">
                                <TextField
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onClear={clearSearchHandler}
                                    clearable
                                    inputMode="search"
                                    autoFocus={searchAutoFocus}
                                    placeholder={searchPlaceholder}
                                    IconBefore={Magnifier}
                                    size={size}
                                    autoComplete="on"
                                />
                            </div>
                        )}

                        {isMulti && (
                            <div className="dropdown__actions">
                                <Checkbox
                                    label={selectAllLabel}
                                    checked={selectAllChecked}
                                    onChange={selectAllHandler}
                                    disabled={!filteredOptions.length || loading || disabled || readOnly}
                                />
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    onClick={clearAllHandler}
                                    disabled={!selectedMultipleValues.length || loading || disabled || readOnly}
                                >
                                    {clearLabel}
                                </Button>
                            </div>
                        )}

                        {loading ? (
                            <div className="dropdown__loading">
                                <Loader text={loadingText} textPosition="below" />
                            </div>
                        ) : (
                            <>
                                {filteredOptions.length ? (
                                    <>
                                        <Scrollbar className="dropdown__scrollbar">
                                            <div
                                                role="listbox"
                                                aria-multiselectable={isMulti}
                                                className="dropdown__list"
                                            >
                                                {filteredOptions.map((option) => (
                                                    <DropdownItem
                                                        key={option.id}
                                                        label={option.label}
                                                        variant={variant}
                                                        selected={
                                                            isMulti
                                                                ? selectedMultipleValues.includes(option.value)
                                                                : option.value === selectedSingleValue
                                                        }
                                                        disabled={disabled || readOnly || option.disabled}
                                                        Icon={option.Icon}
                                                        infoText={option.infoText}
                                                        textAfter={option.textAfter}
                                                        size={size}
                                                        onClick={() => optionSelectHandler(option)}
                                                    />
                                                ))}
                                            </div>
                                        </Scrollbar>
                                        {!!actions && (
                                            <div className="dropdown__footer">
                                                <ButtonGroup className="dropdown__footerActions" size="small">
                                                    {actions?.secondary && (
                                                        <Button
                                                            appearance="secondary"
                                                            layout="text"
                                                            size={size}
                                                            onClick={actions.secondary.onClick}
                                                            disabled={actions.secondary.disabled}
                                                            aria-label={actions.secondary["aria-label"]}
                                                        >
                                                            {actions.secondary.text}
                                                        </Button>
                                                    )}
                                                    {actions?.primary && (
                                                        <Button
                                                            appearance={status === "error" ? "danger" : "primary"}
                                                            size={size}
                                                            onClick={actions.primary.onClick}
                                                            disabled={actions.primary.disabled}
                                                            aria-label={actions.primary["aria-label"]}
                                                        >
                                                            {actions.primary.text}
                                                        </Button>
                                                    )}
                                                </ButtonGroup>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="dropdown__empty">
                                        <Empty title={emptyText} size="small" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { IDropdownProps, Dropdown as default };
