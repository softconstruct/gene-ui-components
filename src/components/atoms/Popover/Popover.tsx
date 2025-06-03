import React, {
    Dispatch,
    forwardRef,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import {
    arrow,
    autoUpdate,
    flip,
    FloatingPortal,
    offset,
    platform,
    ReferenceType,
    shift,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole
} from "@floating-ui/react";
import { Placement } from "@floating-ui/utils";
import classNames from "classnames";

import { InfoOutlined, X } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Spreadsheet from "@components/atoms/Spreadsheet";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Popover.scss";

// Helper
import { calculateOverlap, getPositionRect } from "./Helper";

const positions: Placement[] = [
    "top",
    "bottom",
    "right",
    "left",
    "top-start",
    "right-start",
    "bottom-start",
    "left-start",
    "top-end",
    "right-end",
    "bottom-end",
    "left-end"
];

type Positions =
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left-end"
    | "left"
    | "left-start"
    | "right-end"
    | "right"
    | "right-start"
    | "top"
    | "top-start"
    | "top-end"
    | "auto";

export const correctPosition: Record<string, Positions> = {
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
    "top-right": "top-end",
    auto: "auto"
} as const;

type ArrowPositions = "left" | "right";

const arrowPositions: Record<string, ArrowPositions> = {
    "top-start": "left",
    "top-end": "right",
    "bottom-end": "right",
    "bottom-start": "left"
} as const;

export type StaticSides = "bottom" | "left" | "right" | "top";

export const staticSides: Record<string, StaticSides> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
} as const;

export interface IPopoverRef {
    referenceElement: MutableRefObject<ReferenceType | null>;
    floatingElement: MutableRefObject<ReferenceType | null>;
}

export interface IPopoverProps {
    /**
     * Whether the popover is open initially. Defaults value is `false`.
     */
    defaultOpen?: boolean;
    /**
     * Define width and height of the popover.<br>
     * Possible values: `xLarge | large | medium | small | fitContent`
     */
    size?: "small" | "medium" | "large" | "xLarge" | "fitContent";
    /**
     * When set to true, the `width` of the `popover` will match the `width` of the reference (trigger, anchor) element.
     * The `height` of the popover will still be determined by the `size` prop.
     */
    fitReference?: boolean;
    /**
     * Title displayed in the popover header.
     */
    title?: string;
    /**
     * Position of the popover, relative to the reference (trigger, anchor) element.<br><br>
     * Possible values: `bottom-center | bottom-left | bottom-right | left-bottom | left-center` <br> `left-top | right-bottom | right-center | right-top | top-center | top-left | top-right | auto`
     */
    position?: keyof typeof correctPosition;
    /**
     * Margin between the popover and its reference (trigger, anchor) element.
     */
    margin?: number;
    /**
     * Function to update popover props dynamically.
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    /**
     * The content displayed inside the popover.
     */
    children: ReactNode;
    /**
     * Show or hide arrows
     */
    withArrow?: boolean;
    /**
     * If `true`, disables automatic repositioning of the popover when it would otherwise
     * overflow or collide with a window boundary. By default, the popover will attempt
     * to reposition itself (e.g., flip to another side) to remain visible.
     *
     * When `disableReposition` is enabled, the popover will instead remain in its
     * original placement, even if that causes it to overflow the viewport.
     * This can be useful when you want to handle overflow behavior manually or
     * maintain consistent placement.
     *
     * Note: Even with repositioning disabled, the component still provides
     * `nudgedLeft` and `nudgedTop` values, which can be used to handle content overflow.
     */
    disableReposition?: boolean;
    /**
     * A callback function that is called when the popover is closed.
     */
    onClose?: () => void;
    /**
     * Controls the open state of the popover externally.
     *
     * If `open` is provided, the component becomes a controlled component,
     * and its visibility will be dictated by the parent.
     * If `open` is not provided, the component manages its own open/close
     * state internally via user interaction (e.g., clicks).
     *
     * This allows the component to be used both in controlled and uncontrolled modes.
     */
    open?: boolean;
}

