import React, { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import { ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import type { IActionableListItem } from "@components/molecules/ActionableList";
import ActionableList from "@components/molecules/ActionableList";

// Styles
import "./TransferList.scss";

import {
    applySelectionToTree,
    collectNodeIds,
    mergeMovedItems,
    partitionTreeByIds,
    TRANSFER_LIST_DEFAULT_TEXTS
} from "./TransferList.helpers";
import type { ITransferListProps, TTransferListDirection } from "./TransferList.types";

/**
 * Transfer List component enables users to move items between two or more lists, typically representing available and selected options.
 */
const TransferList: FC<ITransferListProps> = ({
    className,
    sourceItems,
    targetItems,
    defaultSourceItems = [],
    defaultTargetItems = [],
    texts,
    onChange
}) => {
    const [uncontrolledSourceItems, setUncontrolledSourceItems] = useState<IActionableListItem[]>(
        () => defaultSourceItems || []
    );
    const [uncontrolledTargetItems, setUncontrolledTargetItems] = useState<IActionableListItem[]>(
        () => defaultTargetItems || []
    );
    const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(new Set());
    const [selectedTargetIds, setSelectedTargetIds] = useState<Set<string>>(new Set());

    const mergedTexts = { ...TRANSFER_LIST_DEFAULT_TEXTS, ...texts };
    const isControlled = sourceItems !== undefined && targetItems !== undefined;
    const resolvedSourceItems = isControlled ? sourceItems : uncontrolledSourceItems;
    const resolvedTargetItems = isControlled ? targetItems : uncontrolledTargetItems;

    const sourceViewItems = useMemo(
        () => applySelectionToTree(resolvedSourceItems, selectedSourceIds),
        [resolvedSourceItems, selectedSourceIds]
    );
    const targetViewItems = useMemo(
        () => applySelectionToTree(resolvedTargetItems, selectedTargetIds),
        [resolvedTargetItems, selectedTargetIds]
    );

    const updateSelection = (
        item: IActionableListItem,
        checked: boolean,
        setSelectedIds: Dispatch<SetStateAction<Set<string>>>
    ) => {
        const branchIds = collectNodeIds(item);
        setSelectedIds((prev) => {
            const next = new Set(prev);
            branchIds.forEach((id) => {
                if (checked) next.add(id);
                else next.delete(id);
            });
            return next;
        });
    };

    const handleSelectAll = (
        checked: boolean,
        items: IActionableListItem[],
        setSelectedIds: Dispatch<SetStateAction<Set<string>>>
    ) => {
        if (!checked) {
            setSelectedIds(new Set());
            return;
        }
        const allIds = items.flatMap((item) => collectNodeIds(item));
        setSelectedIds(new Set(allIds));
    };

    useEffect(() => {
        const sourceIds = new Set(resolvedSourceItems.flatMap((item) => collectNodeIds(item)));
        setSelectedSourceIds((prev) => new Set(Array.from(prev).filter((id) => sourceIds.has(id))));

        const targetIds = new Set(resolvedTargetItems.flatMap((item) => collectNodeIds(item)));
        setSelectedTargetIds((prev) => new Set(Array.from(prev).filter((id) => targetIds.has(id))));
    }, [resolvedSourceItems, resolvedTargetItems]);

    const handleMove = (direction: TTransferListDirection) => {
        const isToTarget = direction === "toTarget";
        const sourceList = isToTarget ? resolvedSourceItems : resolvedTargetItems;
        const targetList = isToTarget ? resolvedTargetItems : resolvedSourceItems;
        const selectedIds = isToTarget ? selectedSourceIds : selectedTargetIds;

        if (selectedIds.size === 0) return;

        const { remaining, moved, movedIds } = partitionTreeByIds(sourceList, selectedIds);
        if (!moved.length) return;
        const mergedTarget = mergeMovedItems(targetList, moved);
        const nextSourceItems = isToTarget ? remaining : mergedTarget;
        const nextTargetItems = isToTarget ? mergedTarget : remaining;

        if (!isControlled) {
            setUncontrolledSourceItems(nextSourceItems);
            setUncontrolledTargetItems(nextTargetItems);
        }

        if (isToTarget) setSelectedSourceIds(new Set());
        else setSelectedTargetIds(new Set());

        onChange?.({
            direction,
            movedIds,
            sourceItems: nextSourceItems,
            targetItems: nextTargetItems
        });
    };

    return (
        <div className={classNames("transferList", className)}>
            <div className="transferList__panel">
                <Text as="span" variant="labelMediumMedium" className="transferList__title">
                    {mergedTexts.leftTitle}
                </Text>
                <ActionableList
                    withCheckbox
                    items={sourceViewItems}
                    texts={mergedTexts.listTexts}
                    onItemCheck={(item, checked) => updateSelection(item, checked, setSelectedSourceIds)}
                    onSelectAllChange={(checked, items) => handleSelectAll(checked, items, setSelectedSourceIds)}
                />
            </div>

            <div className="transferList__controls">
                <Button
                    size="medium"
                    appearance="secondary"
                    layout="text"
                    Icon={ChevronRight}
                    disabled={selectedSourceIds.size === 0}
                    onClick={() => handleMove("toTarget")}
                    aria-label={mergedTexts.moveToTargetAriaLabel}
                />
                <Button
                    size="medium"
                    appearance="secondary"
                    layout="text"
                    Icon={ChevronLeft}
                    disabled={selectedTargetIds.size === 0}
                    onClick={() => handleMove("toSource")}
                    aria-label={mergedTexts.moveToSourceAriaLabel}
                />
            </div>

            <div className="transferList__panel">
                <Text as="span" variant="labelMediumMedium" className="transferList__title">
                    {mergedTexts.rightTitle}
                </Text>
                <ActionableList
                    withCheckbox
                    items={targetViewItems}
                    texts={mergedTexts.listTexts}
                    onItemCheck={(item, checked) => updateSelection(item, checked, setSelectedTargetIds)}
                    onSelectAllChange={(checked, items) => handleSelectAll(checked, items, setSelectedTargetIds)}
                />
            </div>
        </div>
    );
};

export { TransferList as default };
