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
     * Child nodes — parent rows infer counts from `children.length` / subtree for the “Selected x/y” label.
     */
    children?: IActionableListItem[];
    /**
     * When this is a **boolean**, the row is **controlled**: keep `items` in sync via `onItemsChange` / `onItemCheck(item, checked, items)`.
     * When **omitted**, the list stores selection internally while you still pass normal `items` (id, title, infoText, children).
     */
    checked?: boolean;
}

/** Minimal tree shape for selection counts — full `IActionableListItem` nodes are assignable. */
interface IActionableListTreeNode {
    checked?: boolean;
    children?: IActionableListTreeNode[];
}

interface IActionableListNodeMeta {
    /** Subtree size including this node (checkbox checked / indeterminate). */
    total: number;
    selected: number;
    /** All nodes under this node (excludes self) — “Selected x/y” denominator. */
    descendantsTotal: number;
    descendantsSelected: number;
}

function getActionableListNodeMeta(node: IActionableListTreeNode): IActionableListNodeMeta {
    const children = node.children || [];
    const childMeta = children.reduce(
        (acc, child) => {
            const meta = getActionableListNodeMeta(child);
            return {
                total: acc.total + meta.total,
                selected: acc.selected + meta.selected
            };
        },
        { total: 0, selected: 0 }
    );
    return {
        total: childMeta.total + 1,
        selected: childMeta.selected + (node.checked ? 1 : 0),
        descendantsTotal: childMeta.total,
        descendantsSelected: childMeta.selected
    };
}

function actionableListNodeMetaToSelectionProps(meta: IActionableListNodeMeta): {
    selectedCount: number;
    totalCount: number;
    descendantsSelectedCount: number;
    descendantsTotalCount: number;
} {
    return {
        selectedCount: meta.selected,
        totalCount: meta.total,
        descendantsSelectedCount: meta.descendantsSelected,
        descendantsTotalCount: meta.descendantsTotal
    };
}

/** True when every leaf under `item` is checked (parent rows count as selected if all child subtrees are fully selected). */
function isSubtreeFullySelected(item: IActionableListItem): boolean {
    const children = item.children || [];
    if (children.length === 0) return !!item.checked;
    return children.every((child) => isSubtreeFullySelected(child));
}

function isAnySelectionInSubtree(item: IActionableListItem): boolean {
    if (item.checked) return true;
    const children = item.children || [];
    return children.some((child) => isAnySelectionInSubtree(child));
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
     * Emits when a checkbox toggles: the row from `items` (after update), branch `checked`, and full `items` tree.
     */
    onItemCheck?: (item: IActionableListItem, checked: boolean, items: IActionableListItem[]) => void;
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

const clampDepth = (level: number, max: number) => Math.min(Math.max(level, 1), max);

const indexItemsById = (
    nodes: IActionableListItem[],
    map: Map<string, IActionableListItem> = new Map()
): Map<string, IActionableListItem> => {
    nodes.forEach((node) => {
        map.set(node.id, node);
        if (node.children?.length) indexItemsById(node.children, map);
    });
    return map;
};

/**
 * Reconciles incoming `items` from props with previous list state: explicit `checked` from props wins (controlled);
 * otherwise previous selection is kept (uncontrolled — omit `checked` on your data).
 */
const mergeItemsFromProps = (
    incoming: IActionableListItem[],
    previous: IActionableListItem[]
): IActionableListItem[] => {
    const prevById = indexItemsById(previous);
    const merge = (nodes: IActionableListItem[]): IActionableListItem[] =>
        nodes.map((node) => {
            const prev = prevById.get(node.id);
            let checked = false;
            if (typeof node.checked === "boolean") {
                checked = node.checked;
            } else if (prev !== undefined && typeof prev.checked === "boolean") {
                checked = prev.checked;
            }
            return {
                ...node,
                checked,
                children: node.children?.length ? merge(node.children) : undefined
            };
        });
    return merge(incoming);
};

const countAllItems = (items: IActionableListItem[]): number =>
    items.reduce((acc, item) => acc + 1 + countAllItems(item.children || []), 0);

const findItemById = (nodes: IActionableListItem[], targetId: string): IActionableListItem | undefined => {
    const direct = nodes.find((node) => node.id === targetId);
    if (direct !== undefined) return direct;
    return nodes.reduce<IActionableListItem | undefined>((found, node) => {
        if (found !== undefined) return found;
        if (!node.children?.length) return undefined;
        return findItemById(node.children, targetId);
    }, undefined);
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
    const branchFullySelected = isSubtreeFullySelected(item);
    const branchIndeterminate = !branchFullySelected && isAnySelectionInSubtree(item);
    const directChildTotal = item.children?.length ?? 0;
    const directChildFullySelected = item.children?.filter((child) => isSubtreeFullySelected(child)).length ?? 0;

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
    onItemCheck,
    onSearch
}) => {
    const mergedTexts = { ...defaultTexts, ...texts };

    const [localItems, setLocalItems] = useState<IActionableListItem[]>(() => mergeItemsFromProps(items, []));
    const [searchValue, setSearchValue] = useState("");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setLocalItems((prev) => mergeItemsFromProps(items, prev));
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
        const nextItems = updateItemById(localItems, id, (item) => applyCheckedToBranch(item, checked));
        syncItems(nextItems);
        const toggled = findItemById(nextItems, id);
        if (toggled !== undefined) {
            onItemCheck?.(toggled, checked, nextItems);
        }
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

export {
    actionableListNodeMetaToSelectionProps,
    getActionableListNodeMeta,
    IActionableListProps,
    IActionableListItem,
    IActionableListTexts,
    IActionableListNodeMeta,
    IActionableListTreeNode,
    ActionableList as default
};
