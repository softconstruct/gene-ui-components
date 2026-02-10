import React, { Dispatch, FC, SetStateAction } from "react";
import { Column } from "@tanstack/table-core";

import Button from "@components/atoms/Button";
import Label from "@components/atoms/Label";
// Components
import { Popover, PopoverBody, PopoverFooter, PopoverFooterActions } from "@components/atoms/Popover";
import Checkbox from "@components/molecules/Checkbox";

import { Row } from "./types";

interface ISelectFilter {
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    column: Column<Row, unknown>;
    filterOptions?: string[];
    filteredValues?: string[];
    isSelectFilterOpen?: boolean;
    handleFilterSearch?: () => void;
    // handleFilteredValueChanges?: (event: ChangeEvent<HTMLInputElement>) => void;
    handleClearSelectedValues?: () => void;
    // handleFilterFromPopover?: () => void;
    handleSelectAll?: () => void;
    headerText?: string;
    selectAllText: string;
}

const SelectFilter: FC<ISelectFilter> = ({
    setProps,
    column,
    filterOptions,
    filteredValues,
    isSelectFilterOpen = false,
    headerText,
    selectAllText,
    handleFilterSearch,
    handleClearSelectedValues,
    handleSelectAll
}) => {
    return (
        // todo: change icon from "Globe" to some "Filter" icon, when it will implemented
        <Popover setProps={setProps} open={isSelectFilterOpen}>
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
                                                column.getFacetedRowModel().flatRows.length === filteredValues?.length
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
                                disabled={filteredValues?.length === 0}
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
                                <div key={option} className="filterDropdownMenu__columns_item" role="tab" tabIndex={0}>
                                    <div className="filterDropdownMenu__columns_placeholder">
                                        {/* todo: add 'disabled' attr. for similar state */}
                                        {/* todo: add 'readOnly checked' attr-s. for 'readOnly state */}
                                        <Label className="dropdownMenu__columns_placeholder" text={option}>
                                            <Checkbox
                                                className="filterDropdownMenu__columns_checkbox"
                                                name="item"
                                                value={option}
                                                checked={filteredValues?.includes(option)}
                                                // onChange={(event) => handleFilteredValueChanges(event)}
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
                        // onClick={() => setIsFilterPopoverOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance="primary"
                        layout="fill"
                        size="medium"
                        // onClick={() => handleFilterFromPopover(column)}
                    >
                        Save
                    </Button>
                </PopoverFooterActions>
            </PopoverFooter>
        </Popover>
        /* /!* todo: import "Dropdown-Menu" component upon click on "Filter" button *!/ */
    );
};

export default SelectFilter;
