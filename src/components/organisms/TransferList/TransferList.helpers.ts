import type { IActionableListItem } from "@components/molecules/ActionableList";

import type { ITransferListPanel, ITransferListTexts } from "./TransferList.types";

export const TRANSFER_LIST_MIN_PANELS = 2;
export const TRANSFER_LIST_MAX_PANELS = 4;

export const TRANSFER_LIST_DEFAULT_TEXTS: ITransferListTexts = {
    moveForwardAriaLabel: "Move selected to next panel",
    moveBackwardAriaLabel: "Move selected to previous panel"
};

export const assertPanelCount = (panels: ITransferListPanel[]): void => {
    if (panels.length < TRANSFER_LIST_MIN_PANELS || panels.length > TRANSFER_LIST_MAX_PANELS) {
        throw new Error(
            `TransferList requires between ${TRANSFER_LIST_MIN_PANELS} and ${TRANSFER_LIST_MAX_PANELS} panels, received ${panels.length}.`
        );
    }
};

export const collectNodeIds = (item: IActionableListItem): string[] => [
    item.id,
    ...(item.children?.flatMap((child) => collectNodeIds(child)) ?? [])
];

export const collectTreeIds = (items: IActionableListItem[]): string[] => items.flatMap((item) => collectNodeIds(item));

export const applySelectionToTree = (items: IActionableListItem[], selectedIds: Set<string>): IActionableListItem[] =>
    items.map((item) => ({
        ...item,
        checked: selectedIds.has(item.id),
        children: item.children?.length ? applySelectionToTree(item.children, selectedIds) : undefined
    }));

interface IPartitionResult {
    remaining: IActionableListItem[];
    moved: IActionableListItem[];
    movedIds: string[];
}

export const partitionTreeByIds = (items: IActionableListItem[], selectedIds: Set<string>): IPartitionResult => {
    const remaining: IActionableListItem[] = [];
    const moved: IActionableListItem[] = [];
    const movedIds = new Set<string>();

    const walk = (node: IActionableListItem): IActionableListItem | null => {
        if (selectedIds.has(node.id)) {
            collectNodeIds(node).forEach((id) => movedIds.add(id));
            moved.push(node);
            return null;
        }

        if (!node.children?.length) {
            return node;
        }

        const keptChildren: IActionableListItem[] = [];
        node.children.forEach((child) => {
            const keptChild = walk(child);
            if (keptChild) keptChildren.push(keptChild);
        });

        return {
            ...node,
            children: keptChildren.length ? keptChildren : undefined
        };
    };

    items.forEach((item) => {
        const keptItem = walk(item);
        if (keptItem) remaining.push(keptItem);
    });

    return { remaining, moved, movedIds: Array.from(movedIds) };
};

const clearChecked = (item: IActionableListItem): IActionableListItem => ({
    ...item,
    checked: false,
    children: item.children?.map((child) => clearChecked(child))
});

export const mergeMovedItems = (target: IActionableListItem[], moved: IActionableListItem[]): IActionableListItem[] => {
    if (!moved.length) return target;
    const existingIds = new Set<string>(collectTreeIds(target));
    const dedupedMoved = moved
        .filter((item) => !existingIds.has(item.id))
        .map((item) => {
            const cleared = clearChecked(item);
            collectNodeIds(cleared).forEach((id) => existingIds.add(id));
            return cleared;
        });
    return [...target, ...dedupedMoved];
};

export const insertAtRoot = (
    items: IActionableListItem[],
    item: IActionableListItem,
    targetId: string,
    edge: "top" | "bottom" = "bottom"
): IActionableListItem[] => {
    const targetIndex = items.findIndex((node) => node.id === targetId);
    if (targetIndex === -1) return [...items, item];
    const insertIndex = edge === "top" ? targetIndex : targetIndex + 1;
    const next = [...items];
    next.splice(insertIndex, 0, item);
    return next;
};

interface IMoveBetweenPanelsResult {
    sourceItems: IActionableListItem[];
    targetItems: IActionableListItem[];
    movedIds: string[];
}

export const moveBetweenPanels = (
    sourceItems: IActionableListItem[],
    targetItems: IActionableListItem[],
    selectedIds: Set<string>
): IMoveBetweenPanelsResult => {
    const { remaining, moved, movedIds } = partitionTreeByIds(sourceItems, selectedIds);
    if (!moved.length) {
        return { sourceItems, targetItems, movedIds: [] };
    }
    return {
        sourceItems: remaining,
        targetItems: mergeMovedItems(targetItems, moved),
        movedIds
    };
};

export const moveItemByDrag = (
    sourceItems: IActionableListItem[],
    targetItems: IActionableListItem[],
    sourceId: string,
    targetId?: string,
    edge: "top" | "bottom" = "bottom",
    isEmptyTarget = false
): IMoveBetweenPanelsResult => {
    const { remaining, moved, movedIds } = partitionTreeByIds(sourceItems, new Set([sourceId]));
    if (!moved.length) {
        return { sourceItems, targetItems, movedIds: [] };
    }
    const cleared = moved.map((item) => clearChecked(item));
    const existingIds = new Set(collectTreeIds(targetItems));
    const deduped = cleared.filter((item) => !existingIds.has(item.id));
    if (!deduped.length) {
        return { sourceItems: remaining, targetItems, movedIds: [] };
    }

    if (isEmptyTarget || !targetItems.length || !targetId) {
        return {
            sourceItems: remaining,
            targetItems: mergeMovedItems(targetItems, deduped),
            movedIds
        };
    }

    let nextTarget = targetItems;
    deduped.forEach((item) => {
        nextTarget = insertAtRoot(nextTarget, item, targetId, edge);
    });
    return { sourceItems: remaining, targetItems: nextTarget, movedIds };
};
