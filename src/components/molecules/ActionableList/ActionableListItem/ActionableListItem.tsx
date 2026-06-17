import React, { FC, useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import classNames from "classnames";

import { ChevronDown, ChevronRight, GripDots } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Info from "@components/atoms/Info";
import Text from "@components/atoms/Text";
import Checkbox from "@components/molecules/Checkbox";
import Tooltip from "@components/molecules/Tooltip";

// Hooks
import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./ActionableListItem.scss";

import DnDDragLayer from "../../../../_internal/components/DnDDragLayer/DnDDragLayer";
import type { TActionableListLevel } from "../ActionableListNodeWrapper/ActionableListNodeWrapper";

type TDropGapEdge = "top" | "bottom";

interface IActionableListItemProps {
    /**
     * Unique item identifier.
     */
    id: string;
    /**
     * Row title text.
     */
    title: string;
    /**
     * Current nesting depth (1-based).
     */
    level: TActionableListLevel;
    /**
     * Optional tooltip text for the info icon.
     */
    infoText?: string;
    /**
     * Whether the row has children and can be expanded.
     */
    isExpandable?: boolean;
    /**
     * Whether the row is currently expanded.
     */
    isExpanded?: boolean;
    /**
     * Whether to show a checkbox.
     */
    withCheckbox?: boolean;
    /**
     * When set, drives checkbox checked state from the list (with `checkboxIndeterminate`); overrides count-based fallback.
     */
    checkboxChecked?: boolean;
    /**
     * Tri-state: partial selection under this row; used together with `checkboxChecked`.
     */
    checkboxIndeterminate?: boolean;
    /**
     * Number of selected nodes in this row's subtree (including self), for checkbox when branch props are unset (e.g. Storybook).
     */
    selectedCount?: number;
    /**
     * Total nodes in this row's subtree including self — checkbox fallback when branch props are unset.
     */
    totalCount?: number;
    /**
     * "Selected x/y" numerator: typically direct children whose subtree is fully selected.
     */
    descendantsSelectedCount?: number;
    /**
     * "Selected x/y" denominator: typically direct child count. Zero hides the label (leaf rows).
     */
    descendantsTotalCount?: number;
    /**
     * Label prefix for the selected counter.
     */
    selectedLabel?: string;
    /**
     * Identifier of the parent group for same-sibling-group drop restriction.
     */
    parentId?: string;
    /**
     * Whether drag-and-drop handle is shown.
     */
    isDraggable?: boolean;
    /**
     * Which edge to show a drop gap on (controlled by parent list).
     */
    dropGapEdge?: TDropGapEdge | null;
    /**
     * Accessible label for expand/collapse toggle.
     */
    expandAriaLabel?: string;
    /**
     * Callback when expand/collapse toggle is clicked.
     */
    onToggleExpand?: () => void;
    /**
     * Callback when checkbox value changes.
     */
    onToggleCheck?: (checked: boolean) => void;
    /**
     * Reports that this row is the current drop target with the given edge.
     */
    onDragTargetChange?: (edge: TDropGapEdge) => void;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

const ActionableListItem: FC<IActionableListItemProps> = ({
    id,
    title,
    level,
    infoText,
    isExpandable = false,
    isExpanded = false,
    withCheckbox = false,
    checkboxChecked,
    checkboxIndeterminate,
    selectedCount = 0,
    totalCount = 0,
    descendantsSelectedCount = 0,
    descendantsTotalCount = 0,
    selectedLabel = "Selected",
    parentId = "root",
    isDraggable = false,
    dropGapEdge = null,
    expandAriaLabel = "Toggle nested items",
    onToggleExpand,
    onToggleCheck,
    onDragTargetChange,
    className
}) => {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const dragHandleRef = useRef<HTMLButtonElement | null>(null);
    const titleTextRef = useRef<HTMLSpanElement | null>(null);
    const selectedLabelRef = useRef<HTMLSpanElement | null>(null);
    const onDragTargetChangeRef = useRef(onDragTargetChange);
    const isTruncated = useEllipsisDetection(titleTextRef);
    const isSelectedLabelTruncated = useEllipsisDetection(selectedLabelRef);
    const [isDragging, setIsDragging] = useState(false);

    onDragTargetChangeRef.current = onDragTargetChange;

    const computeEdge = (clientY: number): TDropGapEdge => {
        const rowEl = rowRef.current;
        if (!rowEl) return "bottom";
        const { top, height } = rowEl.getBoundingClientRect();
        return clientY < top + height / 2 ? "top" : "bottom";
    };

    const hasBranchCheckbox = withCheckbox && checkboxChecked !== undefined;
    const resolvedCheckboxChecked = hasBranchCheckbox
        ? checkboxChecked
        : withCheckbox && totalCount > 0 && selectedCount === totalCount;
    const resolvedCheckboxIndeterminate = hasBranchCheckbox
        ? checkboxIndeterminate && !resolvedCheckboxChecked
        : withCheckbox && totalCount > 0 && selectedCount > 0 && selectedCount < totalCount;

    useEffect(() => {
        if (!isDraggable || !dragHandleRef.current || !rowRef.current) return () => undefined;

        const rowEl = rowRef.current;
        const handleEl = dragHandleRef.current;

        return combine(
            draggable({
                element: rowEl,
                dragHandle: handleEl,
                getInitialData: () => {
                    const rect = rowEl.getBoundingClientRect();
                    const clone = rowEl.cloneNode(true) as HTMLElement;

                    clone.classList.remove("actionableListItem_nested");
                    clone.classList.add("actionableListItem_dragPreview");

                    Object.assign(clone.style, {
                        width: `${rect.width}px`,
                        height: `${rect.height}px`
                    });

                    return {
                        sourceId: id,
                        parentId,
                        previewNode: clone,
                        initialRect: rect
                    };
                },
                onGenerateDragPreview: ({ nativeSetDragImage }) => {
                    disableNativeDragPreview({ nativeSetDragImage });
                },
                onDragStart: () => {
                    setIsDragging(true);
                    preventUnhandled.start();
                },
                onDrop: () => {
                    setIsDragging(false);
                    preventUnhandled.stop();
                }
            }),
            dropTargetForElements({
                element: rowEl,
                getData: () => ({ targetId: id, parentId }),
                canDrop: ({ source }) => source.data.parentId === parentId,
                onDragEnter: ({ location }) => {
                    onDragTargetChangeRef.current?.(computeEdge(location.current.input.clientY));
                },
                onDrag: ({ location }) => {
                    onDragTargetChangeRef.current?.(computeEdge(location.current.input.clientY));
                }
            })
        );
    }, [isDraggable, id, parentId]);

    return (
        <div
            ref={rowRef}
            className={classNames("actionableListItem", className, {
                actionableListItem_nested: level > 1,
                actionableListItem_draggable: isDraggable,
                actionableListItem_dragging: isDragging,
                actionableListItem_dropGapTop: dropGapEdge === "top",
                actionableListItem_dropGapBottom: dropGapEdge === "bottom"
            })}
        >
            <DnDDragLayer />
            {isExpandable && (
                <Button
                    size="smallNudge"
                    appearance="secondary"
                    layout="text"
                    Icon={isExpanded ? ChevronDown : ChevronRight}
                    onClick={onToggleExpand}
                    aria-label={expandAriaLabel}
                    className="actionableListItem__toggle"
                />
            )}

            {withCheckbox && (
                <Checkbox
                    checked={resolvedCheckboxChecked}
                    indeterminate={resolvedCheckboxIndeterminate}
                    onChange={(event) => onToggleCheck?.(event.target.checked)}
                    className="actionableListItem__checkbox"
                />
            )}
            <Tooltip text={title} isVisible={isTruncated}>
                <Text
                    ref={titleTextRef}
                    as="span"
                    variant="bodyMediumMedium"
                    className="actionableListItem__title ellipsis-text"
                >
                    {title}
                </Text>
            </Tooltip>
            {withCheckbox && descendantsTotalCount > 0 && (
                <p className="actionableListItem__meta">
                    <Tooltip text={selectedLabel} isVisible={isSelectedLabelTruncated}>
                        <Text
                            as="span"
                            ref={selectedLabelRef}
                            variant="bodyMediumMedium"
                            className="actionableListItem__metaLabel ellipsis-text"
                        >
                            {selectedLabel}
                        </Text>
                    </Tooltip>
                    <Text
                        as="span"
                        variant="bodyMediumMedium"
                        className="actionableListItem__metaCount"
                    >{`${descendantsSelectedCount}/${descendantsTotalCount}`}</Text>
                </p>
            )}

            {infoText && <Info infoText={infoText} size="smallNudge" className="actionableListItem__info" />}

            {isDraggable && (
                <button
                    ref={dragHandleRef}
                    className="actionableListItem__dragHandle"
                    aria-label="Drag row"
                    type="button"
                >
                    <GripDots
                        size={20}
                        className={classNames("actionableListItem__dragIcon", {
                            actionableListItem__dragIcon_dragging: isDragging
                        })}
                    />
                </button>
            )}
        </div>
    );
};

export type { TDropGapEdge };
export { IActionableListItemProps, ActionableListItem as default };
