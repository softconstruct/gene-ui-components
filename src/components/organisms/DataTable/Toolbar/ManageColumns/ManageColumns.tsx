import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Column } from "@tanstack/react-table";
import classNames from "classnames";

import { Gear, Magnifier } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import CustomDragLayer from "@components/molecules/ActionableList/ActionableListItem/CustomDragLayer";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";
import Empty from "@components/molecules/Empty";
import TextField from "@components/molecules/TextField";
// Hooks
import { useManageColumns } from "@components/organisms/DataTable/hooks/useManageColumns";
import ManageColumnListItem from "@components/organisms/DataTable/Toolbar/ManageColumns/ListItem/ManageColumnListItem";

import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./ManageColumns.scss";

// Context
import { useDataTableContext } from "../../context";

const ManageColumns = <TData,>() => {
    const { table, manageColumnsConfig, initialColumnVisibility } = useDataTableContext<TData>();

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const { texts: manageColumnsTexts, enabled: isManageColumnsEnabled, loading } = manageColumnsConfig;

    const manageColumnsData = useManageColumns<TData>({
        table,
        manageColumnsConfig,
        initialColumnVisibility
    });

    const {
        popoverOpen: open,
        handleSearch: onSearch,
        columnsToRender: columns,
        draftVisibility,
        handleToggleColumnVisibility: onColumnVisibilityChange,
        draftPinning,
        handleToggleColumnPinning: onColumnPinningChange,
        handleColumnReorder: onColumnReorder,
        handleKeyboardReorder: onKeyboardReorder,
        handleSave: onSave,
        handleCancel: onCancel,
        handleRestoreDefaults: onRestoreDefaults,
        handleSearchClear,
        allColumnsChecked,
        allColumnsIndeterminate,
        handleToggleAllColumnsVisibility: onToggleAllColumns,
        isSearchActive,
        isDefaultState,
        hasChanges,
        propsForPopover,
        setPropsForPopover,
        openPopover
    } = manageColumnsData;

    const hasColumns = columns && columns.length > 0;

    const [dropGap, setDropGap] = useState<{ targetId: string; edge: string } | null>(null);
    const dropGapRef = useRef(dropGap);
    dropGapRef.current = dropGap;

    const bodyRef = useRef<HTMLDivElement>(null);
    const [cachedBodyHeight, setCachedBodyHeight] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        if (!isSearchActive && bodyRef.current) {
            setCachedBodyHeight(bodyRef.current.getBoundingClientRect().height);
        }
    }, [isSearchActive, columns]);

    const handleDragTargetChange = useCallback((targetId: string, edge: string | null) => {
        setDropGap((prev) => {
            if (edge === null) return prev;
            if (prev?.targetId === targetId && prev?.edge === edge) return prev;
            return { targetId, edge };
        });
    }, []);

    useEffect(() => {
        return monitorForElements({
            onDrop({ source }) {
                const gap = dropGapRef.current;
                setDropGap(null);

                if (gap) {
                    const sourceId = source.data.id as string;
                    const destId = gap.targetId;

                    if (sourceId && destId && sourceId !== destId) {
                        onColumnReorder(sourceId, destId, gap.edge);
                    }
                }
            }
        });
    }, [onColumnReorder]);

    useClickOutside(() => {
        if (open) {
            onCancel();
        }
    }, [popoverRef.current.floatingElement, popoverRef.current.referenceElement]);

    return (
        <>
            <Button
                disabled={!isManageColumnsEnabled}
                onClick={openPopover}
                Icon={Gear}
                appearance="secondary"
                layout="outline"
                size="medium"
                {...propsForPopover}
            >
                {manageColumnsTexts?.label ?? "Manage columns"}
            </Button>

            <Popover
                position="bottom-right"
                ref={popoverRef}
                withArrow={false}
                open={open}
                setProps={setPropsForPopover}
                onClose={onCancel}
                size="fitContent"
                mobileHeightMode="fit"
            >
                <PopoverBody withScrollbar={false} withPadding={false} className="manageColumnsPopover__main">
                    <CustomDragLayer />
                    <TextField
                        autoComplete="off"
                        placeholder={manageColumnsTexts?.searchPlaceholder ?? "Search"}
                        onChange={onSearch}
                        className="manageColumnsPopover__header"
                        disabled={loading}
                        IconBefore={Magnifier}
                        clearable
                        onClear={handleSearchClear}
                    />
                    <div
                        className="manageColumnsPopover__body"
                        ref={bodyRef}
                        style={{ minHeight: isSearchActive && cachedBodyHeight ? `${cachedBodyHeight}px` : undefined }}
                    >
                        {hasColumns && (
                            <div className="manageColumnsPopover__selectAll">
                                <Checkbox
                                    id="manageColumns-selectAll"
                                    checked={allColumnsChecked}
                                    indeterminate={allColumnsIndeterminate}
                                    onChange={(e) => onToggleAllColumns(e.target.checked)}
                                    className="manageColumnsPopover__selectAllCheckbox"
                                    label={manageColumnsTexts?.selectAllColumns ?? "All Columns"}
                                />
                            </div>
                        )}
                        <Scrollbar className="manageColumnsPopover__scrollbar">
                            <div
                                className={classNames("manageColumnsPopover__list", {
                                    "manageColumnsPopover__list--hasDropGap": dropGap !== null,
                                    manageColumnsPopover__list_empty: !hasColumns
                                })}
                            >
                                {hasColumns ? (
                                    columns.map((column: Column<TData>) => {
                                        const isPinnedDraft = (draftPinning.left || []).includes(column.id);
                                        const isDisabled = manageColumnsConfig?.disabledColumns?.includes(column.id);
                                        return (
                                            <ManageColumnListItem
                                                key={column.id}
                                                column={column}
                                                checked={draftVisibility[column.id] ?? true}
                                                disabled={isDisabled}
                                                isPinnedDraft={isPinnedDraft}
                                                onPinToggle={onColumnPinningChange}
                                                onChange={onColumnVisibilityChange}
                                                dropGapEdge={dropGap?.targetId === column.id ? dropGap.edge : null}
                                                onDragTargetChange={(edge) => handleDragTargetChange(column.id, edge)}
                                                onKeyboardReorder={onKeyboardReorder}
                                            />
                                        );
                                    })
                                ) : (
                                    <Empty
                                        appearance="noResult"
                                        className="manageColumnsPopover__empty"
                                        size="small"
                                        title={manageColumnsTexts?.noResultsFound ?? "No results found"}
                                        description={manageColumnsTexts?.noResultsFoundDescription}
                                    />
                                )}
                            </div>
                        </Scrollbar>
                    </div>
                    <div className="manageColumnsPopover__footer">
                        <Button
                            disabled={loading || isDefaultState}
                            layout="text"
                            size="medium"
                            onClick={onRestoreDefaults}
                            appearance="secondary"
                        >
                            {manageColumnsTexts?.restoreDefaultsButton ?? "Restore defaults"}
                        </Button>

                        <ButtonGroup size="medium" className="manageColumnsPopover__actions">
                            <Button disabled={loading} onClick={onCancel} size="medium" appearance="secondary">
                                {manageColumnsTexts?.cancelButton ?? "Cancel"}
                            </Button>
                            <Button
                                disabled={!hasChanges}
                                loading={loading}
                                onClick={onSave}
                                size="medium"
                                appearance="primary"
                            >
                                {manageColumnsTexts?.saveButton ?? "Save"}
                            </Button>
                        </ButtonGroup>
                    </div>
                </PopoverBody>
            </Popover>
        </>
    );
};

export default ManageColumns;
