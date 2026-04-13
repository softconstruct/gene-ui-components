import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";

import type { IActionableListItem, IActionableListTexts } from "./ActionableList";
import type { TActionableListLevel } from "./ActionableListNodeWrapper/ActionableListNodeWrapper";

export const ACTIONABLE_LIST_MAX_NESTED_LEVEL: TActionableListLevel = 5;
export const ACTIONABLE_LIST_SEARCH_DEBOUNCE_MS = 300;

export const ACTIONABLE_LIST_DEFAULT_TEXTS: IActionableListTexts = {
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

export const nextLevel = (level: TActionableListLevel, max: TActionableListLevel): TActionableListLevel => {
    if (level >= max) return max;
    if (level === 1) return 2;
    if (level === 2) return 3;
    if (level === 3) return 4;
    return 5;
};

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

export const mergeItemsFromProps = (
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

export const countAllItems = (items: IActionableListItem[]): number => {
    return items.reduce((acc, item) => acc + 1 + countAllItems(item.children || []), 0);
};

export const findItemById = (nodes: IActionableListItem[], targetId: string): IActionableListItem | undefined => {
    const direct = nodes.find((node) => node.id === targetId);
    if (direct !== undefined) return direct;
    return nodes.reduce<IActionableListItem | undefined>((found, node) => {
        if (found !== undefined) return found;
        if (!node.children?.length) return undefined;
        return findItemById(node.children, targetId);
    }, undefined);
};

export const updateItemById = (
    items: IActionableListItem[],
    targetId: string,
    updater: (item: IActionableListItem) => IActionableListItem
): IActionableListItem[] => {
    return items.map((item) => {
        if (item.id === targetId) return updater(item);
        if (!item.children?.length) return item;
        return { ...item, children: updateItemById(item.children, targetId, updater) };
    });
};

export const applyCheckedToBranch = (item: IActionableListItem, checked: boolean): IActionableListItem => {
    return {
        ...item,
        checked,
        children: item.children?.map((child: IActionableListItem) => applyCheckedToBranch(child, checked))
    };
};

export const filterTree = (items: IActionableListItem[], query: string): IActionableListItem[] => {
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

export const reorderInTree = (
    items: IActionableListItem[],
    sourceId: string,
    targetId: string
): IActionableListItem[] => {
    const siblingResult = reorderSiblingsById(items, sourceId, targetId);
    if (siblingResult !== items) return siblingResult;
    return items.map((item) => {
        if (!item.children?.length) return item;
        return { ...item, children: reorderInTree(item.children, sourceId, targetId) };
    });
};

export const getExpandedIdsFromItems = (items: IActionableListItem[]): Set<string> => {
    const ids = new Set<string>();
    const walk = (nodes: IActionableListItem[]) => {
        nodes.forEach((node) => {
            if (node.children?.length) {
                ids.add(node.id);
                walk(node.children);
            }
        });
    };
    walk(items);
    return ids;
};
