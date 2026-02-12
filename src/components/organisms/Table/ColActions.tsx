import React, { FC, JSX, useState } from "react";
import { Header } from "@tanstack/table-core";
import classnames from "classnames";

import { Globe, Magnifier } from "@geneui/icons";

// Components
import Badge from "@components/atoms/Badge";
import Button from "@components/atoms/Button";
import SelectFilter from "@components/organisms/Table/SelectFilter";
import { Row } from "@components/organisms/Table/types";

import { SortingIcons } from "./constants";
import Filter from "./Filter";

interface IColActionsProps {
    header: Header<Row, unknown>;
    onColAction?: (event: string, value: boolean) => void;
    selectAllText?: string;
    filterPlaceholder?: string;
}

interface IAction {
    withBadge: boolean;
    children: JSX.Element;
}

const Action: FC<IAction> = ({ withBadge, children }) => {
    return withBadge ? <Badge size="smallNudge">{children}</Badge> : children;
};

export const ColActions: FC<IColActionsProps> = ({ header, filterPlaceholder, selectAllText = "Select All" }) => {
    const { column } = header;
    const [currentSearchInput, setCurrentSearchInput] = useState<string | null>(null);
    const [popoverPropsForContent, setPopoverPropsForContent] = useState({});
    const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState<boolean>(false);
    const filteredValues: string[] = [];

    const handleSortChange = () => column.toggleSorting();
    const handleColumnFilter = (value: string) => column.setFilterValue(value);

    return (
        <div className="table__th_actions" role="group">
            {column.getCanSort() && (
                <Action withBadge={Boolean(column.getIsSorted())}>
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        className={classnames({
                            table__th_actions_active: column.getIsSorted()
                        })}
                        Icon={SortingIcons[`${column.getIsSorted()}`]}
                        onClick={handleSortChange}
                    />
                </Action>
            )}
            {column.columnDef.enableSelectFilter && (
                <>
                    <Action withBadge={Boolean(filteredValues.length)}>
                        <Button
                            {...popoverPropsForContent}
                            appearance="secondary"
                            layout="text"
                            size="small"
                            Icon={Globe}
                            className={classnames({
                                table__th_actions_active: isFilterPopoverOpen
                            })}
                            disabled={column.columnDef?.isSelectFilter}
                            onClick={() => setIsFilterPopoverOpen(true)}
                        />
                    </Action>
                    <SelectFilter
                        selectAllText={selectAllText}
                        filteredValues={filteredValues}
                        column={column}
                        setProps={setPopoverPropsForContent}
                        isSelectFilterOpen={isFilterPopoverOpen}
                    />
                </>
            )}

            {/* /!* todo: change icon from "Globe" to some "Search" icon, when it will implemented *!/ */}
            {column.getCanFilter() && (
                <Action withBadge={column.getIsFiltered()}>
                    <Button
                        appearance="secondary"
                        layout="text"
                        size="small"
                        disabled={column.columnDef?.isColumnFilterDisabled}
                        className={classnames({
                            table__th_actions_active: column.getIsFiltered()
                        })}
                        Icon={Magnifier}
                        onClick={() => setCurrentSearchInput(column.id)}
                    />
                </Action>
            )}
            {currentSearchInput === column.id && (
                <Filter
                    onBlur={() => setCurrentSearchInput(null)}
                    filterPlaceholder={filterPlaceholder}
                    handleColumnFilter={handleColumnFilter}
                    filterValue={column.getFilterValue() as string}
                />
            )}

            {/* todo: import "Search Field" component instead of "Search" button upon click on it */}
        </div>
    );
};
