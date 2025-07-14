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

interface IFilteredValues {
    [key: string]: string[];
}

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
    const [filteredValues, setFilteredValues] = useState<IFilteredValues>({});

    const handleFilterFromPopover = (column: Column<RowData, unknown>) => {
        column.setFilterValue(filteredValues[column.id]);
    };

    const handleFilteredValueChanges = (e: ChangeEvent<HTMLInputElement>, columnId: string) => {
        const { value } = e.target;

        setFilteredValues((prev) => {
            const currentColumn = prev[columnId];
            if (currentColumn) {
                return {
                    [columnId]: prev[columnId].includes(value)
                        ? prev[columnId].filter((v) => v !== value)
                        : [...prev[columnId], value]
                };
            }
            return {
                [columnId]: [value]
            };
        });
    };

    return (
        <div className="table__th_actions">
            {header.column.getCanSort() && (
                <Button
                    appearance="secondary"
                    layout="text"
                    size="small"
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
                        {...popoverPropsForContent}
                    />
                    <Popover setProps={setPopoverPropsForContent}>
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
                                                <Checkbox
                                                    className="filterDropdownMenu__headerSelect_checkbox"
                                                    name="item"
                                                    value="item"
                                                />
                                                <p className="filterDropdownMenu__headerSelect_text ellipsis-text">
                                                    Select All
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            appearance="secondary"
                                            layout="text"
                                            size="small"
                                            disabled
                                            onClick={() => {}}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>

                                <div className="filterDropdownMenu__main">
                                    <div className="filterDropdownMenu__columns">
                                        {/* todo: add next classNames for similar states - "filterDropdownMenu__columns_item_drag", "filterDropdownMenu__columns_item_disabled" */}
                                        {getFilterOption(header.column)?.map((option) => (
                                            <div className="filterDropdownMenu__columns_item" role="tab" tabIndex={0}>
                                                <div className="filterDropdownMenu__columns_placeholder">
                                                    {/* todo: add 'disabled' attr. for similar state */}
                                                    {/* todo: add 'readOnly checked' attr-s. for 'readOnly state */}
                                                    <Label className="dropdownMenu__columns_placeholder" text={option}>
                                                        <Checkbox
                                                            className="filterDropdownMenu__columns_checkbox"
                                                            name="item"
                                                            value={option}
                                                            checked={filteredValues[header.column.id]?.includes(option)}
                                                            onChange={(event) =>
                                                                handleFilteredValueChanges(event, header.column.id)
                                                            }
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
                                <Button appearance="secondary" layout="fill" size="medium">
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
