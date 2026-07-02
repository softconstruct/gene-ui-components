import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

import type { IActionableListItem, IActionableListTexts } from "./ActionableList.types";
import type { TActionableListLevel } from "./ActionableListNodeWrapper/ActionableListNodeWrapper";

export const ACTIONABLE_LIST_MAX_NESTED_LEVEL: TActionableListLevel = 5;
export const ACTIONABLE_LIST_SEARCH_DEBOUNCE_MS = 300;

export const ACTIONABLE_LIST_DEFAULT_TEXTS: IActionableListTexts = {
    searchLabel: "Label",
    searchPlaceholder: "Search",
    bulkSelectedItemsLabel: "Selected items",
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

export const isSubtreeFullySelected = (item: IActionableListItem): boolean => {
    const children = item.children || [];
    if (children.length === 0) return !!item.checked;
    return children.every((child: IActionableListItem) => isSubtreeFullySelected(child));
};

export const isAnySelectionInSubtree = (item: IActionableListItem): boolean => {
    if (item.checked) return true;
    const children = item.children || [];
    return children.some((child: IActionableListItem) => isAnySelectionInSubtree(child));
};

export const nextLevel = (level: TActionableListLevel): TActionableListLevel =>
    Math.min(level + 1, ACTIONABLE_LIST_MAX_NESTED_LEVEL) as TActionableListLevel;

export const isGroupItem = (item: IActionableListItem): boolean => Array.isArray(item.children);

export const mergeItemsFromProps = (
    incoming: IActionableListItem[],
    previous: IActionableListItem[]
): IActionableListItem[] => {
    const prevById = new Map<string, IActionableListItem>();

    const index = (nodes: IActionableListItem[]) => {
        nodes.forEach((node) => {
            prevById.set(node.id, node);
            if (node.children?.length) index(node.children);
        });
    };
    index(previous);

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
                children: isGroupItem(node) ? merge(node.children ?? []) : undefined
            };
        });

    return merge(incoming);
};

export const countAllItems = (items: IActionableListItem[]): number =>
    items.reduce((acc, item) => acc + 1 + countAllItems(item.children || []), 0);

/** Counts leaf nodes only — parent rows with children are grouping headers, not items. */
export const countLeafItems = (items: IActionableListItem[]): number =>
    items.reduce((acc, item) => {
        if (isGroupItem(item)) return acc + countLeafItems(item.children ?? []);
        return acc + 1;
    }, 0);

export const countCheckedItems = (items: IActionableListItem[]): number =>
    items.reduce((acc, item) => {
        if (isGroupItem(item)) return acc + countCheckedItems(item.children ?? []);
        return acc + (item.checked ? 1 : 0);
    }, 0);

/** Counts checked leaves in `items` whose ids are in `scopeLeafIds`. */
export const countCheckedLeavesInScope = (items: IActionableListItem[], scopeLeafIds: ReadonlySet<string>): number =>
    items.reduce((acc, item) => {
        if (isGroupItem(item)) return acc + countCheckedLeavesInScope(item.children ?? [], scopeLeafIds);
        return acc + (item.checked && scopeLeafIds.has(item.id) ? 1 : 0);
    }, 0);

export const findItemById = (nodes: IActionableListItem[], targetId: string): IActionableListItem | undefined => {
    const direct = nodes.find((node) => node.id === targetId);
    if (direct !== undefined) return direct;

    let nested: IActionableListItem | undefined;
    nodes.some((node) => {
        if (!node.children?.length) return false;
        nested = findItemById(node.children, targetId);
        return nested !== undefined;
    });
    return nested;
};

export const updateItemById = (
    items: IActionableListItem[],
    targetId: string,
    updater: (item: IActionableListItem) => IActionableListItem
): IActionableListItem[] =>
    items.map((item) => {
        if (item.id === targetId) return updater(item);
        if (!item.children?.length) return item;
        return { ...item, children: updateItemById(item.children, targetId, updater) };
    });

export const applyCheckedToBranch = (item: IActionableListItem, checked: boolean): IActionableListItem => ({
    ...item,
    checked,
    children: item.children?.map((child: IActionableListItem) => applyCheckedToBranch(child, checked))
});

export const collectLeafIds = (items: IActionableListItem[]): string[] =>
    items.flatMap((item) => (isGroupItem(item) ? collectLeafIds(item.children ?? []) : [item.id]));

export const applyCheckedToLeavesById = (
    items: IActionableListItem[],
    leafIds: ReadonlySet<string>,
    checked: boolean
): IActionableListItem[] =>
    items.map((item) => {
        if (isGroupItem(item)) {
            return {
                ...item,
                children: applyCheckedToLeavesById(item.children ?? [], leafIds, checked)
            };
        }
        return leafIds.has(item.id) ? { ...item, checked } : item;
    });

export const filterTree = (items: IActionableListItem[], query: string): IActionableListItem[] => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.reduce<IActionableListItem[]>((acc, item) => {
        const filteredChildren = isGroupItem(item) ? filterTree(item.children ?? [], q) : [];
        if (item.title.toLowerCase().includes(q) || filteredChildren.length > 0) {
            acc.push({
                ...item,
                children: isGroupItem(item) ? filteredChildren : undefined
            });
        }
        return acc;
    }, []);
};

const reorderSiblingsById = (
    items: IActionableListItem[],
    sourceId: string,
    targetId: string,
    edge: "top" | "bottom"
): IActionableListItem[] => {
    const si = items.findIndex((n) => n.id === sourceId);
    const ti = items.findIndex((n) => n.id === targetId);
    if (si < 0 || ti < 0 || si === ti) return items;

    let finishIndex = edge === "top" ? ti : ti + 1;
    if (si < finishIndex) finishIndex -= 1;

    return reorder({ list: items, startIndex: si, finishIndex });
};

export const reorderInTree = (
    items: IActionableListItem[],
    sourceId: string,
    targetId: string,
    edge: "top" | "bottom" = "bottom"
): IActionableListItem[] => {
    const siblingResult = reorderSiblingsById(items, sourceId, targetId, edge);
    if (siblingResult !== items) return siblingResult;
    return items.map((item) => {
        if (!item.children?.length) return item;
        return { ...item, children: reorderInTree(item.children, sourceId, targetId, edge) };
    });
};

export const getExpandedIdsFromItems = (items: IActionableListItem[], ids: Set<string> = new Set()): Set<string> => {
    items.forEach((node) => {
        if (node.children?.length) {
            ids.add(node.id);
            getExpandedIdsFromItems(node.children, ids);
        }
    });
    return ids;
};
