import { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

import { DROP_TARGET_MIDPOINT_FRACTION } from "../../../constants";

/**
 * Marks drag data as a manage-columns list item, so drops and monitors can
 * ignore drags that come from other lists (another DataTable, ActionableList, ...).
 */
export const MANAGE_COLUMNS_DRAG_TYPE = "manageColumnsItem";

export const isManageColumnsDragData = (data: Record<string | symbol, unknown>, listId: string) =>
    data.type === MANAGE_COLUMNS_DRAG_TYPE && data.listId === listId;

/**
 * Marks the list container itself as a drop target. The drop gap is a margin outside the items,
 * so the pointer is often over the list but not over an item, which is still a valid drop.
 */
export const MANAGE_COLUMNS_LIST_DROP_TYPE = "manageColumnsList";

interface UseColumnListItemDnDProps {
    columnId: string;
    /**
     * Id of the list the item belongs to. Items can only be dropped inside the same list.
     */
    listId: string;
    onDragTargetChange?: (edge: string | null) => void;
    disabled?: boolean;
}

export const useColumnListItemDnD = ({
    columnId,
    listId,
    onDragTargetChange,
    disabled = false
}: UseColumnListItemDnDProps) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const onDragTargetChangeRef = useRef(onDragTargetChange);

    const [isDragging, setIsDragging] = useState(false);

    onDragTargetChangeRef.current = onDragTargetChange;

    const computeEdge = (clientY: number): string => {
        const rowEl = itemRef.current;
        if (!rowEl) return "bottom";
        const { top, height } = rowEl.getBoundingClientRect();
        return clientY < top + height * DROP_TARGET_MIDPOINT_FRACTION ? "top" : "bottom";
    };

    useEffect(() => {
        const el = itemRef.current;
        const dragHandle = dragHandleRef.current;
        if (!el || !dragHandle) return;

        // eslint-disable-next-line consistent-return
        return combine(
            draggable({
                element: el,
                dragHandle,
                canDrag: () => !disabled,
                getInitialData: () => {
                    const rect = el.getBoundingClientRect();
                    const clone = el.cloneNode(true) as HTMLElement;

                    clone.classList.remove("manageColumnListItem_dragging");
                    clone.classList.add("manageColumnListItem_dragPreview");

                    Object.assign(clone.style, {
                        width: `${rect.width}px`,
                        height: `${rect.height}px`
                    });

                    return {
                        type: MANAGE_COLUMNS_DRAG_TYPE,
                        listId,
                        id: columnId,
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
                element: el,
                canDrop: ({ source }) => isManageColumnsDragData(source.data, listId) && source.data.id !== columnId,
                getData: () => ({ type: MANAGE_COLUMNS_DRAG_TYPE, listId, id: columnId }),
                onDragEnter: ({ location }) => {
                    onDragTargetChangeRef.current?.(computeEdge(location.current.input.clientY));
                },
                onDrag: ({ location }) => {
                    onDragTargetChangeRef.current?.(computeEdge(location.current.input.clientY));
                }
            })
        );
    }, [columnId, listId, disabled]);

    return {
        itemRef,
        dragHandleRef,
        isDragging
    };
};
