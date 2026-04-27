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
    DEFAULT_CLEAR_ALL_LABEL,
    DEFAULT_CLEAR_LABEL,
    DEFAULT_EMPTY_TEXT,
    DEFAULT_LOADING_TEXT,
    DEFAULT_SEARCH_PLACEHOLDER,
    DEFAULT_SELECT_ALL_LABEL
} from "./constants";
// Internal components
import DropdownItem from "./DropdownItem/DropdownItem";
// Types
import { DropdownStatus, DropdownVariant, IDropdownFooterActions, IDropdownOption } from "./types";

const MEASURE_SAFETY_OFFSET = 24;
const FALLBACK_VISIBLE_ITEMS = 2;

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
    className?: string;
    options: IDropdownOption[];
    variant?: DropdownVariant;
    size?: "large" | "medium" | "small";
    status?: DropdownStatus;
    value?: string | null;
    defaultValue?: string | null;
    values?: string[];
    defaultValues?: string[];
    placeholder?: string;
    label?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    searchable?: boolean;
    searchAutoFocus?: boolean;
    searchPlaceholder?: string;
    searchDebounceMs?: number;
    searchValue?: string;
    loading?: boolean;
    loadingText?: string;
    emptyText?: string;
    selectAllLabel?: string;
    clearLabel?: string;
    clearAllLabel?: string;
    footerActions?: IDropdownFooterActions;
    filterFn?: (option: IDropdownOption, searchTerm: string) => boolean;
    onSearchChange?: (value: string) => void;
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
    helperText,
    required,
    disabled,
    readOnly,
    searchable,
    searchAutoFocus = true,
    searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
    searchDebounceMs = 300,
    searchValue,
    loading,
    loadingText = DEFAULT_LOADING_TEXT,
    emptyText = DEFAULT_EMPTY_TEXT,
    selectAllLabel = DEFAULT_SELECT_ALL_LABEL,
    clearLabel = DEFAULT_CLEAR_LABEL,
    clearAllLabel = DEFAULT_CLEAR_ALL_LABEL,
    footerActions,
    filterFn,
    onSearchChange,
    onChange
}) => {
    const isMulti = variant === "multi";
    const isExternallyControlledSearch = searchValue !== undefined;
    const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
    const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [popoverProps, setPopoverProps] = useState<Record<string, unknown>>({});
    const [internalSearchValue, setInternalSearchValue] = useState<string>(searchValue || "");
    const triggerTextFieldRef = useRef<ITextFieldRef | null>(null);
    const [triggerInputWidth, setTriggerInputWidth] = useState(0);
    const { width: windowWidth } = useWindowSize();

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null } as MutableRefObject<ReferenceType | null>,
        referenceElement: { current: null } as MutableRefObject<ReferenceType | null>
    });

    useEffect(() => {
        if (isExternallyControlledSearch) {
            setInternalSearchValue(searchValue || "");
        }
    }, [searchValue, isExternallyControlledSearch]);

    const selectedSingleValue = value !== undefined ? value : internalValue;
    const selectedMultipleValues = values !== undefined ? values : internalValues;
    const searchTerm = isExternallyControlledSearch ? searchValue || "" : internalSearchValue;

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

    const emitSearch = (nextValue: string) => {
        if (onSearchChange) {
            onSearchChange(nextValue);
        }
        if (!isExternallyControlledSearch) {
            setInternalSearchValue(nextValue);
        }
    };

    const { debouncedCallback: onSearchDebounced } = useDebounce((...args: unknown[]) => {
        const [nextValue] = args as [string];
        emitSearch(nextValue);
    }, searchDebounceMs);

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
        if (!searchable || onSearchChange) {
            return options;
        }
        const normalizedTerm = searchTerm.trim().toLowerCase();
        if (!normalizedTerm.length) return options;

        return options.filter((option) => {
            if (filterFn) {
                return filterFn(option, normalizedTerm);
            }
            const optionLabel = option.label.toLowerCase();
            const valueSnapshot = option.value.toLowerCase();
            return optionLabel.includes(normalizedTerm) || valueSnapshot.includes(normalizedTerm);
        });
    }, [options, filterFn, searchable, searchTerm, onSearchChange]);

    const toggleOpen = () => {
        if (disabled || readOnly) return;
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

    const clearSearchHandler = () => {
        emitSearch("");
    };

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
                status={status}
                required={required}
                label={label}
                helperText={helperText}
                value={selectedView.visibleText}
                suffixText={selectedView.suffixText}
                placeholder={placeholder}
                IconAfter={CaretDownFilled}
                popoverProps={triggerPopoverProps}
            />

            <Popover
                setProps={setPopoverProps}
                ref={popoverRef}
                open={isOpen}
                position="bottom-left"
                withArrow={false}
                fitReference
            >
                <PopoverBody withPadding={false} withScrollbar={false} className="dropdown__body">
                    <div className="dropdown__content">
                        {searchable && (
                            <div className="dropdown__search">
                                <TextField
                                    value={searchTerm}
                                    onChange={(event) => {
                                        const nextValue = event.target.value;
                                        setInternalSearchValue(nextValue);
                                        onSearchDebounced(nextValue);
                                    }}
                                    onClear={clearSearchHandler}
                                    clearable
                                    inputMode="search"
                                    autoFocus={searchAutoFocus}
                                    placeholder={searchPlaceholder}
                                    IconBefore={Magnifier}
                                    size={size}
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
                                    <Scrollbar className="dropdown__scrollbar">
                                        <div role="listbox" aria-multiselectable={isMulti} className="dropdown__list">
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
                                ) : (
                                    <div className="dropdown__empty">
                                        <Empty title={emptyText} size="small" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {(footerActions || (isMulti && !!selectedMultipleValues.length)) && (
                        <div className="dropdown__footer">
                            {isMulti && (
                                <Button
                                    appearance="secondary"
                                    layout="text"
                                    size="small"
                                    onClick={clearAllHandler}
                                    disabled={!selectedMultipleValues.length || loading}
                                >
                                    {clearAllLabel}
                                </Button>
                            )}
                            <div className="dropdown__footerActions">
                                {footerActions?.secondary && (
                                    <Button
                                        appearance="secondary"
                                        layout="text"
                                        size="small"
                                        onClick={footerActions.secondary.onClick}
                                        disabled={footerActions.secondary.disabled}
                                        aria-label={footerActions.secondary["aria-label"]}
                                    >
                                        {footerActions.secondary.text}
                                    </Button>
                                )}
                                {footerActions?.primary && (
                                    <Button
                                        appearance="primary"
                                        size="small"
                                        onClick={footerActions.primary.onClick}
                                        disabled={footerActions.primary.disabled}
                                        aria-label={footerActions.primary["aria-label"]}
                                    >
                                        {footerActions.primary.text}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { IDropdownProps, Dropdown as default };
