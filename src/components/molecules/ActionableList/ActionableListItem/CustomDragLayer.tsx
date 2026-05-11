import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

/**
 * Renders a cloned node in a container.
 */
const ClonedNodeRenderer = ({ node }: { node: HTMLElement }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (container && node) {
            container.appendChild(node);

            return () => {
                if (container.contains(node)) {
                    container.removeChild(node);
                }
            };
        }
        return () => {};
    }, [node]);

    return <div ref={containerRef} />;
};

type TDragState = {
    isDragging: boolean;
    x: number;
    y: number;
    previewNode?: HTMLElement;
} | null;

/**
 * Custom Drag Layer for Actionable List
 */
const CustomDragLayer = () => {
    const [dragState, setDragState] = useState<TDragState>(null);

    useEffect(() => {
        return monitorForElements({
            onDragStart: ({ location, source }) => {
                setDragState({
                    isDragging: true,
                    x: location.current.input.clientX,
                    y: location.current.input.clientY,
                    previewNode: source.data.previewNode as HTMLElement
                });
            },
            onDrag: ({ location }) => {
                setDragState((prev) =>
                    prev
                        ? {
                              ...prev,
                              x: location.current.input.clientX,
                              y: location.current.input.clientY
                          }
                        : null
                );
            },
            onDrop: () => {
                setDragState(null);
            }
        });
    }, []);

    if (!dragState?.isDragging || !dragState.previewNode) return null;

    return createPortal(
        <div
            style={{
                position: "fixed",
                top: 0,
                left: -dragState.previewNode.offsetWidth,
                transform: `translate(${dragState.x}px, ${dragState.y}px)`,
                pointerEvents: "none"
            }}
        >
            <div className="actionableList">
                <ClonedNodeRenderer node={dragState.previewNode} />
            </div>
        </div>,
        document.body
    );
};

export default CustomDragLayer;
