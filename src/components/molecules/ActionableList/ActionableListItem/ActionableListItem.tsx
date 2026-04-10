import React, { FC, useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
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
    level: number;
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
     * Number of selected nodes in this row’s subtree (including self), for checkbox when branch props are unset (e.g. Storybook).
     */
    selectedCount?: number;
    /**
     * Total nodes in this row’s subtree including self — checkbox fallback when branch props are unset.
     */
    totalCount?: number;
    /**
     * “Selected x/y” numerator: typically direct children whose subtree is fully selected.
     */
    descendantsSelectedCount?: number;
    /**
     * “Selected x/y” denominator: typically direct child count. Zero hides the label (leaf rows).
     */
    descendantsTotalCount?: number;
    /**
     * Label prefix for the selected counter.
     */
    selectedLabel?: string;
    /**
     * Whether drag-and-drop handle is shown.
     */
    isDraggable?: boolean;
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
     * Callback when a dragged item is dropped onto this row.
     */
    onDropReorder?: (sourceId: string) => void;
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
    isDraggable = false,
    expandAriaLabel = "Toggle nested items",
    onToggleExpand,
    onToggleCheck,
    onDropReorder,
    className
}) => {
    const rowRef = useRef<HTMLDivElement | null>(null);
    const dragHandleRef = useRef<HTMLSpanElement | null>(null);
    const titleTextRef = useRef<HTMLSpanElement | null>(null);
    const isTruncated = useEllipsisDetection(titleTextRef);
    const [isDragging, setIsDragging] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const hasBranchCheckbox = withCheckbox && checkboxChecked !== undefined;
    const resolvedCheckboxChecked = hasBranchCheckbox
        ? checkboxChecked
        : withCheckbox && totalCount > 0 && selectedCount === totalCount;
    const resolvedCheckboxIndeterminate = hasBranchCheckbox
        ? Boolean(checkboxIndeterminate) && !resolvedCheckboxChecked
        : withCheckbox && totalCount > 0 && selectedCount > 0 && selectedCount < totalCount;

    useEffect(() => {
        if (!isDraggable || !dragHandleRef.current || !rowRef.current) return () => undefined;

        const element = dragHandleRef.current;
        return combine(
            draggable({
                element,
                getInitialData: () => ({ sourceId: id }),
                onDragStart: () => setIsDragging(true),
                onDrop: () => setIsDragging(false)
            }),
            dropTargetForElements({
                element: rowRef.current,
                getData: () => ({ targetId: id }),
                onDragEnter: () => setIsDragOver(true),
                onDragLeave: () => setIsDragOver(false),
                onDrop: ({ source }) => {
                    setIsDragOver(false);
                    const { sourceId } = source.data as { sourceId?: unknown };
                    if (typeof sourceId !== "string") return;
                    onDropReorder?.(sourceId);
                }
            })
        );
    }, [isDraggable, id, onDropReorder]);

    return (
        <div
            ref={rowRef}
            className={classNames("actionableListItem", className, {
                actionableListItem_nested: level > 1,
                actionableListItem_draggable: isDraggable,
                actionableListItem_dragOver: isDragOver,
                actionableListItem_dragging: isDragging
            })}
        >
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

            <span className="actionableListItem__titleWrap">
                <Tooltip text={title} isVisible={isTruncated}>
                    <Text ref={titleTextRef} as="span" variant="bodyLargeMedium" className="actionableListItem__title">
                        {title}
                    </Text>
                </Tooltip>
            </span>

            {withCheckbox && descendantsTotalCount > 0 && (
                <Text as="span" variant="bodyMediumMedium" className="actionableListItem__meta">
                    {`${selectedLabel} ${descendantsSelectedCount}/${descendantsTotalCount}`}
                </Text>
            )}

            {infoText && <Info infoText={infoText} size="XSmall" className="actionableListItem__info" />}

            {isDraggable && (
                <span
                    ref={dragHandleRef}
                    className="actionableListItem__dragHandle"
                    aria-label="Drag row"
                    role="button"
                >
                    <GripDots
                        size={16}
                        className={classNames("actionableListItem__dragIcon", {
                            actionableListItem__dragIcon_dragging: isDragging
                        })}
                    />
                </span>
            )}
        </div>
    );
};

export { IActionableListItemProps, ActionableListItem as default };
