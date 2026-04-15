import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
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

// Hooks
import useDebounceCallback from "@hooks/useDebounceCallback";

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
// Sub-components
import ActionableListItem, { type TDropGapEdge } from "./ActionableListItem/ActionableListItem";
import ActionableListNodeWrapper, {
    type TActionableListLevel
} from "./ActionableListNodeWrapper/ActionableListNodeWrapper";

interface IActionableListItem {
    /**
     * Unique item identifier.
     */
    id: string;
    /**
     * Main row title.
     */
    title: string;
    /**
     * Optional tooltip text for the info icon.
     */
    infoText?: string;
    /**
     * Child nodes — parent rows infer counts from `children.length` / subtree for the "Selected x/y" label.
     */
    children?: IActionableListItem[];
    /**
     * When this is a **boolean**, the row is **controlled**: keep `items` in sync via `onItemsChange` / `onItemCheck(item, checked, items)`.
     * When **omitted**, the list stores selection internally while you still pass normal `items` (id, title, infoText, children).
     */
    checked?: boolean;
}

interface IActionableListTexts {
    /**
     * Search field label.
     */
    searchLabel: string;
    /**
     * Search input placeholder.
     */
    searchPlaceholder: string;
    /**
     * Label before the bulk "selected items" count (toolbar row).
     */
    bulkSelectedItemsLabel: string;
    /**
     * Label for filtered items count.
     */
    filteredItemsLabel: string;
    /**
     * Label for total items count.
     */
    totalItemsLabel: string;
    /**
     * Prefix for selected/total row counter.
     */
    selectedItemsLabel: string;
    /**
     * Loading text near spinner.
     */
    loadingTitle: string;
    /**
     * Empty state title for no data.
     */
    noDataTitle: string;
    /**
     * Empty state description for no data.
     */
    noDataDescription: string;
    /**
     * Empty state title when search returns no results.
     */
    noResultsTitle: string;
    /**
     * Empty state description when search returns no results.
     */
    noResultsDescription: string;
    /**
     * Accessible label for expand/collapse button.
     */
    expandButtonAriaLabel: string;
}

interface IActionableListProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Tree items to render.
     */
    items?: IActionableListItem[];
    /**
     * Enables checkbox variant.
     */
    withCheckbox?: boolean;
    /**
     * Enables drag and drop variant.
     */
    draggable?: boolean;
    /**
     * Optional controlled loading state.
     */
    loading?: boolean;
    /**
     * Text and localization values.
     */
    texts?: Partial<IActionableListTexts>;
    /**
     * Emits whenever nested data changes (check/reorder).
     */
    onItemsChange?: (items: IActionableListItem[]) => void;
    /**
     * Emits when a checkbox toggles: the row from `items` (after update), branch `checked`, and full `items` tree.
     */
    onItemCheck?: (item: IActionableListItem, checked: boolean, items: IActionableListItem[]) => void;
    /**
     * Emits debounced search value.
     */
    onSearch?: (value: string) => void;
}

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
    expandedIds: Set<string>;
    texts: IActionableListTexts;
    dropGap: IDropGap | null;
    onToggleExpand: (id: string) => void;
    onToggleCheck: (id: string, checked: boolean) => void;
    onDropReorder: (sourceId: string, targetId: string) => void;
    onDragTargetChange: (targetId: string, edge: TDropGapEdge) => void;
}

const RenderNode: FC<IRenderNodeProps> = ({
    item,
    level,
    parentId,
    withCheckbox,
    isDraggable,
    expandedIds,
    texts,
    dropGap,
    onToggleExpand,
    onToggleCheck,
    onDropReorder,
    onDragTargetChange
}) => {
    const childCount = item.children?.length || 0;
    const canExpand = childCount > 0 && level < ACTIONABLE_LIST_MAX_NESTED_LEVEL;
    const isExpanded = canExpand ? expandedIds.has(item.id) : false;
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
                dropGapEdge={dropGapEdge}
                expandAriaLabel={texts.expandButtonAriaLabel}
                onToggleExpand={() => onToggleExpand(item.id)}
                onToggleCheck={(checked) => onToggleCheck(item.id, checked)}
                onDropReorder={(sourceId) => onDropReorder(sourceId, item.id)}
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
                                expandedIds={expandedIds}
                                texts={texts}
                                dropGap={dropGap}
                                onToggleExpand={onToggleExpand}
                                onToggleCheck={onToggleCheck}
                                onDropReorder={onDropReorder}
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
    loading = false,
    texts,
    onItemsChange,
    onItemCheck,
    onSearch
}) => {
    const mergedTexts = { ...ACTIONABLE_LIST_DEFAULT_TEXTS, ...texts };

    const [localItems, setLocalItems] = useState<IActionableListItem[]>(() => mergeItemsFromProps(items, []));
    const [searchValue, setSearchValue] = useState("");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [dropGap, setDropGap] = useState<IDropGap | null>(null);

    const handleDropReorderRef = useRef<(sourceId: string, targetId: string) => void>(() => {});
    const dropGapRef = useRef(dropGap);
    dropGapRef.current = dropGap;

    useEffect(() => {
        setLocalItems((prev) => mergeItemsFromProps(items, prev));
    }, [items]);

    useEffect(() => {
        setExpandedIds(getExpandedIdsFromItems(items));
    }, [items]);

    useEffect(() => {
        if (!isDraggable) return () => undefined;
        return monitorForElements({
            onDrop: ({ source }) => {
                const gap = dropGapRef.current;
                setDropGap(null);
                const { sourceId } = source.data;
                if (typeof sourceId === "string" && gap && sourceId !== gap.targetId) {
                    handleDropReorderRef.current(sourceId, gap.targetId);
                }
            }
        });
    }, [isDraggable]);

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
                                    label="Select all items"
                                    className="actionableList__selectAll"
                                />
                                <Text
                                    as="span"
                                    variant="bodyMediumMedium"
                                    className="actionableList__bulkSelectedLabel"
                                >
                                    {mergedTexts.bulkSelectedItemsLabel}
                                </Text>
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
                            <Text as="span" variant="bodyMediumMedium" className="actionableList__statsLabel">
                                {mergedTexts.filteredItemsLabel}
                            </Text>
                            <Text as="span" variant="bodyMediumMedium" className="actionableList__statsCount">
                                {filteredItemsCount}
                            </Text>
                            <Divider direction="vertical" className="actionableList__statsDivider" />
                            <Text as="span" variant="bodyMediumMedium" className="actionableList__statsLabel">
                                {mergedTexts.totalItemsLabel}
                            </Text>
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
                            <div className="actionableList__state">
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
                                            expandedIds={expandedIds}
                                            texts={mergedTexts}
                                            dropGap={dropGap}
                                            onToggleExpand={handleToggleExpand}
                                            onToggleCheck={handleToggleCheck}
                                            onDropReorder={handleDropReorder}
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

export type { IActionableListItem, IActionableListProps, IActionableListTexts };
export { ActionableList as default };
