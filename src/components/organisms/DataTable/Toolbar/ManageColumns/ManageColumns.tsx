import React, { useCallback, useEffect, useRef, useState } from "react";
import { dropTargetForElements, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Column } from "@tanstack/react-table";
import classNames from "classnames";
import { nanoid } from "nanoid/non-secure";

import { Gear, Magnifier } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import ButtonGroup from "@components/molecules/ButtonGroup";
import Checkbox from "@components/molecules/Checkbox";
import Empty from "@components/molecules/Empty";
import TextField from "@components/molecules/TextField";

import DnDDragLayer from "@internal/components/DnDDragLayer/DnDDragLayer";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./ManageColumns.scss";

// Context
import { useDataTableContext } from "../../context";
// Sub-components
import ManageColumnListItem from "./ListItem/ManageColumnListItem";
import { isManageColumnsDragData, MANAGE_COLUMNS_LIST_DROP_TYPE } from "./ListItem/useListItemDnD";
// Hooks
import { useManageColumns } from "./useManageColumns";

const ManageColumns = <TData,>() => {
    const { table, manageColumnsConfig, initialColumnVisibility, initialColumnPinning } = useDataTableContext<TData>();

    // Unique per instance: scopes drag and drop to this list and keeps checkbox ids unique on the page
    const [listId] = useState(() => `manageColumns-${nanoid()}`);

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const {
        texts: manageColumnsTexts,
        disabled: isManageColumnsDisabled,
        loading,
        disabledColumns
    } = manageColumnsConfig;

    const manageColumnsData = useManageColumns<TData>({
        table,
        manageColumnsConfig,
        initialColumnVisibility,
        initialColumnPinning
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
        handleSave: onSave,
        handleCancel: onCancel,
        handleRestoreDefaults: onRestoreDefaults,
        handleSearchClear,
        allColumnsChecked,
        allColumnsIndeterminate,
        handleToggleAllColumnsVisibility: onToggleAllColumns,
        searchValue,
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
    useEffect(() => {
        dropGapRef.current = dropGap;
    }, [dropGap]);

    const bodyRef = useRef<HTMLDivElement>(null);
    const [cachedBodyHeight, setCachedBodyHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
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

    const onColumnReorderRef = useRef(onColumnReorder);
    useEffect(() => {
        onColumnReorderRef.current = onColumnReorder;
    });

    const [listElement, setListElement] = useState<HTMLDivElement | null>(null);

    // The whole list is a drop target: the gap stays while the pointer is anywhere inside the list
    // (including the gap itself) and is cleared only when the pointer leaves the list
    useEffect(() => {
        if (!listElement) return () => undefined;

        return dropTargetForElements({
            element: listElement,
            canDrop: ({ source }) => isManageColumnsDragData(source.data, listId),
            getData: () => ({ type: MANAGE_COLUMNS_LIST_DROP_TYPE, listId }),
            onDragLeave: () => setDropGap(null)
        });
    }, [listElement, listId]);

    useEffect(() => {
        return monitorForElements({
            canMonitor: ({ source }) => isManageColumnsDragData(source.data, listId),
            onDrop({ source, location }) {
                const gap = dropGapRef.current;
                setDropGap(null);

                // Not over this list means the drag was cancelled (Escape) or released outside the list
                const isOverList = location.current.dropTargets.some((target) => target.data.listId === listId);
                if (!gap || !isOverList) return;

                const sourceId = source.data.id as string;
                const destId = gap.targetId;

                if (sourceId && destId && sourceId !== destId) {
                    onColumnReorderRef.current(sourceId, destId, gap.edge);
                }
            }
        });
    }, [listId]);

    const bodyMinHeight = isSearchActive && cachedBodyHeight ? `${cachedBodyHeight}px` : undefined;

    useClickOutside(() => {
        if (open) {
            onCancel();
        }
    }, [popoverRef.current.floatingElement, popoverRef.current.referenceElement]);

    return (
        <>
            <Button
                disabled={isManageColumnsDisabled}
                onClick={openPopover}
                Icon={Gear}
                appearance="secondary"
                layout="outline"
                size="medium"
                {...propsForPopover}
            >
                {manageColumnsTexts.label}
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
                    <DnDDragLayer />
                    <TextField
                        autoComplete="off"
                        placeholder={manageColumnsTexts.searchPlaceholder}
                        value={searchValue}
                        onChange={onSearch}
                        className="manageColumnsPopover__header"
                        disabled={loading}
                        IconBefore={Magnifier}
                        clearable
                        onClear={handleSearchClear}
                    />
                    <div className="manageColumnsPopover__body" ref={bodyRef} style={{ minHeight: bodyMinHeight }}>
                        {hasColumns && (
                            <div className="manageColumnsPopover__selectAll">
                                <Checkbox
                                    id={`${listId}-selectAll`}
                                    checked={allColumnsChecked}
                                    disabled={loading}
                                    indeterminate={allColumnsIndeterminate}
                                    onChange={(e) => onToggleAllColumns(e.target.checked)}
                                    className="manageColumnsPopover__selectAllCheckbox"
                                    label={manageColumnsTexts.selectAllColumns}
                                />
                            </div>
                        )}
                        {hasColumns ? (
                            <Scrollbar className="manageColumnsPopover__scrollbar">
                                <div
                                    ref={setListElement}
                                    className={classNames("manageColumnsPopover__list", {
                                        manageColumnsPopover__list_empty: !hasColumns
                                    })}
                                >
                                    {columns.map((column: Column<TData>) => {
                                        const isPinnedDraft = (draftPinning.left || []).includes(column.id);
                                        const isDisabled = disabledColumns?.includes(column.id) || loading;
                                        return (
                                            <ManageColumnListItem
                                                key={column.id}
                                                column={column}
                                                listId={listId}
                                                checked={draftVisibility[column.id] ?? true}
                                                disabled={isDisabled}
                                                isPinnedDraft={isPinnedDraft}
                                                onPinToggle={onColumnPinningChange}
                                                onChange={onColumnVisibilityChange}
                                                dropGapEdge={dropGap?.targetId === column.id ? dropGap.edge : null}
                                                hasDropGap={dropGap !== null}
                                                onDragTargetChange={(edge) => handleDragTargetChange(column.id, edge)}
                                            />
                                        );
                                    })}
                                </div>
                            </Scrollbar>
                        ) : (
                            <Empty
                                appearance="noResult"
                                className="manageColumnsPopover__empty"
                                size="small"
                                title={manageColumnsTexts.noResultsFound}
                                description={manageColumnsTexts.noResultsFoundDescription}
                            />
                        )}
                    </div>
                    <div className="manageColumnsPopover__footer">
                        <Button
                            disabled={loading || isDefaultState}
                            layout="text"
                            size="medium"
                            onClick={onRestoreDefaults}
                            appearance="secondary"
                        >
                            {manageColumnsTexts.restoreDefaultsButton}
                        </Button>

                        <ButtonGroup size="medium" className="manageColumnsPopover__actions">
                            <Button disabled={loading} onClick={onCancel} size="medium" appearance="secondary">
                                {manageColumnsTexts.cancelButton}
                            </Button>
                            <Button
                                disabled={!hasChanges}
                                loading={loading}
                                onClick={onSave}
                                size="medium"
                                appearance="primary"
                            >
                                {manageColumnsTexts.saveButton}
                            </Button>
                        </ButtonGroup>
                    </div>
                </PopoverBody>
            </Popover>
        </>
    );
};

export default ManageColumns;
