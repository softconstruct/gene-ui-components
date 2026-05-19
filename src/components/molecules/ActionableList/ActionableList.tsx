import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dropTargetForElements, monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import classNames from "classnames";

import { Magnifier } from "@geneui/icons";

// Components
import Divider from "@components/atoms/Divider";
import Loader from "@components/atoms/Loader";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import Checkbox from "@components/molecules/Checkbox";
import Empty from "@components/molecules/Empty";
import TextField from "@components/molecules/TextField";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useDebounceCallback from "@hooks/useDebounceCallback";
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./ActionableList.scss";

import {
    ACTIONABLE_LIST_DEFAULT_TEXTS,
    ACTIONABLE_LIST_MAX_NESTED_LEVEL,
    ACTIONABLE_LIST_SEARCH_DEBOUNCE_MS,
    applyCheckedToBranch,
    countAllItems,
    countCheckedItems,
    filterTree,
    findItemById,
    getExpandedIdsFromItems,
    isAnySelectionInSubtree,
    isSubtreeFullySelected,
    mergeItemsFromProps,
    nextLevel,
    reorderInTree,
    updateItemById
} from "./ActionableList.helpers";
// Types
import type {
    IActionableListItem,
    IActionableListProps,
    IActionableListTexts,
    ICrossListDropPayload
} from "./ActionableList.types";
// Sub-components
import ActionableListItem, { type TDropGapEdge } from "./ActionableListItem/ActionableListItem";
import ActionableListNodeWrapper, {
    type TActionableListLevel
} from "./ActionableListNodeWrapper/ActionableListNodeWrapper";

interface IDropGap {
    targetId: string;
    edge: TDropGapEdge;
}

interface IRenderNodeProps {
    item: IActionableListItem;
    level: TActionableListLevel;
    parentId: string;
    withCheckbox: boolean;
    isDraggable: boolean;
    dragListId?: string;
    expandedIds: Set<string>;
    texts: IActionableListTexts;
    dropGap: IDropGap | null;
    isSearchActive: boolean;
    onToggleExpand: (id: string) => void;
    onToggleCheck: (id: string, checked: boolean) => void;
    onDragTargetChange: (targetId: string, edge: TDropGapEdge) => void;
}

const RenderNode: FC<IRenderNodeProps> = ({
    item,
    level,
    parentId,
    withCheckbox,
    isDraggable,
    dragListId,
    expandedIds,
    texts,
    dropGap,
    isSearchActive,
    onToggleExpand,
    onToggleCheck,
    onDragTargetChange
}) => {
    const childCount = item.children?.length || 0;
    const canExpand = childCount > 0 && level < ACTIONABLE_LIST_MAX_NESTED_LEVEL;
    const isExpanded = canExpand ? isSearchActive || expandedIds.has(item.id) : false;
    const branchFullySelected = isSubtreeFullySelected(item);
    const branchIndeterminate = !branchFullySelected && isAnySelectionInSubtree(item);
    const directChildTotal = item.children?.length ?? 0;
    const directChildFullySelected = item.children?.filter((child) => isSubtreeFullySelected(child)).length ?? 0;

    const childLevel = nextLevel(level);
    const dropGapEdge = dropGap?.targetId === item.id ? dropGap.edge : null;

    return (
        <>
            <ActionableListItem
                id={item.id}
                title={item.title}
                level={level}
                parentId={parentId}
                infoText={item.infoText}
                isExpandable={canExpand}
                isExpanded={isExpanded}
                withCheckbox={withCheckbox}
                {...(withCheckbox
                    ? {
                          checkboxChecked: branchFullySelected,
                          checkboxIndeterminate: branchIndeterminate,
                          descendantsSelectedCount: directChildFullySelected,
                          descendantsTotalCount: directChildTotal
                      }
                    : {})}
                selectedLabel={texts.selectedItemsLabel}
                isDraggable={isDraggable}
                dragListId={dragListId}
                dropGapEdge={dropGapEdge}
                expandAriaLabel={texts.expandButtonAriaLabel}
                onToggleExpand={() => onToggleExpand(item.id)}
                onToggleCheck={(checked) => onToggleCheck(item.id, checked)}
                onDragTargetChange={(edge) => onDragTargetChange(item.id, edge)}
            />

            {canExpand && isExpanded && (
                <div className="actionableList__children">
                    <ActionableListNodeWrapper level={childLevel}>
                        {item.children?.map((child) => (
                            <RenderNode
                                key={child.id}
                                item={child}
                                level={childLevel}
                                parentId={item.id}
                                withCheckbox={withCheckbox}
                                isDraggable={isDraggable}
                                dragListId={dragListId}
                                expandedIds={expandedIds}
                                texts={texts}
                                dropGap={dropGap}
                                isSearchActive={isSearchActive}
                                onToggleExpand={onToggleExpand}
                                onToggleCheck={onToggleCheck}
                                onDragTargetChange={onDragTargetChange}
                            />
                        ))}
                    </ActionableListNodeWrapper>
                </div>
            )}
        </>
    );
};

