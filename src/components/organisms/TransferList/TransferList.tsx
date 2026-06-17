import React, { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import { ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import type { IActionableListItem, ICrossListDropPayload } from "@components/molecules/ActionableList";
import ActionableList from "@components/molecules/ActionableList";

// Styles
import "./TransferList.scss";

import {
    applySelectionToTree,
    assertPanelCount,
    collectNodeIds,
    collectTreeIds,
    moveBetweenPanels,
    moveItemByDrag,
    TRANSFER_LIST_DEFAULT_TEXTS
} from "./TransferList.helpers";
import type { ITransferListChangePayload, ITransferListProps } from "./TransferList.types";

/**
 * Transfer List component enables users to move items between two to four actionable lists.
 */
const TransferList: FC<ITransferListProps> = ({ className, panels, draggable = false, texts, onChange }) => {
    assertPanelCount(panels);

    const mergedTexts = { ...TRANSFER_LIST_DEFAULT_TEXTS, ...texts };
    const isRTLMode = typeof document !== "undefined" && document.dir === "rtl";
    const ForwardIcon = isRTLMode ? ChevronLeft : ChevronRight;
    const BackwardIcon = isRTLMode ? ChevronRight : ChevronLeft;
    const isControlled = panels.every((panel) => panel.items !== undefined);

    const [uncontrolledPanelItems, setUncontrolledPanelItems] = useState<IActionableListItem[][]>(() =>
        panels.map((panel) => panel.defaultItems ?? [])
    );
    const [selectedIdsByPanel, setSelectedIdsByPanel] = useState<Set<string>[]>(() => panels.map(() => new Set()));

    const panelTreeIdSignature = useMemo(
        () =>
            (isControlled ? panels.map((panel) => panel.items ?? []) : uncontrolledPanelItems)
                .map((items) => collectTreeIds(items).sort().join(","))
                .join("|"),
        [isControlled, panels, uncontrolledPanelItems]
    );

    const resolvedPanelItems = useMemo(
        () => (isControlled ? panels.map((panel) => panel.items ?? []) : uncontrolledPanelItems),
        [isControlled, panels, uncontrolledPanelItems, panelTreeIdSignature]
    );

    const panelViewItems = useMemo(
        () =>
            resolvedPanelItems.map((items, index) =>
                applySelectionToTree(items, selectedIdsByPanel[index] ?? new Set())
            ),
        [resolvedPanelItems, selectedIdsByPanel]
    );

    const emitChange = useCallback(
        (payload: ITransferListChangePayload) => {
            if (!isControlled) {
                setUncontrolledPanelItems(payload.panels);
            }
            onChange?.(payload);
        },
        [isControlled, onChange]
    );

    const updateSelection = (item: IActionableListItem, checked: boolean, panelIndex: number) => {
        const branchIds = collectNodeIds(item);
        setSelectedIdsByPanel((prev) =>
            prev.map((set, index) => {
                if (index !== panelIndex) return set;
                const next = new Set(set);
                branchIds.forEach((id) => {
                    if (checked) next.add(id);
                    else next.delete(id);
                });
                return next;
            })
        );
    };

    const handleSelectAll = (checked: boolean, items: IActionableListItem[], panelIndex: number) => {
        if (!checked) {
            setSelectedIdsByPanel((prev) => prev.map((set, index) => (index === panelIndex ? new Set() : set)));
            return;
        }
        const allIds = items.flatMap((item) => collectNodeIds(item));
        setSelectedIdsByPanel((prev) => prev.map((set, index) => (index === panelIndex ? new Set(allIds) : set)));
    };

    useEffect(() => {
        setSelectedIdsByPanel((prev) => {
            const next = resolvedPanelItems.map((items, index) => {
                const panelIds = new Set(collectTreeIds(items));
                const current = prev[index] ?? new Set();
                return new Set(Array.from(current).filter((id) => panelIds.has(id)));
            });

            const isUnchanged = next.every((set, index) => {
                const previous = prev[index] ?? new Set();
                if (set.size !== previous.size) return false;
                return Array.from(set).every((id) => previous.has(id));
            });

            return isUnchanged ? prev : next;
        });
    }, [panelTreeIdSignature, resolvedPanelItems]);

    const handleMove = (fromPanelIndex: number, toPanelIndex: number) => {
        const selectedIds = selectedIdsByPanel[fromPanelIndex];
        if (!selectedIds?.size) return;

        const sourceItems = resolvedPanelItems[fromPanelIndex];
        const targetItems = resolvedPanelItems[toPanelIndex];
        const {
            sourceItems: nextSource,
            targetItems: nextTarget,
            movedIds
        } = moveBetweenPanels(sourceItems, targetItems, selectedIds);
        if (!movedIds.length) return;

        const nextPanels = resolvedPanelItems.map((items, index) => {
            if (index === fromPanelIndex) return nextSource;
            if (index === toPanelIndex) return nextTarget;
            return items;
        });

        setSelectedIdsByPanel((prev) => prev.map((set, index) => (index === fromPanelIndex ? new Set() : set)));

        emitChange({
            fromPanelIndex,
            toPanelIndex,
            direction: toPanelIndex > fromPanelIndex ? "forward" : "backward",
            movedIds,
            panels: nextPanels
        });
    };

    const handlePanelItemsChange = (panelIndex: number, items: IActionableListItem[]) => {
        const nextPanels = resolvedPanelItems.map((panelItems, index) => (index === panelIndex ? items : panelItems));
        emitChange({
            fromPanelIndex: panelIndex,
            toPanelIndex: panelIndex,
            direction: "forward",
            movedIds: [],
            panels: nextPanels
        });
    };

    const handleCrossListDrop = ({
        sourceListId,
        targetListId,
        sourceId,
        targetId,
        edge,
        isEmptyTarget
    }: ICrossListDropPayload) => {
        const fromPanelIndex = panels.findIndex(({ id }) => id === sourceListId);
        const toPanelIndex = panels.findIndex(({ id }) => id === targetListId);
        if (fromPanelIndex < 0 || toPanelIndex < 0 || fromPanelIndex === toPanelIndex) return;

        const { sourceItems, targetItems, movedIds } = moveItemByDrag(
            resolvedPanelItems[fromPanelIndex],
            resolvedPanelItems[toPanelIndex],
            sourceId,
            targetId,
            edge,
            isEmptyTarget
        );
        if (!movedIds.length) return;

        const nextPanels = resolvedPanelItems.map((items, index) => {
            if (index === fromPanelIndex) return sourceItems;
            if (index === toPanelIndex) return targetItems;
            return items;
        });

        emitChange({
            fromPanelIndex,
            toPanelIndex,
            direction: toPanelIndex > fromPanelIndex ? "forward" : "backward",
            movedIds,
            panels: nextPanels
        });
    };

    const panelCount = panels.length;

    return (
        <div className={classNames("transferList", `transferList_panels${panelCount}`, className)}>
            {panels.map((panel, panelIndex) => (
                <Fragment key={panel.id}>
                    <div className="transferList__panel">
                        <ActionableList
                            className="transferList__actionableList"
                            withCheckbox
                            draggable={draggable}
                            dragListId={draggable ? panel.id : undefined}
                            items={panelViewItems[panelIndex]}
                            texts={panel.texts}
                            onItemCheck={(item, checked) => updateSelection(item, checked, panelIndex)}
                            onSelectAllChange={(checked, items) => handleSelectAll(checked, items, panelIndex)}
                            onItemsChange={draggable ? (items) => handlePanelItemsChange(panelIndex, items) : undefined}
                            onCrossListDrop={draggable ? handleCrossListDrop : undefined}
                        />
                    </div>

                    {panelIndex < panelCount - 1 && (
                        <div className="transferList__controls">
                            <Button
                                size="medium"
                                appearance="secondary"
                                layout="text"
                                Icon={ForwardIcon}
                                disabled={(selectedIdsByPanel[panelIndex]?.size ?? 0) === 0}
                                onClick={() => handleMove(panelIndex, panelIndex + 1)}
                                aria-label={mergedTexts.moveForwardAriaLabel}
                            />
                            <Button
                                size="medium"
                                appearance="secondary"
                                layout="text"
                                Icon={BackwardIcon}
                                disabled={(selectedIdsByPanel[panelIndex + 1]?.size ?? 0) === 0}
                                onClick={() => handleMove(panelIndex + 1, panelIndex)}
                                aria-label={mergedTexts.moveBackwardAriaLabel}
                            />
                        </div>
                    )}
                </Fragment>
            ))}
        </div>
    );
};

export { TransferList as default };
