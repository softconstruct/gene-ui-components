import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { Column } from "@tanstack/react-table";
import { Header } from "@tanstack/table-core";
import classnames from "classnames";

import { Globe, Magnifier } from "@geneui/icons";

import Badge from "@components/atoms/Badge";
import Button from "@components/atoms/Button";
import Label from "@components/atoms/Label";
import { IPillProps } from "@components/atoms/Pill";
import { Popover, PopoverBody, PopoverFooter, PopoverFooterActions } from "@components/atoms/Popover";
import Checkbox, { ICheckboxProps } from "@components/molecules/Checkbox";
import { ICellProps } from "@components/molecules/Table/Cell";
import Filter from "@components/molecules/Table/Filter";
import { SortingIcons } from "@components/molecules/Table/helpers";
import { Cell, Row, TableCol, TableRowCells } from "@components/molecules/Table/type";

interface IColActionsProps {
    header: Header<Row, unknown>;
    onColAction?: (event: string, value: boolean) => void;
    selectAllText?: string;
}

const getFilterOptionLabelByColumnType = (data: Cell | undefined, type: string) => {
    switch (type) {
        case "status":
        case "pill":
            return (data as IPillProps)?.text;
        case "checkbox":
        case "switch":
            return (data as ICheckboxProps).value;
        default:
            return data as string;
    }
};

const getFilterOption = (column: Column<Row, unknown>): string[] => {
    const colDef = column.columnDef as TableCol<Row>;
    colDef.filterFn = colDef.enablePopoverFilter ? "arrIncludesSome" : "auto";
    const initialFilterOptions = colDef.filterOptions;
    if (initialFilterOptions?.length) {
        return initialFilterOptions;
    }
    const { flatRows } = column.getFacetedRowModel();
    return [
        ...new Set(
            flatRows
                .map((row) => {
                    const rowOriginal = row.original as TableRowCells;
                    const cellData: Cell | undefined = rowOriginal[colDef.type];
                    return getFilterOptionLabelByColumnType(
                        cellData,
                        (column.columnDef as TableCol<ICellProps>).type.toLowerCase()
                    );
                })
                .filter((item) => item !== undefined)
        )
    ];
};

