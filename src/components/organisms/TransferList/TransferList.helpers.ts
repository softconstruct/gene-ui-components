import type { IActionableListItem } from "@components/molecules/ActionableList";

import type { ITransferListTexts } from "./TransferList.types";

export const TRANSFER_LIST_DEFAULT_TEXTS: ITransferListTexts = {
    leftTitle: "Source",
    rightTitle: "Selected",
    moveToTargetAriaLabel: "Move selected to target",
    moveToSourceAriaLabel: "Move selected to source"
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
