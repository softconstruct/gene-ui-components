import React, { ChangeEvent, FC, ReactNode, useState } from "react";
import classNames from "classnames";

import { DocumentPen, Globe } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Divider from "@components/atoms/Divider";
import ButtonGroup from "@components/molecules/ButtonGroup";
import BulkActions from "@components/organisms/Table/BulkActions";
import ManageColumns from "@components/organisms/Table/ManageColumns";
import {
    Actions,
    IBulkActions,
    IGlobalFilterInfo,
    IManageColumnsInfo,
    IRowSelectionInfo
} from "@components/organisms/Table/types";

interface IEditActionsProps {
    isEditMode: boolean;
    editActions?: Actions;
    handleSave?: () => void;
    handleCancel?: () => void;
}

interface IToolbarProps {
    handleSave?: () => void;
    handleCancel?: () => void;
    onGlobalFilterChange?: (value: string) => void;
    editActions?: Actions;
    rowSelectionInfo?: IRowSelectionInfo;
    headerContent?: ReactNode;
    withEditMode?: boolean;
    globalFilterInfo?: IGlobalFilterInfo;
    bulkActions?: IBulkActions;
    manageColumnsInfo?: IManageColumnsInfo;
}

const EditActions: FC<IEditActionsProps> = ({ isEditMode = false, editActions, handleSave, handleCancel }) => {
    if (isEditMode) {
        return (
            <ButtonGroup size="medium">
                {editActions?.secondary && (
                    <Button
                        appearance="secondary"
                        layout="fill"
                        size="medium"
                        onClick={handleCancel}
                        aria-label={editActions.secondary.ariaLabel || editActions.secondary.label}
                        disabled={editActions.secondary.disabled}
                    >
                        {editActions.secondary.label}
                    </Button>
                )}
                {editActions?.primary && (
                    <Button
                        appearance="primary"
                        layout="fill"
                        size="medium"
                        onClick={handleSave}
                        aria-label={editActions.primary.ariaLabel || editActions.primary.label}
                        disabled={editActions.primary.disabled}
                    >
                        {editActions.primary.label}
                    </Button>
                )}
            </ButtonGroup>
        );
    }

    if (!editActions?.tertiary) return null;

    return (
        <Button
            appearance="secondary"
            layout="outline"
            size="medium"
            Icon={DocumentPen}
            onClick={editActions.tertiary.onClick}
            aria-label={editActions.tertiary.ariaLabel || editActions.tertiary.label}
            disabled={editActions.tertiary.disabled}
        >
            {editActions.tertiary.label}
        </Button>
    );
};

const Toolbar: FC<IToolbarProps> = ({
    handleSave,
    handleCancel,
    onGlobalFilterChange,
    editActions,
    globalFilterInfo,
    rowSelectionInfo,
    headerContent,
    withEditMode,
    bulkActions,
    manageColumnsInfo
}) => {
    const [menuOpened, setMenuOpened] = useState(false);

    const handleGlobalFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!onGlobalFilterChange) return;

        const { value } = event.target;
        onGlobalFilterChange?.(String(value));
    };

    const onManageColumnsClose = () => setMenuOpened(false);

    return (
        <div className={classNames("dataTable__toolbar toolbar")}>
            <div className="dataTable__toolbar_search">
                {globalFilterInfo?.withGlobalFilter && (
                    <input
                        className="dataTable__toolbar_searchInput"
                        type="text"
                        placeholder={globalFilterInfo?.placeholder}
                        {...(onGlobalFilterChange && { onChange: handleGlobalFilterChange })}
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
                    {!!bulkActions?.list.length && <BulkActions bulkActions={bulkActions} />}
                </div>
            </div>
            <div className="dataTable__toolbar_actions">
                {headerContent && <div className="dataTable__toolbar_content">{headerContent}</div>}
                {editActions !== undefined && (
                    <EditActions
                        isEditMode={!!withEditMode}
                        editActions={editActions}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                    />
                )}
                {manageColumnsInfo?.manageColumnsTitle && (
                    <div className="dataTable__toolbar_dropdownMenu">
                        <Button
                            className="dataTable__toolbar_dropdownMenu_manageColumns"
                            appearance="secondary"
                            layout="outline"
                            size="medium"
                            disabled={manageColumnsInfo.isManageColumnsDisabled}
                            Icon={Globe}
                            onClick={() => setMenuOpened(!menuOpened)}
                            aria-label={manageColumnsInfo.manageColumnsTitle}
                            aria-expanded={menuOpened}
                            aria-haspopup="true"
                        >
                            {manageColumnsInfo.manageColumnsTitle}
                        </Button>
                        {menuOpened && (
                            <ManageColumns {...manageColumnsInfo.manageColumns} onMenuClose={onManageColumnsClose} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export { Toolbar as default };
