import React from "react";

import { Pencil } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";

// Context
import { useDataTableContext } from "../context";
import ManageColumns from "./ManageColumns/ManageColumns";

// Styles
import "./Toolbar.scss";

interface IToolbarProps {
    /**
     * Whether the table is in loading state.
     */
    isTableLoading: boolean;
}

const Toolbar = <TData,>({ isTableLoading }: IToolbarProps) => {
    const { table, manageColumnsConfig, editConfig } = useDataTableContext<TData>();
    const { visible: isManageColumnsVisible } = manageColumnsConfig;

    if (!isManageColumnsVisible && !editConfig) return null;

    const isEditing = Boolean(editConfig?.editing);
    const isSaveDisabled = Boolean(editConfig?.loading || editConfig?.saveDisabled);
    const hasRows = table.getCoreRowModel().rows.length > 0;

    return (
        <div className="tableToolbar">
            <div className="tableToolbar__actions">
                {editConfig &&
                    (isEditing ? (
                        <>
                            <Button appearance="secondary" disabled={editConfig.loading} onClick={editConfig.onCancel}>
                                {editConfig.texts.cancelButton}
                            </Button>
                            <Button
                                appearance="primary"
                                loading={editConfig.loading}
                                disabled={isSaveDisabled}
                                onClick={editConfig.onSave}
                            >
                                {editConfig.texts.saveButton}
                            </Button>
                        </>
                    ) : (
                        <Button
                            Icon={Pencil}
                            iconPosition="before"
                            appearance="secondary"
                            layout="outline"
                            disabled={isTableLoading || !hasRows}
                            onClick={editConfig.onEditStart}
                        >
                            {editConfig.texts.editButton}
                        </Button>
                    ))}
                {isManageColumnsVisible && !isEditing && <ManageColumns />}
            </div>
        </div>
    );
};

export default Toolbar;
