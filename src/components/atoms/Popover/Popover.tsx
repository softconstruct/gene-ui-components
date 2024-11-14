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
import { Close, InfoOutline } from "@geneui/icons";

// Components
import { GeneUIDesignSystemContext } from "../../providers/GeneUIProvider";
import HelperText from "../HelperText";
import Button from "../Button";

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

const Popover: FC<IPopoverProps> = ({ position = "top-right", padding = 10, isOpen = false, alwaysShow, setProps }) => {
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
                    {/* todo: switch in the next classNames in case popover size: "popover_size_xLarge", "popover_size_large", "popover_size_medium", "popover_size_small", "popover_size_mobile" */}
                    {/* todo: switch in the next classNames in case popover position: "popover_position_top", "popover_position_bottom", "popover_position_start", "popover_position_end" */}
                    <div
                        style={floatingStyles}
                        className="popover popover_position_bottom popover_size_medium"
                        ref={refs.setFloating}
                        {...getFloatingProps()}
                    >
                        {/* todo: switch in the next classNames in case arrow position: "popover__arrow_start", "popover__arrow_end", "popover__arrow_center" */}
                        <span
                            className="popover__arrow popover__arrow_start"
                            ref={arrowRef}
                            style={{
                                ...getCorrectPosition,
                                top: middlewareArrowData?.y,
                                [staticSide!]: arrowRef.current ? `${-arrowRef.current.offsetWidth + 6}px` : 0
                            }}
                        />
                        <div className="popover__container">
                            {/* todo: conditionally show 'popover__header' block */}
                            <div className="popover__header">
                                <HelperText text="Title" Icon={InfoOutline} />
                                <Button
                                    Icon={Close}
                                    size="small"
                                    appearance="secondary"
                                    displayType="text"
                                    onClick={() => {
                                        setPopoverOpened(false);
                                    }}
                                />
                            </div>
                            <div className="popover__body">
                                <div className="popover__content">
                                    {/* todo: replace it with any component using the “Component Instance” swapper */}
                                    <div
                                        className="swapComponent"
                                        style={{ minHeight: "100%", background: "#F4E1EC" }}
                                    />
                                </div>
                            </div>

                            {/* todo: conditionally show 'popover__footer' block */}
                            <div className="popover__footer">
                                {/* todo: replace it with any component using the “Component Instance” swapper */}
                                <div
                                    className="swapComponent"
                                    style={{ height: "2.8rem", width: "6.4rem", background: "#F4E1EC" }}
                                />
                                <div className="popover__footer_buttons">
                                    <Button
                                        size="medium"
                                        appearance="secondary"
                                        displayType="text"
                                        onClick={() => {
                                            setPopoverOpened(false);
                                        }}
                                    >
                                        Secondary
                                    </Button>
                                    <Button
                                        size="medium"
                                        appearance="primary"
                                        displayType="fill"
                                        onClick={() => {
                                            setPopoverOpened(false);
                                        }}
                                    >
                                        Primary
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export default Popover;
