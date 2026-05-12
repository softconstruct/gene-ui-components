import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

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
    previewNode?: HTMLElement;
} | null;

const CustomDragLayer = () => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const [dragState, setDragState] = useState<TDragState>(null);

    const layerRef = useRef<HTMLDivElement>(null);
    const initialOffsetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updateDragPosition = (clientX: number, clientY: number) => {
            requestAnimationFrame(() => {
                if (layerRef.current) {
                    const x = clientX - initialOffsetRef.current.x;
                    const y = clientY - initialOffsetRef.current.y;
                    layerRef.current.style.setProperty("--drag-layer-transform", `translate(${x}px, ${y}px)`);
                }
            });
        };

        return monitorForElements({
            onDragStart: ({ location, source }) => {
                const { previewNode, initialRect } = source.data;

                if (previewNode instanceof HTMLElement && initialRect) {
                    const { clientX, clientY } = location.current.input;
                    initialOffsetRef.current = {
                        x: clientX - (initialRect as DOMRect).left,
                        y: clientY - (initialRect as DOMRect).top
                    };
                    setDragState({
                        isDragging: true,
                        previewNode
                    });

                    updateDragPosition(clientX, clientY);
                }
            },
            onDrag: ({ location }) => {
                const { clientX, clientY } = location.current.input;
                updateDragPosition(clientX, clientY);
            },
            onDrop: () => {
                setDragState(null);
            }
        });
    }, []);

    const providerCurrent = geneUIProviderRef?.current;

    if (!dragState?.isDragging || !dragState.previewNode || !providerCurrent) return null;

    return createPortal(
        <div ref={layerRef} className="actionableListItem__dragLayer">
            <ClonedNodeRenderer node={dragState.previewNode} />
        </div>,
        providerCurrent
    );
};

export default CustomDragLayer;
