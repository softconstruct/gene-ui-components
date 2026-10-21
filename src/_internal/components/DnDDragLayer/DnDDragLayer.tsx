import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import classNames from "classnames";

import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./DnDDragLayer.scss";

const ClonedNodeRenderer = ({ node }: { node: HTMLElement }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    /* eslint consistent-return: off */
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
    }, [node]);

    return <div ref={containerRef} />;
};

type TDragState = {
    isDragging: boolean;
    previewNode: HTMLElement;
    initialTransform: string;
} | null;

type TCanMonitor = NonNullable<Parameters<typeof monitorForElements>[0]["canMonitor"]>;

interface IDnDDragLayer {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Decides which drags this layer renders a preview for.
     * Every layer monitors all element drags on the page, so each owner must scope it to its own drags
     * (e.g. by the source element or a drag type in the source data), otherwise several layers render the same preview.
     */
    canMonitor: TCanMonitor;
}

const DnDDragLayer: FC<IDnDDragLayer> = ({ className, canMonitor }) => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const [dragState, setDragState] = useState<TDragState>(null);

    const layerRef = useRef<HTMLDivElement>(null);
    const initialOffsetRef = useRef({ x: 0, y: 0 });
    const dragFrameRef = useRef<number | null>(null);
    const canMonitorRef = useRef(canMonitor);
    canMonitorRef.current = canMonitor;

    useEffect(() => {
        const getTransform = (clientX: number, clientY: number) => {
            const x = clientX - initialOffsetRef.current.x;
            const y = clientY - initialOffsetRef.current.y;
            return `translate(${x}px, ${y}px)`;
        };

        const updateDragPosition = (clientX: number, clientY: number) => {
            if (dragFrameRef.current !== null) {
                cancelAnimationFrame(dragFrameRef.current);
            }

            dragFrameRef.current = requestAnimationFrame(() => {
                if (layerRef.current) {
                    layerRef.current.style.setProperty("--drag-layer-transform", getTransform(clientX, clientY));
                }
            });
        };

        const stopMonitoring = monitorForElements({
            canMonitor: (args) => canMonitorRef.current(args),
            onDragStart: ({ location, source }) => {
                const { previewNode, initialRect } = source.data;

                if (previewNode instanceof HTMLElement && initialRect) {
                    const { clientX, clientY } = location.current.input;
                    initialOffsetRef.current = {
                        x: clientX - (initialRect as DOMRect).left,
                        y: clientY - (initialRect as DOMRect).top
                    };
                    const initialTransform = getTransform(clientX, clientY);
                    setDragState({
                        isDragging: true,
                        previewNode,
                        initialTransform
                    });
                }
            },
            onDrag: ({ location }) => {
                const { clientX, clientY } = location.current.input;
                updateDragPosition(clientX, clientY);
            },
            onDrop: () => {
                if (dragFrameRef.current !== null) {
                    cancelAnimationFrame(dragFrameRef.current);
                    dragFrameRef.current = null;
                }
                setDragState(null);
            }
        });

        return () => {
            if (dragFrameRef.current !== null) {
                cancelAnimationFrame(dragFrameRef.current);
                dragFrameRef.current = null;
            }
            stopMonitoring();
        };
    }, []);

    const providerCurrent = geneUIProviderRef.current;

    if (!dragState?.isDragging || !dragState.previewNode || !providerCurrent) return null;
    const dragLayerStyle = {
        "--drag-layer-transform": dragState.initialTransform
    };

    return createPortal(
        <div ref={layerRef} className={classNames("dndDragLayer", className)} style={dragLayerStyle}>
            <ClonedNodeRenderer node={dragState.previewNode} />
        </div>,
        providerCurrent
    );
};

export default DnDDragLayer;
