import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";

import Button from "@components/atoms/Button";
import Label from "@components/atoms/Label";
// Components
import { Popover, PopoverBody, PopoverFooter, PopoverFooterActions } from "@components/atoms/Popover";
import Checkbox from "@components/molecules/Checkbox";

interface ISelectFilter {
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    filterOptions?: string[];
    filteredValues?: string[];
    isSelectFilterOpen?: boolean;
    onApplyFilter?: (values: string[]) => void;
    onClose?: () => void;
    headerText?: string;
    selectAllText: string;
    searchPlaceholder?: string;
}

const SelectFilter: FC<ISelectFilter> = ({
    setProps,
    filterOptions = [],
    filteredValues = [],
    isSelectFilterOpen = false,
    onApplyFilter,
    onClose,
    headerText,
    selectAllText,
    searchPlaceholder = "Search"
}) => {
    const [pendingSelected, setPendingSelected] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (isSelectFilterOpen) {
            setPendingSelected([...filteredValues]);
            setSearchValue("");
        }
    }, [isSelectFilterOpen, filteredValues]);

    const visibleOptions = useMemo(() => {
        if (!searchValue.trim()) return filterOptions;
        const q = searchValue.trim().toLowerCase();
        return filterOptions.filter((opt) => String(opt).toLowerCase().includes(q));
    }, [filterOptions, searchValue]);

    const handleToggleOption = (option: string) => {
        setPendingSelected((prev) => (prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]));
    };

    const handleSelectAll = () => {
        const allSelected = filterOptions.length > 0 && pendingSelected.length === filterOptions.length;
        setPendingSelected(allSelected ? [] : [...filterOptions]);
    };

    const handleClear = () => setPendingSelected([]);

    const handleSave = () => {
        onApplyFilter?.(pendingSelected);
        onClose?.();
    };

    const handleCancel = () => onClose?.();

    const isAllSelected = filterOptions.length > 0 && pendingSelected.length === filterOptions.length;

    return (
        <Popover setProps={setProps} open={isSelectFilterOpen}>
            <PopoverBody withPadding={false}>
                <div
                    className="filterDropdownMenu"
                    role="dialog"
                    aria-label={headerText ? `Filter by ${headerText}` : "Filter options"}
                >
                    <div className="filterDropdownMenu__header">
                        <input
                            type="search"
                            className="filterDropdownMenu__search"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                        />

                        <div className="filterDropdownMenu__headerSelect">
                            <div className="filterDropdownMenu__headerSelect_item">
                                <div className="filterDropdownMenu__headerSelect_placeholder">
                                    <Label
                                        text={selectAllText}
                                        className="filterDropdownMenu__headerSelect_text ellipsis-text"
                                    >
                                        <Checkbox
                                            className="filterDropdownMenu__headerSelect_checkbox"
                                            name="item"
                                            value={selectAllText}
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </Label>
                                    <p className="filterDropdownMenu__headerSelect_text ellipsis-text" aria-hidden />
                                </div>
                            </div>
                            <Button
                                appearance="secondary"
                                layout="text"
                                size="small"
                                disabled={pendingSelected.length === 0}
                                onClick={handleClear}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>

                    <div className="filterDropdownMenu__main">
                        <div className="filterDropdownMenu__columns">
                            {visibleOptions.map((option) => (
                                <div key={option} className="filterDropdownMenu__columns_item">
                                    <div className="filterDropdownMenu__columns_placeholder">
                                        <Label className="filterDropdownMenu__columns_placeholder" text={option}>
                                            <Checkbox
                                                className="filterDropdownMenu__columns_checkbox"
                                                name="item"
                                                value={option}
                                                checked={pendingSelected.includes(option)}
                                                onChange={() => handleToggleOption(option)}
                                            />
                                        </Label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverBody>
            <PopoverFooter>
                <PopoverFooterActions>
                    <Button appearance="secondary" layout="fill" size="medium" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button appearance="primary" layout="fill" size="medium" onClick={handleSave}>
                        Save
                    </Button>
                </PopoverFooterActions>
            </PopoverFooter>
        </Popover>
    );
};

export default SelectFilter;