export const ColActions: FC<IColActionsProps> = ({ header, onColAction, selectAllText = "Select All" }) => {
    const [currentSearchInput, setCurrentSearchInput] = useState<string | null>(null);
    const [popoverPropsForContent, setPopoverPropsForContent] = useState({});
    const [initialFilterOptions, setInitialFilterOptions] = useState<string[]>([]);
    const [filterOptions, setFilterOptions] = useState<string[]>([]);
    const [filteredValues, setFilteredValues] = useState<string[]>([]);
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState<boolean>(false);

    useEffect(() => {
        const options = getFilterOption(header.column);
        setFilterOptions(options);
        setInitialFilterOptions(options);
    }, [header.column]);

    useEffect(() => {
        onColAction?.(header.id, !!(header.column.getIsFiltered() || header.column.getIsSorted()));
    }, [header.column.getIsFiltered(), header.column.getIsSorted()]);

    const handleFilterFromPopover = (column: Column<Row, unknown>) => {
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
        const values = flatRows
            .map((row) => (row.original[(column.columnDef as TableCol<Row>).type] as ICheckboxProps).value)
            .filter((item) => Boolean(item));
        setFilteredValues(values);
    };

    const handleClearSelectedValues = () => {
        setFilteredValues([]);
    };

    const handleFilterSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const filteredOptions = initialFilterOptions.filter((option) => option.includes(e.target.value));
        setFilterOptions(filteredOptions);
    };

    const colDef = header.column.columnDef as TableCol<Row>;
    const headerText = typeof colDef.header === "string" ? colDef.header : "column";

    return (
        <div className="table__th_actions" role="group" aria-label={headerText}>
            {header.column.getCanSort() &&
                (header.column.getIsSorted() ? (
                    <Badge size="smallNudge">
                        <Button
                            appearance="secondary"
                            layout="text"
                            size="small"
                            className={classnames({
                                table__th_actions_active: header.column.getIsSorted()
                            })}
                            disabled={(header.column.columnDef as TableCol<unknown>)?.isSortingDisabled}
                            Icon={SortingIcons[`${header.column.getIsSorted()}`]}
                            aria-label="sorting"
                            onClick={(e) => {
                                return (
                                    (header.column.columnDef as TableCol<unknown>).enableSorting &&
                                    header?.column?.getToggleSortingHandler?.()?.(e)
                                );
                            }}
                        />
                    </Badge>
                ) : (
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        className={classnames({
                            table__th_actions_active: header.column.getIsSorted()
                        })}
                        disabled={(header.column.columnDef as TableCol<unknown>)?.isSortingDisabled}
                        Icon={SortingIcons[`${header.column.getIsSorted()}`]}
                        aria-label="sorting"
                        onClick={(e) => {
                            return (
                                (header.column.columnDef as TableCol<unknown>).enableSorting &&
                                header?.column?.getToggleSortingHandler?.()?.(e)
                            );
                        }}
                    />
                ))}

            {/* todo: change icon from "Globe" to some "Filter" icon, when it will implemented */}
            {(header.column.columnDef as TableCol<Row>).enablePopoverFilter && filterOptions.length > 0 && (
                <>
                    {filteredValues.length ? (
                        <Badge size="smallNudge">
                            <Button
                                appearance="secondary"
                                layout="text"
                                size="small"
                                Icon={Globe}
                                className={classnames({
                                    table__th_actions_active: isFilterPopoverOpen
                                })}
                                disabled={(header.column.columnDef as TableCol<Row>)?.isPopoverFilterDisabled}
                                aria-label={`Filter ${headerText}: ${filteredValues.length} selected ${isFilterPopoverOpen ? ", open" : ", click to open filter menu"}`}
                                aria-expanded={isFilterPopoverOpen}
                                aria-haspopup="true"
                                {...popoverPropsForContent}
                                onClick={() => setIsFilterPopoverOpen(true)}
                            />
                        </Badge>
                    ) : (
                        <Button
                            appearance="secondary"
                            layout="text"
                            size="small"
                            Icon={Globe}
                            className={classnames({
                                table__th_actions_active: isFilterPopoverOpen
                            })}
                            disabled={(header.column.columnDef as TableCol<Row>)?.isPopoverFilterDisabled}
                            aria-label={`Filter ${headerText}${isFilterPopoverOpen ? ", open" : ", click to open filter menu"}`}
                            aria-expanded={isFilterPopoverOpen}
                            aria-haspopup="true"
                            {...popoverPropsForContent}
                            onClick={() => setIsFilterPopoverOpen(true)}
                        />
                    )}
                    <Popover setProps={setPopoverPropsForContent} open={isFilterPopoverOpen}>
                        <PopoverBody withPadding={false}>
                            <div className="filterDropdownMenu">
                                <div className="filterDropdownMenu__header">
                                    {/* todo: import "Search Field" component instead of next input element */}
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        onChange={handleFilterSearch}
                                        style={{ width: "100%" }}
                                        aria-label={`Search filter options for ${headerText}`}
                                    />

                                    <div className="filterDropdownMenu__headerSelect">
                                        <div className="filterDropdownMenu__headerSelect_item" role="tab" tabIndex={0}>
                                            <div className="filterDropdownMenu__headerSelect_placeholder">
                                                {/* todo: add 'disabled' attr. for similar state */}
                                                {/* todo: add 'readOnly checked' attr-s. for 'readOnly state */}
                                                <Label
                                                    text={selectAllText}
                                                    className="filterDropdownMenu__headerSelect_text ellipsis-text"
                                                >
                                                    <Checkbox
                                                        className="filterDropdownMenu__headerSelect_checkbox"
                                                        name="item"
                                                        value={selectAllText}
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
                                        {filterOptions?.map((option) => (
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
                    {header.column.getIsFiltered() ? (
                        <Badge size="smallNudge">
                            <Button
                                appearance="secondary"
                                layout="text"
                                size="small"
                                disabled={(header.column.columnDef as TableCol<unknown>).isColumnFilterDisabled}
                                className={classnames({
                                    table__th_actions_active: header.column.getIsFiltered()
                                })}
                                Icon={Magnifier}
                                aria-label={`Filter ${headerText}${currentSearchInput === header.column.id ? ", active" : ", click to search"}`}
                                aria-expanded={currentSearchInput === header.column.id}
                                onClick={() => setCurrentSearchInput(header.column.id)}
                            />
                        </Badge>
                    ) : (
                        <Button
                            appearance="secondary"
                            layout="text"
                            size="small"
                            disabled={(header.column.columnDef as TableCol<unknown>).isColumnFilterDisabled}
                            className={classnames({
                                table__th_actions_active: header.column.getIsFiltered()
                            })}
                            Icon={Magnifier}
                            aria-label={`Filter ${headerText}, click to search`}
                            aria-expanded={currentSearchInput === header.column.id}
                            onClick={() => setCurrentSearchInput(header.column.id)}
                        />
                    )}
                    {currentSearchInput === header.column.id && (
                        <Filter
                            column={header.column}
                            onBlur={() => setCurrentSearchInput(null)}
                            headerText={headerText}
                        />
                    )}
                </>
            )}
            {/* todo: import "Search Field" component instead of "Search" button upon click on it */}
            {/* <input type="text" placeholder="Search" style={{ width: "100%" }} /> */}
        </div>
    );
};
