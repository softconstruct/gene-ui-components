import React, { useState, useRef, useContext, FC, useEffect, Dispatch, SetStateAction } from "react";
import {
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    FloatingPortal,
    useClick,
    useInteractions,
    useRole,
    platform
} from "@floating-ui/react";
import { Placement } from "@floating-ui/utils";

// Components
import { GeneUIDesignSystemContext } from "../../providers/GeneUIProvider";

// Styles
import "./Popover.scss";

const positions: Placement[] = [
    "top",
    "right",
    "bottom",
    "left",
    "top-start",
    "top-end",
    "right-start",
    "right-end",
    "bottom-start",
    "bottom-end",
    "left-start",
    "left-end"
];

const correctPosition = {
    "bottom-center": "bottom",
    "bottom-left": "bottom-start",
    "bottom-right": "bottom-end",
    "left-bottom": "left-end",
    "left-center": "left",
    "left-top": "left-start",
    "right-bottom": "right-end",
    "right-center": "right",
    "right-top": "right-start",
    "top-center": "top",
    "top-left": "top-start",
    "top-right": "top-end"
} as const;

const arrowPositions = {
    "top-start": "left",
    "top-end": "right",
    "bottom-end": "right",
    "bottom-start": "left"
} as Record<string, string>;

const staticSides = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
};

export interface IPopoverProps {
    isOpen?: boolean;
    size: "xLarge" | "large" | "medium" | "small" | "mobile";
    title?: string;
    isClosable?: boolean;
    position?: keyof typeof correctPosition;
    padding: number;
    alwaysShow?: boolean;
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
}

const Popover: FC<IPopoverProps> = ({ position = "top", padding = 10, isOpen = false, alwaysShow, setProps }) => {
    const popoverState = isOpen || false;
    const [popoverOpened, setPopoverOpened] = useState(popoverState);
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const { refs, floatingStyles, context, middlewareData, placement } = useFloating({
        open: popoverOpened,
        onOpenChange: setPopoverOpened,
        placement: correctPosition[position],

        platform: {
            ...platform,
            isRTL: () => false
        },
        middleware: [
            offset(padding),
            flip({
                mainAxis: true,
                fallbackPlacements: positions
            }),
            shift()
        ],
        whileElementsMounted: autoUpdate
    });
    useDismiss(context, {
        outsidePressEvent: "click"
    });

    const click = useClick(context, {
        event: "click"
    });

    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, role]);

    const arrowRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setProps({
            ref: refs.setReference,
            ...getReferenceProps()
        });
    }, [setProps, getReferenceProps, refs.setReference]);

    const [currentDirection] = placement.split("-") as [keyof typeof staticSides];

    const offsetFromEdge = 8;

    const middlewareArrowData = middlewareData.arrow;

    const staticSide = staticSides[currentDirection];

    const arrowPosition = arrowPositions[placement];

    const getCorrectPosition = arrowPosition
        ? { [arrowPosition]: offsetFromEdge }
        : { insetInlineStart: middlewareArrowData?.x };

    return (
        <>
            {(alwaysShow || popoverOpened) && (
                <FloatingPortal root={geneUIProviderRef.current}>
                    <div
                        style={floatingStyles}
                        className="popover-positioner"
                        ref={refs.setFloating}
                        {...getFloatingProps()}
                    >
                        <div
                            className="popover__arrow"
                            ref={arrowRef}
                            style={{
                                ...getCorrectPosition,
                                top: middlewareArrowData?.y,
                                [staticSide!]: arrowRef.current ? `${-arrowRef.current.offsetWidth + 6}px` : 0,
                                // Remove after adding styles
                                background: "red"
                            }}
                        >
                            <svg
                                width="12"
                                height="4"
                                viewBox="0 0 12 4"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path className="popover__arrowPath" d="M6 4L0 0L12 0L6 4Z" />
                            </svg>
                        </div>
                        <h1> Popover </h1>
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export default Popover;
