import { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

interface UseColumnListItemDnDProps {
    columnId: string;
    onDragTargetChange?: (edge: string | null) => void;
}

export const useColumnListItemDnD = ({ columnId, onDragTargetChange }: UseColumnListItemDnDProps) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const onDragTargetChangeRef = useRef(onDragTargetChange);

    const [isDragging, setIsDragging] = useState(false);

    onDragTargetChangeRef.current = onDragTargetChange;

    const computeEdge = (clientY: number): string => {
        const rowEl = itemRef.current;
        if (!rowEl) return "bottom";
        const { top, height } = rowEl.getBoundingClientRect();
        return clientY < top + height / 2 ? "top" : "bottom";
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
                canDrop: ({ source }) => source.data.id !== columnId,
                getData: () => ({ id: columnId }),
                onDragEnter: ({ location }) => {
                    onDragTargetChangeRef.current?.(computeEdge(location.current.input.clientY));
                },
                onDrag: ({ location }) => {
                    onDragTargetChangeRef.current?.(computeEdge(location.current.input.clientY));
                }
            })
        );
    }, [columnId]);

    return {
        itemRef,
        dragHandleRef,
        isDragging
    };
};