/**
 Popover displays additional content or information in an overlay floating box.
 It appears on top of the main content when triggered by a user action,
 such as a click or hover. Unlike tooltips, popovers can contain more
 complex and interactive content, including text, images, and form elements.
*/
const Popover = forwardRef<IPopoverRef, IPopoverProps>(
    (
        {
            size = "medium",
            fitReference,
            position = "bottom-center",
            margin = 10,
            defaultOpen = false,
            setProps,
            title,
            withArrow = true,
            children,
            disableReposition = false,
            onClose,
            open
        },
        popoverRef
    ) => {
        const [popoverOpened, setPopoverOpened] = useState(defaultOpen);
        const { geneUIProviderRef, breakpoint } = useContext(GeneUIDesignSystemContext);
        const [currentPosition, setCurrentPosition] = useState(correctPosition[position]);
        const arrowRef = useRef<HTMLDivElement | null>(null);

        const isMobile = breakpoint?.isMobileBreakpoint;

        const wosPosed = useRef(new Map());
        const { refs, floatingStyles, context, middlewareData, placement } = useFloating({
            open: popoverOpened,
            onOpenChange: setPopoverOpened,
            placement: currentPosition as Placement,
            platform: {
                ...platform,
                isRTL: () => false
            },
            middleware: [
                offset(margin),
                flip({
                    mainAxis: position !== "auto" && !disableReposition,
                    fallbackAxisSideDirection: "none",
                    fallbackPlacements: position === "auto" ? [] : positions
                }),
                arrow({ element: arrowRef }),

                shift({
                    mainAxis: false,
                    crossAxis: false,
                    limiter: {
                        fn: ({ x, y }) => ({
                            x: Math.max(0, x),
                            y: Math.max(0, y)
                        })
                    }
                })
            ],
            whileElementsMounted: autoUpdate
        });

        useImperativeHandle(popoverRef, (): IPopoverRef => {
            return {
                referenceElement: refs.reference,
                floatingElement: refs.floating
            };
        }, []);

        useEffect(() => {
            if (!popoverOpened && onClose) {
                onClose();
            }
        }, [popoverOpened]);

        useDismiss(context, {
            outsidePressEvent: "click"
        });

        const click = useClick(context, {
            event: "click"
        });

        const role = useRole(context);

        const { getReferenceProps, getFloatingProps } = useInteractions([click, role]);

        useEffect(() => {
            const internalControl = open === undefined ? getReferenceProps() : {};

            setProps({
                ref: refs.setReference,
                ...internalControl
            });
        }, [setProps, getReferenceProps, open, refs.setReference]);

        const [currentDirection] = placement.split("-") as [StaticSides];

        const offsetFromEdge = 8;

        const middlewareArrowData = middlewareData.arrow;

        const staticSide: StaticSides = staticSides[currentDirection];

        const arrowPosition: (typeof arrowPositions)[keyof typeof arrowPositions] = arrowPositions[placement];

        const getCorrectPosition = arrowPosition
            ? { [arrowPosition]: offsetFromEdge }
            : { insetInlineStart: middlewareArrowData?.x };

        const isPopoverOpened = open || popoverOpened;

        useLayoutEffect(() => {
            if (position === "auto") {
                setCurrentPosition(size === "small" ? "auto" : "bottom");
                return;
            }

            setCurrentPosition(correctPosition[position]);

            return () => {
                wosPosed.current.clear();
            };
        }, [position, size]);

        /* eslint consistent-return: off */
        useEffect(() => {
            if (!refs.floating.current || position !== "auto") return;

            const currentPopoverRect = refs.floating.current.getBoundingClientRect();
            const otherPopovers = document.querySelectorAll(".popover");
            let bestPosition = correctPosition[position] as Placement;
            let leastOverlap = Infinity;
            let hasOverlap = false;
            const preventPosition: Positions = correctPosition[currentPosition];

            const updatePopoverPosition = () => {
                positions.forEach((possiblePositions) => {
                    const rect = getPositionRect(currentPopoverRect, possiblePositions);
                    let overlap = 0;
                    otherPopovers.forEach((otherPopover) => {
                        if (otherPopover === refs.floating.current) return;
                        const otherRect = otherPopover.getBoundingClientRect();
                        overlap += calculateOverlap(rect as DOMRect, otherRect);
                    });

                    if (overlap < leastOverlap) {
                        leastOverlap = overlap;
                        bestPosition = possiblePositions;
                    }
                });

                hasOverlap = leastOverlap > 0;

                if (preventPosition !== bestPosition && !hasOverlap && !wosPosed.current.has(bestPosition)) {
                    wosPosed.current.set(bestPosition, true);

                    setCurrentPosition(bestPosition);
                }
            };

            const checkInterval = setInterval(() => {
                updatePopoverPosition();
                if (!hasOverlap) {
                    clearInterval(checkInterval);
                }
            });

            return () => {
                clearInterval(checkInterval);
                leastOverlap = Infinity;
            };
        }, [popoverOpened, refs.floating.current, placement, position, currentPosition]);

        const arrowOffsetFromEdge = 5;

        const parentElement = refs.reference.current as HTMLElement | null;

        return (
            <>
                {isPopoverOpened &&
                    (isMobile ? (
                        <Spreadsheet
                            inset={false}
                            open={isPopoverOpened}
                            onClose={() => {
                                onClose?.();
                            }}
                        >
                            <div className={classNames("popover__container", "popover__container_height_full")}>
                                {title && (
                                    <div className="popover__header">
                                        <p className="popover__title">
                                            <InfoOutlined className="popover__title_icon" size={20} />
                                            <span className="popover__title_text ellipsis-text">{title}</span>
                                        </p>
                                        <Button
                                            Icon={X}
                                            size="small"
                                            appearance="secondary"
                                            layout="text"
                                            className="popover__close"
                                            onClick={() => setPopoverOpened(false)}
                                        />
                                    </div>
                                )}
                                {children}
                            </div>
                        </Spreadsheet>
                    ) : (
                        <FloatingPortal root={geneUIProviderRef.current}>
                            <div
                                style={
                                    fitReference && parentElement
                                        ? { ...floatingStyles, "--parent-width": `${parentElement?.offsetWidth}px` }
                                        : floatingStyles
                                }
                                className={`popover ${fitReference && "popover_size_reference"} popover_size_${size} popover_position_${currentDirection}`}
                                ref={refs.setFloating}
                                {...getFloatingProps()}
                            >
                                <div
                                    ref={arrowRef}
                                    className="popover__arrow"
                                    style={{
                                        ...getCorrectPosition,
                                        top: middlewareArrowData?.y,
                                        [staticSide!]: arrowRef.current
                                            ? `${-arrowRef.current.offsetWidth + arrowOffsetFromEdge}px`
                                            : 0
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="8"
                                        viewBox="0 0 20 8"
                                        fill="none"
                                    >
                                        {withArrow && (
                                            <path
                                                d="M8.75061 0.999513C9.48105 0.415163 10.519 0.415162 11.2494 0.999512L20 8H0L8.75061 0.999513Z"
                                                className="popover__arrowPath"
                                            />
                                        )}
                                    </svg>
                                </div>

                                <div className="popover__container">
                                    {title && (
                                        <div className="popover__header">
                                            <p className="popover__title">
                                                <InfoOutlined className="popover__title_icon" size={20} />
                                                <span className="popover__title_text ellipsis-text">{title}</span>
                                            </p>
                                            <Button
                                                Icon={X}
                                                size="small"
                                                appearance="secondary"
                                                layout="text"
                                                className="popover__close"
                                                onClick={() => setPopoverOpened(false)}
                                            />
                                        </div>
                                    )}
                                    {children}
                                </div>
                            </div>
                        </FloatingPortal>
                    ))}
            </>
        );
    }
);

export default Popover;
