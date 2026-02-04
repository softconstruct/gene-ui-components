import React, { ChangeEvent, FC, ReactNode, useState } from "react";
import classNames from "classnames";

import { Globe } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import ButtonGroup from "@components/molecules/ButtonGroup";
import { IEditActions, IGlobalFilterInfo, IRowSelectionInfo } from "@components/organisms/Table/types";

interface IEditActionsProps {
    isEditMode: boolean;
    tableEditAction?: (type: "secondaryAction" | "onEdit" | "primaryAction") => void;
    editActions?: IEditActions;
}

interface IToolbarProps {
    globalFilterSetter?: (value: string) => void;
    editActions?: IEditActions;
    rowSelectionInfo?: IRowSelectionInfo;
    headerContent?: ReactNode;
    withEditMode?: boolean;
    manageColumnsTitle?: string;
    isManageColumnsDisabled?: boolean;
    globalFilterInfo?: IGlobalFilterInfo;
}

const EditActions: FC<IEditActionsProps> = ({ isEditMode = false, tableEditAction, editActions }) => {
    if (isEditMode)
        return (
            <ButtonGroup size="medium">
                {editActions?.secondaryActionTitle && (
                    <Button
                        appearance="secondary"
                        layout="fill"
                        size="medium"
                        onClick={() => tableEditAction?.("secondaryAction")}
                        aria-label="Cancel editing"
                    >
                        {editActions?.secondaryActionTitle}
                    </Button>
                )}
                {editActions?.primaryActionTitle && (
                    <Button
                        appearance="primary"
                        layout="fill"
                        size="medium"
                        onClick={() => tableEditAction?.("primaryAction")}
                        aria-label="Save changes"
                    >
                        {editActions?.primaryActionTitle}
                    </Button>
                )}
            </ButtonGroup>
        );
    return (
        editActions?.editButtonTitle && (
            <Button
                appearance="secondary"
                layout="outline"
                size="medium"
                Icon={Globe}
                onClick={() => tableEditAction?.("onEdit")}
                aria-label="Edit table"
            >
                {editActions?.editButtonTitle}
            </Button>
        )
    );
};

const Toolbar: FC<IToolbarProps> = ({
    globalFilterSetter,
    editActions,
    globalFilterInfo,
    rowSelectionInfo,
    headerContent,
    withEditMode,
    manageColumnsTitle,
    isManageColumnsDisabled
}) => {
    const [globalFilterValue, setGlobalFilterValue] = useState<string>();
    const [menuOpened, setMenuOpened] = useState(false);

    const tableEditAction = (type: "secondaryAction" | "onEdit" | "primaryAction") => {
        if (editActions === undefined) return;
        editActions[type]?.();
    };

    const handleGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        globalFilterInfo?.onChange?.(value);

        if (globalFilterInfo?.withManualFiltering) return;

        setGlobalFilterValue(value);
        globalFilterSetter?.(value);
    };

    return (
        <div className={classNames("dataTable__toolbar toolbar")}>
            <div className="dataTable__toolbar_search">
                {globalFilterInfo?.withGlobalFilter && (
                    <input
                        className="dataTable__toolbar_searchInput"
                        type="text"
                        placeholder={globalFilterInfo?.placeholder}
                        onChange={handleGlobalFilterChange}
                        value={globalFilterValue}
                    />
                )}
                <div className="dataTable__bulkActions">
                    {rowSelectionInfo !== undefined && (
                        <>
                            {rowSelectionInfo.selectedRowsLength !== undefined && (
                                <>
                                    <div
                                        className="dataTable__bulkActions_selected"
                                        role="status"
                                        aria-live="polite"
                                        aria-atomic="true"
                                    >
                                        {rowSelectionInfo.selectedRowsLength} {rowSelectionInfo.selectedRowsLabel}
                                    </div>
                                    <Divider direction="vertical" aria-hidden="true" />
                                </>
                            )}
                            {rowSelectionInfo.deselectTitle !== undefined && (
                                <Button
                                    appearance="primary"
                                    layout="text"
                                    size="medium"
                                    disabled={rowSelectionInfo.selectedRowsLength === 0}
                                    onClick={() => rowSelectionInfo.onRowsDeselect?.()}
                                    aria-label={`Deselect ${rowSelectionInfo.selectedRowsLength} selected rows`}
                                >
                                    {rowSelectionInfo.deselectTitle}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="dataTable__toolbar_actions">
                {headerContent && <div className="dataTable__toolbar_content">{headerContent}</div>}
                {editActions !== undefined && (
                    <EditActions
                        isEditMode={!!withEditMode}
                        editActions={editActions}
                        tableEditAction={tableEditAction}
                    />
                )}
                {manageColumnsTitle && (
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
                    </div>
                )}
            </div>
        </div>
    );
};

export { Toolbar as default };