/**
 * Actionable List component provides users with a highly interactive, multi-functional list of items, organized in a hierarchical structure that supports up to five levels of nested items.
 */
const ActionableList: FC<IActionableListProps> = ({
    className,
    items = [],
    withCheckbox = false,
    draggable: isDraggable = false,
    dragListId,
    loading = false,
    defaultExpandAll = false,
    texts,
    onItemsChange,
    onItemCheck,
    onSelectAllChange,
    onCrossListDrop,
    onSearch
}) => {
    const mergedTexts = { ...ACTIONABLE_LIST_DEFAULT_TEXTS, ...texts };
    const wasExpansionToggledRef = useRef(false);
    const bulkSelectedLabelRef = useRef<HTMLSpanElement | null>(null);
    const filteredItemsLabelRef = useRef<HTMLSpanElement | null>(null);
    const totalItemsLabelRef = useRef<HTMLSpanElement | null>(null);
    const isBulkSelectedLabelTruncated = useEllipsisDetection(bulkSelectedLabelRef, [
        mergedTexts.bulkSelectedItemsLabel
    ]);
    const isFilteredItemsLabelTruncated = useEllipsisDetection(filteredItemsLabelRef, [mergedTexts.filteredItemsLabel]);
    const isTotalItemsLabelTruncated = useEllipsisDetection(totalItemsLabelRef, [mergedTexts.totalItemsLabel]);

    const [localItems, setLocalItems] = useState<IActionableListItem[]>(() => mergeItemsFromProps(items, []));
    const [searchValue, setSearchValue] = useState("");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(() =>
        defaultExpandAll ? getExpandedIdsFromItems(items) : new Set()
    );
    const [dropGap, setDropGap] = useState<IDropGap | null>(null);
    const [isEmptyDropActive, setIsEmptyDropActive] = useState(false);
    const emptyDropRef = useRef<HTMLDivElement>(null);

    const handleDropReorderRef = useRef<(sourceId: string, targetId: string) => void>(() => {});
    const onCrossListDropRef = useRef(onCrossListDrop);
    const dropGapRef = useRef(dropGap);
    dropGapRef.current = dropGap;
    onCrossListDropRef.current = onCrossListDrop;

    useEffect(() => {
        setLocalItems((prev) => mergeItemsFromProps(items, prev));
    }, [items]);

    useEffect(() => {
        if (wasExpansionToggledRef.current) return;
        setExpandedIds(defaultExpandAll ? getExpandedIdsFromItems(items) : new Set());
    }, [items, defaultExpandAll]);

    useEffect(() => {
        if (!isDraggable) return () => undefined;
        return monitorForElements({
            onDrop: ({ source }) => {
                const gap = dropGapRef.current;
                setDropGap(null);
                const { sourceId } = source.data;
                const sourceListId = source.data.dragListId;
                if (typeof sourceId !== "string" || !gap || sourceId === gap.targetId) return;

                if (
                    dragListId &&
                    typeof sourceListId === "string" &&
                    sourceListId !== dragListId &&
                    onCrossListDropRef.current
                ) {
                    const payload: ICrossListDropPayload = {
                        sourceListId,
                        targetListId: dragListId,
                        sourceId,
                        targetId: gap.targetId,
                        edge: gap.edge
                    };
                    onCrossListDropRef.current(payload);
                    return;
                }

                handleDropReorderRef.current(sourceId, gap.targetId);
            }
        });
    }, [isDraggable, dragListId]);

    const { debouncedCallback, clearDebounce } = useDebounceCallback((value: unknown) => {
        if (typeof value !== "string") return;
        onSearch?.(value);
    }, ACTIONABLE_LIST_SEARCH_DEBOUNCE_MS);

    useEffect(() => clearDebounce, [clearDebounce]);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        debouncedCallback(value);
    };

    const filteredItems = useMemo(() => filterTree(localItems, searchValue), [localItems, searchValue]);
    const totalItemsCount = useMemo(() => countAllItems(localItems), [localItems]);
    const filteredItemsCount = useMemo(() => countAllItems(filteredItems), [filteredItems]);
    const selectedItemsCount = useMemo(() => countCheckedItems(localItems), [localItems]);

    const selectAllChecked = totalItemsCount > 0 && localItems.every((item) => isSubtreeFullySelected(item));
    const selectAllIndeterminate = !selectAllChecked && localItems.some((item) => isAnySelectionInSubtree(item));

    const handleToggleExpand = (id: string) => {
        wasExpansionToggledRef.current = true;
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const syncItems = (nextItems: IActionableListItem[]) => {
        setLocalItems(nextItems);
        onItemsChange?.(nextItems);
    };

    const handleToggleCheck = (id: string, checked: boolean) => {
        const nextItems = updateItemById(localItems, id, (item) => applyCheckedToBranch(item, checked));
        syncItems(nextItems);
        const toggled = findItemById(nextItems, id);
        if (toggled !== undefined) {
            onItemCheck?.(toggled, checked, nextItems);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (totalItemsCount === 0) return;
        const nextItems = localItems.map((item) => applyCheckedToBranch(item, checked));
        syncItems(nextItems);
        onSelectAllChange?.(checked, nextItems);
    };

    const handleDropReorder = (sourceId: string, targetId: string) => {
        if (sourceId === targetId) return;
        syncItems(reorderInTree(localItems, sourceId, targetId));
    };
    handleDropReorderRef.current = handleDropReorder;

    const handleDragTargetChange = useCallback((targetId: string, edge: TDropGapEdge) => {
        setDropGap((prev) => {
            if (prev?.targetId === targetId && prev?.edge === edge) return prev;
            return { targetId, edge };
        });
    }, []);

    const hasData = totalItemsCount > 0;
    const hasSearchResults = filteredItemsCount > 0;
    const showEmptyDropZone = isDraggable && Boolean(dragListId) && Boolean(onCrossListDrop) && !loading && !hasData;

    useEffect(() => {
        const element = emptyDropRef.current;
        if (!element || !showEmptyDropZone) return () => undefined;

        return dropTargetForElements({
            element,
            getData: () => ({ isEmptyListTarget: true }),
            canDrop: ({ source }) => {
                const sourceListId = source.data.dragListId;
                return typeof sourceListId === "string" && sourceListId !== dragListId;
            },
            onDragEnter: () => setIsEmptyDropActive(true),
            onDragLeave: () => setIsEmptyDropActive(false),
            onDrop: ({ source }) => {
                setIsEmptyDropActive(false);
                const { sourceId } = source.data;
                const sourceListId = source.data.dragListId;
                if (
                    typeof sourceId !== "string" ||
                    typeof sourceListId !== "string" ||
                    !dragListId ||
                    !onCrossListDropRef.current
                ) {
                    return;
                }

                onCrossListDropRef.current({
                    sourceListId,
                    targetListId: dragListId,
                    sourceId,
                    isEmptyTarget: true
                });
            }
        });
    }, [showEmptyDropZone, dragListId]);

    return (
        <div className={classNames("actionableList", className, { actionableList_hasDropGap: dropGap !== null })}>
            <div className="actionableList__headerWrapper">
                <TextField
                    label={mergedTexts.searchLabel}
                    placeholder={mergedTexts.searchPlaceholder}
                    value={searchValue}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    IconBefore={Magnifier}
                    disabled={loading}
                    className="actionableList__search"
                    clearable
                    onClear={() => handleSearchChange("")}
                />
                {!loading && (
                    <div className="actionableList__statsRow">
                        {withCheckbox && (
                            <div className="actionableList__bulkSelection">
                                <Checkbox
                                    checked={selectAllChecked}
                                    indeterminate={selectAllIndeterminate}
                                    disabled={totalItemsCount === 0}
                                    onChange={(event) => handleSelectAll(event.target.checked)}
                                    className="actionableList__selectAll"
                                />
                                <div className="actionableList__bulkSelectedLabelWrapper">
                                    <Tooltip
                                        text={mergedTexts.bulkSelectedItemsLabel}
                                        isVisible={isBulkSelectedLabelTruncated}
                                    >
                                        <Text
                                            ref={bulkSelectedLabelRef}
                                            as="span"
                                            variant="bodyMediumMedium"
                                            className="actionableList__bulkSelectedLabel ellipsis-text"
                                        >
                                            {mergedTexts.bulkSelectedItemsLabel}
                                        </Text>
                                    </Tooltip>
                                </div>
                                <Text
                                    as="span"
                                    variant="bodyMediumMedium"
                                    className="actionableList__bulkSelectedCount"
                                >
                                    {selectedItemsCount}
                                </Text>
                            </div>
                        )}
                        <div className="actionableList__stats">
                            <Tooltip text={mergedTexts.filteredItemsLabel} isVisible={isFilteredItemsLabelTruncated}>
                                <Text
                                    ref={filteredItemsLabelRef}
                                    as="span"
                                    variant="bodyMediumMedium"
                                    className="actionableList__statsLabel ellipsis-text"
                                >
                                    {mergedTexts.filteredItemsLabel}
                                </Text>
                            </Tooltip>
                            <Text as="span" variant="bodyMediumMedium" className="actionableList__statsCount">
                                {filteredItemsCount}
                            </Text>
                            <Divider direction="vertical" className="actionableList__statsDivider" />
                            <Tooltip text={mergedTexts.totalItemsLabel} isVisible={isTotalItemsLabelTruncated}>
                                <Text
                                    ref={totalItemsLabelRef}
                                    as="span"
                                    variant="bodyMediumMedium"
                                    className="actionableList__statsLabel ellipsis-text"
                                >
                                    {mergedTexts.totalItemsLabel}
                                </Text>
                            </Tooltip>
                            <Text as="span" variant="bodyMediumMedium" className="actionableList__statsCount">
                                {totalItemsCount}
                            </Text>
                        </div>
                    </div>
                )}
            </div>
            {loading && (
                <div className="actionableList__state actionableList__state_loading">
                    <Loader text={mergedTexts.loadingTitle} size="xLarge" textPosition="below" />
                </div>
            )}
            <Scrollbar>
                {!loading && (
                    <>
                        {!hasData && (
                            <div
                                ref={showEmptyDropZone ? emptyDropRef : undefined}
                                className={classNames("actionableList__state", {
                                    actionableList__state_dropTarget: isEmptyDropActive
                                })}
                            >
                                <Empty
                                    size="small"
                                    appearance="noData"
                                    title={mergedTexts.noDataTitle}
                                    description={mergedTexts.noDataDescription}
                                    className="actionableList__empty"
                                />
                            </div>
                        )}

                        {hasData && !hasSearchResults && (
                            <div className="actionableList__state">
                                <Empty
                                    size="small"
                                    appearance="noResult"
                                    title={mergedTexts.noResultsTitle}
                                    description={mergedTexts.noResultsDescription}
                                    className="actionableList__empty"
                                />
                            </div>
                        )}

                        {hasData && hasSearchResults && (
                            <div className="actionableList__list">
                                <ActionableListNodeWrapper level={1}>
                                    {filteredItems.map((item) => (
                                        <RenderNode
                                            key={item.id}
                                            item={item}
                                            level={1}
                                            parentId="root"
                                            withCheckbox={withCheckbox}
                                            isDraggable={isDraggable}
                                            dragListId={dragListId}
                                            expandedIds={expandedIds}
                                            texts={mergedTexts}
                                            dropGap={dropGap}
                                            isSearchActive={searchValue.trim().length > 0}
                                            onToggleExpand={handleToggleExpand}
                                            onToggleCheck={handleToggleCheck}
                                            onDragTargetChange={handleDragTargetChange}
                                        />
                                    ))}
                                </ActionableListNodeWrapper>
                            </div>
                        )}
                    </>
                )}
            </Scrollbar>
        </div>
    );
};

export type {
    IActionableListItem,
    IActionableListProps,
    IActionableListTexts,
    ICrossListDropPayload
} from "./ActionableList.types";
export { ActionableList as default };
