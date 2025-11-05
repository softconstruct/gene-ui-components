import React, { ChangeEvent, FC, ReactNode, useContext, useEffect, useState } from "react";
import { VisibilityState } from "@tanstack/react-table";
import classNames from "classnames";

import { Globe } from "@geneui/icons";

import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import ManageColumns from "@components/molecules/Table/ManageColumns";
import { TableContext } from "@components/molecules/Table/Table";
import { BulkAction, IOrderedColumns, Row, TableCol } from "@components/molecules/Table/type";

import ButtonGroup from "../ButtonGroup";
import BulkActions from "./BulkActions";

interface IToolbar {
    withGlobalFilter?: boolean;
    globalFilterPlaceholder?: string;
    globalFilter?: string;
    globalFilterSetter: (value: string) => void;
    withCheckbox?: boolean;
    bulkActions?: BulkAction;
    selectedRowsLength?: number;
    onRowsDeselect?: () => void;
    headerContent?: ReactNode;
    withEditMode?: boolean;
    withManageColumns?: boolean;
    manageColumnsTitle?: string;
    isManageColumnsDisabled?: boolean;
    visibleColumns?: VisibilityState;
    orderedColumns?: IOrderedColumns[];
    columnsMap: Map<string, TableCol<Row>>;
    isGrouped?: boolean;
}

const Toolbar: FC<IToolbar> = ({
    withGlobalFilter,
    globalFilterPlaceholder,
    globalFilter,
    globalFilterSetter,
    withCheckbox,
    bulkActions,
    selectedRowsLength,
    onRowsDeselect,
    headerContent,
    withEditMode,
    withManageColumns,
    manageColumnsTitle,
    isManageColumnsDisabled,
    visibleColumns,
    orderedColumns,
    columnsMap,
    isGrouped
}) => {
    const { onSave, onEdit, onCancel, onGlobalFilterChange } = useContext(TableContext);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>();
    const [menuOpened, setMenuOpened] = useState(false);

    const tableEditAction = (type: "cancel" | "edit" | "save") => {
        if (type === "save") onSave?.();
        if (type === "edit") onEdit?.();
        if (type === "cancel") onCancel?.();
    };

    const handleGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setGlobalFilterValue(value);
        globalFilterSetter(value);
        onGlobalFilterChange?.(value);
    };

    useEffect(() => {
        if (!globalFilter) return;
        setGlobalFilterValue(globalFilter);
    }, []);

    return (
        <div className={classNames("dataTable__toolbar toolbar")}>
            <div className="dataTable__toolbar_search">
                {withGlobalFilter && (
                    <input
                        className="dataTable__toolbar_searchInput"
                        type="text"
                        placeholder={globalFilterPlaceholder || "Search..."}
                        value={globalFilterValue}
                        onChange={(e) => handleGlobalFilterChange(e)}
                        style={{ width: "100%" }}
                        aria-label="Search table"
                        aria-describedby="table-search-description"
                    />
                )}
                <div className="dataTable__bulkActions">
                    {withCheckbox && (
                        <>
                            <div
                                className="dataTable__bulkActions_selected"
                                role="status"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {selectedRowsLength} selected
                            </div>
                            <Divider direction="vertical" aria-hidden="true" />
                            <Button
                                appearance="primary"
                                layout="text"
                                size="medium"
                                disabled={!selectedRowsLength || bulkActions?.disabled}
                                onClick={() => selectedRowsLength && onRowsDeselect?.()}
                                aria-label={`Deselect ${selectedRowsLength} selected rows`}
                            >
                                Deselect
                            </Button>
                        </>
                    )}
                    {!!bulkActions?.list.length && <BulkActions bulkActions={bulkActions} />}
                </div>
            </div>
            <div className="dataTable__toolbar_actions">
                {headerContent && <div className="dataTable__toolbar_content">{headerContent}</div>}
                {withEditMode ? (
                    <ButtonGroup size="medium">
                        <Button
                            appearance="secondary"
                            layout="fill"
                            size="medium"
                            onClick={() => tableEditAction("cancel")}
                            aria-label="Cancel editing"
                        >
                            Cancel
                        </Button>
                        <Button
                            appearance="primary"
                            layout="fill"
                            size="medium"
                            onClick={() => tableEditAction("save")}
                            aria-label="Save changes"
                        >
                            Save
                        </Button>
                    </ButtonGroup>
                ) : (
                    <>
                        <Button
                            appearance="secondary"
                            layout="outline"
                            size="medium"
                            Icon={Globe}
                            onClick={() => tableEditAction("edit")}
                            aria-label="Edit table"
                        >
                            Edit
                        </Button>
                        {withManageColumns && (
                            <div className="dataTable__toolbar_dropdownMenu">
                                <Button
                                    className="dataTable__toolbar_dropdownMenu_manageColumns"
                                    appearance="secondary"
                                    layout="outline"
                                    size="medium"
                                    disabled={isManageColumnsDisabled}
                                    Icon={Globe}
                                    onClick={() => setMenuOpened(!menuOpened)}
                                    aria-label={manageColumnsTitle}
                                    aria-expanded={menuOpened}
                                    aria-haspopup="true"
                                >
                                    {manageColumnsTitle}
                                </Button>
                                {menuOpened && (
                                    <ManageColumns
                                        isGrouped={isGrouped}
                                        orderedColumns={orderedColumns}
                                        visibleColumns={visibleColumns}
                                        columnsMap={columnsMap}
                                        onMenuClose={() => setMenuOpened(false)}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export { Toolbar as default };
