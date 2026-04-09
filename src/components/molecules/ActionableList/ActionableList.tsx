import React, { FC, useEffect, useMemo, useState } from "react";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import classNames from "classnames";

import { Magnifier } from "@geneui/icons";

// Components
import Divider from "@components/atoms/Divider";
import Loader from "@components/atoms/Loader";
import Text from "@components/atoms/Text";
import Empty from "@components/molecules/Empty";
import TextField from "@components/molecules/TextField";

// Hooks
import useDebounceCallback from "@hooks/useDebounceCallback";

// Styles
import "./ActionableList.scss";

// Sub-components
import ActionableListItem from "./ActionableListItem/ActionableListItem";
import ActionableListNodeWrapper from "./ActionableListNodeWrapper";

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
     * Child nodes.
     */
    children?: IActionableListItem[];
    /**
     * Initial checked state for checkbox variant.
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
     * Maximum tree depth (1-5).
     */
    maxNestedLevel?: 1 | 2 | 3 | 4 | 5;
    /**
     * Search debounce timeout in ms.
     */
    searchDebounceMs?: number;
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
     * Emits debounced search value.
     */
    onSearch?: (value: string) => void;
}

const defaultTexts: IActionableListTexts = {
    searchLabel: "Label",
    searchPlaceholder: "Search",
    filteredItemsLabel: "Filtered items",
    totalItemsLabel: "Total items",
    selectedItemsLabel: "Selected",
    loadingTitle: "Loading Info",
    noDataTitle: "No Data Available",
    noDataDescription: "No data is available for display at this moment.",
    noResultsTitle: "No Results Found",
    noResultsDescription: "No results were found matching your criteria.",
    expandButtonAriaLabel: "Toggle nested items"
};

interface INodeMeta {
    total: number;
    selected: number;
}

const clampDepth = (level: number, max: number) => Math.min(Math.max(level, 1), max);

const countAllItems = (items: IActionableListItem[]): number =>
    items.reduce((acc, item) => acc + 1 + countAllItems(item.children || []), 0);

const getNodeMeta = (item: IActionableListItem): INodeMeta => {
    const children = item.children || [];
    const childMeta = children.reduce(
        (acc, child) => {
            const meta = getNodeMeta(child);
            return { total: acc.total + meta.total, selected: acc.selected + meta.selected };
        },
        { total: 0, selected: 0 }
    );
    return {
        total: childMeta.total + 1,
        selected: childMeta.selected + (item.checked ? 1 : 0)
    };
};

const updateItemById = (
    items: IActionableListItem[],
    targetId: string,
    updater: (item: IActionableListItem) => IActionableListItem
): IActionableListItem[] =>
    items.map((item) => {
        if (item.id === targetId) return updater(item);
        if (!item.children?.length) return item;
        return { ...item, children: updateItemById(item.children, targetId, updater) };
    });

const applyCheckedToBranch = (item: IActionableListItem, checked: boolean): IActionableListItem => ({
    ...item,
    checked,
    children: item.children?.map((child) => applyCheckedToBranch(child, checked))
});

const filterTree = (items: IActionableListItem[], query: string): IActionableListItem[] => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.reduce<IActionableListItem[]>((acc, item) => {
        const filteredChildren = filterTree(item.children || [], q);
        if (item.title.toLowerCase().includes(q) || filteredChildren.length > 0) {
            acc.push({ ...item, children: filteredChildren });
        }
        return acc;
    }, []);
};

const reorderSiblingsById = (
    items: IActionableListItem[],
    sourceId: string,
    targetId: string
): IActionableListItem[] => {
    const si = items.findIndex((n) => n.id === sourceId);
    const ti = items.findIndex((n) => n.id === targetId);
    if (si < 0 || ti < 0 || si === ti) return items;
    return reorder({ list: items, startIndex: si, finishIndex: ti });
};

const reorderInTree = (items: IActionableListItem[], sourceId: string, targetId: string): IActionableListItem[] => {
    const siblingResult = reorderSiblingsById(items, sourceId, targetId);
    if (siblingResult !== items) return siblingResult;
    return items.map((item) => {
        if (!item.children?.length) return item;
        return { ...item, children: reorderInTree(item.children, sourceId, targetId) };
    });
};

interface IRenderNodeProps {
    item: IActionableListItem;
    level: number;
    maxNestedLevel: number;
    withCheckbox: boolean;
    isDraggable: boolean;
    expandedIds: Set<string>;
    texts: IActionableListTexts;
    onToggleExpand: (id: string) => void;
    onToggleCheck: (id: string, checked: boolean) => void;
    onDropReorder: (sourceId: string, targetId: string) => void;
}

