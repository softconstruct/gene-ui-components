import React, { ChangeEvent, FC, useState } from "react";
import { Column } from "@tanstack/react-table";
import { Header } from "@tanstack/table-core";

import { Globe, Magnifier } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Label from "@components/atoms/Label";
import { Popover, PopoverBody, PopoverFooter, PopoverFooterActions } from "@components/atoms/Popover";
import Checkbox from "@components/molecules/Checkbox";
import Filter from "@components/molecules/Table/Filter";
import { SortingIcons } from "@components/molecules/Table/helpers";
import { RowData, TableCol } from "@components/molecules/Table/type";

interface IColActionsProps {
    header: Header<RowData, unknown>;
}

const getFilterOption = (column: Column<RowData, unknown>): string[] => {
    const colDef = column.columnDef as TableCol<RowData>;
    colDef.filterFn = colDef.enablePopoverFilter ? "arrIncludesSome" : "auto";
    const initialFilteredOptions = (column.columnDef as TableCol<RowData>).filterOptions;
    if (initialFilteredOptions?.length) {
        return initialFilteredOptions;
    }
    const { flatRows } = column.getFacetedRowModel();
    return [...new Set(flatRows.map((row) => row.getValue(column.id) as string).filter((item) => Boolean(item)))];
};

export const ColActions: FC<IColActionsProps> = ({ header }) => {
    const [currentSearchInput, setCurrentSearchInput] = useState<string | null>(null);
    const [popoverPropsForContent, setPopoverPropsForContent] = useState({});
    const [filteredValues, setFilteredValues] = useState<string[]>([]);
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState<boolean>(false);

    const handleFilterFromPopover = (column: Column<RowData, unknown>) => {
        column.setFilterValue(filteredValues);
        setIsFilterPopoverOpen(false);
    };

    const handleFilteredValueChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setFilteredValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
    };

    const handleSelectAll = () => {
        const { column } = header;
        const { flatRows } = column.getFacetedRowModel();

        if (flatRows.length === filteredValues.length) {
            setFilteredValues([]);
            return;
        }

        const values = flatRows.map((row) => row.getValue(column.id) as string).filter((item) => Boolean(item));
        setFilteredValues(values);
    };

    const handleClearSelectedValues = () => {
        setFilteredValues([]);
    };

    return (
        <div className="table__th_actions">
            {header.column.getCanSort() && (
                <Button
                    appearance="secondary"
                    layout="text"
                    size="small"
                    disabled={(header.column.columnDef as TableCol<unknown>)?.isSortingDisabled}
                    Icon={SortingIcons[`${header.column.getIsSorted()}`]}
                    onClick={(e) => {
                        return (
                            (header.column.columnDef as TableCol<unknown>).enableSorting &&
                            header?.column?.getToggleSortingHandler?.()?.(e)
                        );
                    }}
                />
            )}

            {/* todo: change icon from "Globe" to some "Filter" icon, when it will implemented */}
            {(header.column.columnDef as TableCol<RowData>).enablePopoverFilter && (
                <>
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        Icon={Globe}
                        disabled={(header.column.columnDef as TableCol<RowData>)?.isPopoverFilterDisabled}
                        {...popoverPropsForContent}
                        onClick={() => setIsFilterPopoverOpen(true)}
                    />
                    <Popover setProps={setPopoverPropsForContent} open={isFilterPopoverOpen}>
                        <PopoverBody withPadding={false}>
                            <div className="filterDropdownMenu">
                                <div className="filterDropdownMenu__header">
                                    {/* todo: import "Search Field" component instead of next input element */}
                                    <input type="text" placeholder="Search" style={{ width: "100%" }} />

                                    <div className="filterDropdownMenu__headerSelect">
                                        <div className="filterDropdownMenu__headerSelect_item" role="tab" tabIndex={0}>
                                            <div className="filterDropdownMenu__headerSelect_placeholder">
                                                {/* todo: add 'disabled' attr. for similar state */}
                                                {/* todo: add 'readOnly checked' attr-s. for 'readOnly state */}
                                                <Label
                                                    text="Select All"
                                                    className="filterDropdownMenu__headerSelect_text ellipsis-text"
                                                >
                                                    <Checkbox
                                                        className="filterDropdownMenu__headerSelect_checkbox"
                                                        name="item"
                                                        value="item"
                                                        checked={
                                                            header.column.getFacetedRowModel().flatRows.length ===
                                                            filteredValues.length
                                                        }
                                                        onChange={handleSelectAll}
                                                    />
                                                </Label>
                                                <p className="filterDropdownMenu__headerSelect_text ellipsis-text" />
                                            </div>
                                        </div>
                                        <Button
                                            appearance="secondary"
                                            layout="text"
                                            size="small"
                                            disabled={filteredValues.length === 0}
                                            onClick={handleClearSelectedValues}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>

                                <div className="filterDropdownMenu__main">
                                    <div className="filterDropdownMenu__columns">
                                        {/* todo: add next classNames for similar states - "filterDropdownMenu__columns_item_drag", "filterDropdownMenu__columns_item_disabled" */}
                                        {getFilterOption(header.column)?.map((option) => (
                                            <div
                                                key={option}
                                                className="filterDropdownMenu__columns_item"
                                                role="tab"
                                                tabIndex={0}
                                            >
                                                <div className="filterDropdownMenu__columns_placeholder">
                                                    {/* todo: add 'disabled' attr. for similar state */}
                                                    {/* todo: add 'readOnly checked' attr-s. for 'readOnly state */}
                                                    <Label className="dropdownMenu__columns_placeholder" text={option}>
                                                        <Checkbox
                                                            className="filterDropdownMenu__columns_checkbox"
                                                            name="item"
                                                            value={option}
                                                            checked={filteredValues.includes(option)}
                                                            onChange={(event) => handleFilteredValueChanges(event)}
                                                        />
                                                    </Label>
                                                    {/* <Checkbox */}
                                                    {/*    className="filterDropdownMenu__columns_checkbox" */}
                                                    {/*    name="item" */}
                                                    {/*    value={ */}
                                                    {/*        option */}
                                                    {/*    } */}
                                                    {/* /> */}
                                                    {/* <p className="filterDropdownMenu__columns_text ellipsis-text"> */}
                                                    {/*    {option} */}
                                                    {/* </p> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </PopoverBody>
                        <PopoverFooter>
                            <PopoverFooterActions>
                                <Button
                                    appearance="secondary"
                                    layout="fill"
                                    size="medium"
                                    onClick={() => setIsFilterPopoverOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    appearance="primary"
                                    layout="fill"
                                    size="medium"
                                    onClick={() => handleFilterFromPopover(header.column)}
                                >
                                    Save
                                </Button>
                            </PopoverFooterActions>
                        </PopoverFooter>
                    </Popover>
                </>
            )}
            {/* todo: import "Dropdown-Menu" component upon click on "Filter" button */}

            {/* todo: change icon from "Globe" to some "Search" icon, when it will implemented */}
            {header.column.getCanFilter() && (
                <>
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        disabled={(header.column.columnDef as TableCol<unknown>).isColumnFilterDisabled}
                        Icon={Magnifier}
                        onClick={() => setCurrentSearchInput(header.column.id)}
                    />
                    {currentSearchInput === header.column.id && (
                        <Filter column={header.column} onBlur={() => setCurrentSearchInput(null)} />
                    )}
                </>
            )}
            {/* todo: import "Search Field" component instead of "Search" button upon click on it */}
            {/* <input type="text" placeholder="Search" style={{ width: "100%" }} /> */}
        </div>
    );
};