const RenderNode: FC<IRenderNodeProps> = ({
    item,
    level,
    maxNestedLevel,
    withCheckbox,
    isDraggable,
    expandedIds,
    texts,
    onToggleExpand,
    onToggleCheck,
    onDropReorder
}) => {
    const childCount = item.children?.length || 0;
    const canExpand = childCount > 0 && level < maxNestedLevel;
    const isExpanded = canExpand ? expandedIds.has(item.id) : false;
    const nodeMeta = getNodeMeta(item);

    const childLevel = clampDepth(level + 1, maxNestedLevel);

    return (
        <>
            <ActionableListItem
                id={item.id}
                title={item.title}
                level={level}
                infoText={item.infoText}
                isExpandable={canExpand}
                isExpanded={isExpanded}
                withCheckbox={withCheckbox}
                selectedCount={nodeMeta.selected}
                totalCount={nodeMeta.total}
                selectedLabel={texts.selectedItemsLabel}
                isDraggable={isDraggable}
                expandAriaLabel={texts.expandButtonAriaLabel}
                onToggleExpand={() => onToggleExpand(item.id)}
                onToggleCheck={(checked) => onToggleCheck(item.id, checked)}
                onDropReorder={(sourceId) => onDropReorder(sourceId, item.id)}
            />

            {canExpand && isExpanded && (
                <div className="actionableList__children">
                    <ActionableListNodeWrapper level={childLevel}>
                        {item.children?.map((child) => (
                            <RenderNode
                                key={child.id}
                                item={child}
                                level={childLevel}
                                maxNestedLevel={maxNestedLevel}
                                withCheckbox={withCheckbox}
                                isDraggable={isDraggable}
                                expandedIds={expandedIds}
                                texts={texts}
                                onToggleExpand={onToggleExpand}
                                onToggleCheck={onToggleCheck}
                                onDropReorder={onDropReorder}
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
    maxNestedLevel = 5,
    searchDebounceMs = 300,
    loading = false,
    texts,
    onItemsChange,
    onSearch
}) => {
    const mergedTexts = { ...defaultTexts, ...texts };

    const [localItems, setLocalItems] = useState<IActionableListItem[]>(items);
    const [searchValue, setSearchValue] = useState("");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    useEffect(() => {
        const ids = new Set<string>();
        const walk = (nodes: IActionableListItem[]) => {
            nodes.forEach((n) => {
                if (n.children?.length) {
                    ids.add(n.id);
                    walk(n.children);
                }
            });
        };
        walk(items);
        setExpandedIds(ids);
    }, [items]);

    const { debouncedCallback, clearDebounce } = useDebounceCallback((value: unknown) => {
        if (typeof value !== "string") return;
        onSearch?.(value);
    }, searchDebounceMs);

    useEffect(() => clearDebounce, [clearDebounce]);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        debouncedCallback(value);
    };

    const filteredItems = useMemo(() => filterTree(localItems, searchValue), [localItems, searchValue]);
    const totalItemsCount = useMemo(() => countAllItems(localItems), [localItems]);
    const filteredItemsCount = useMemo(() => countAllItems(filteredItems), [filteredItems]);

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
        syncItems(updateItemById(localItems, id, (item) => applyCheckedToBranch(item, checked)));
    };

    const handleDropReorder = (sourceId: string, targetId: string) => {
        if (sourceId === targetId) return;
        syncItems(reorderInTree(localItems, sourceId, targetId));
    };

    const hasData = totalItemsCount > 0;
    const hasSearchResults = filteredItemsCount > 0;

    return (
        <div className={classNames("actionableList", className)}>
            <TextField
                label={mergedTexts.searchLabel}
                placeholder={mergedTexts.searchPlaceholder}
                value={searchValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                IconBefore={Magnifier}
                className="actionableList__search"
            />

            {loading && (
                <div className="actionableList__state actionableList__state_loading">
                    <Loader text={mergedTexts.loadingTitle} size="xLarge" />
                </div>
            )}

            {!loading && (
                <>
                    <div className="actionableList__stats">
                        <Text as="span" variant="bodyMediumMedium">
                            {`${mergedTexts.filteredItemsLabel} ${filteredItemsCount}`}
                        </Text>
                        <Divider direction="vertical" className="actionableList__statsDivider" />
                        <Text as="span" variant="bodyMediumMedium">
                            {`${mergedTexts.totalItemsLabel} ${totalItemsCount}`}
                        </Text>
                    </div>

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
                                        maxNestedLevel={maxNestedLevel}
                                        withCheckbox={withCheckbox}
                                        isDraggable={isDraggable}
                                        expandedIds={expandedIds}
                                        texts={mergedTexts}
                                        onToggleExpand={handleToggleExpand}
                                        onToggleCheck={handleToggleCheck}
                                        onDropReorder={handleDropReorder}
                                    />
                                ))}
                            </ActionableListNodeWrapper>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export { IActionableListProps, IActionableListItem, IActionableListTexts, ActionableList as default };
