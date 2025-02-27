import React, {
    CSSProperties,
    Dispatch,
    FC,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
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
    shift,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole
} from "@floating-ui/react";
import { Placement } from "@floating-ui/utils";

import { Close, InfoOutline } from "@geneui/icons";

// Styles
import "./Popover.scss";

// Hooks
import { useScrollLock } from "../../../hooks";
// Components
import { GeneUIDesignSystemContext } from "../../providers/GeneUIProvider";
import Button from "../Button";
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

export interface IPopoverProps {
    /**
     * Whether the popover is open initially. Defaults value is `false`.
     */

    defaultOpen?: boolean;
    /**
     * Define width and height of the popover.<br>
     * Possible values: <code> xLarge | large | medium | small | mobile </code>
     */
    size?: "xLarge" | "large" | "medium" | "small" | "mobile";

    /**
     * Title displayed in the popover header.
     */
    title?: string;

    /**
     * Position of the popover, relative to the target.<br><br>
     * Possible values: <code> bottom-center | bottom-left | bottom-right | left-bottom | left-center | left-top | <br><br> right-bottom | right-center | right-top | top-center | top-left | top-right | auto </code>
     */
    position?: keyof typeof correctPosition;

    /**
     * Padding between the popover and its target element.
     */
    padding?: number;

    /**
     * Function to update popover props dynamically.
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;

    /**
     * Additional content displayed in the popover footer.
     */
    footerContent?: ReactNode;

    /**
     * The content displayed inside the popover.
     */
    children: ReactNode;

    /**
     * Show or hide arrows
     */
    withArrow?: boolean;

    /**
     * If this property is enabled, rather than the popover content repositioning on a boundary collision,
     * the popover content container will move beyond the window's bounds.
     * You are, however, supplied with nudgedLeft and nudgedTop values, so you may choose to handle content overflow as you wish.
     */
    disableReposition?: boolean;
    /**
     * A callback function that is called when the popover needs to be closed.
     */
    onClose?: () => void;
    /**
     * Use `open` prop to control open state. By default, open is controls by component.
     */
    open?: boolean;
}

/**
 Popover displays additional content or information in an overlay box.
 It appears on top of the main content when triggered by a user action,
 such as a click or hover. Unlike tooltips, popovers can contain more
 complex and interactive content, including text, images, and form elements.
*/

const Popover: FC<IPopoverProps> = ({
    size = "medium",
    position = "bottom-center",
    padding = 10,
    defaultOpen = false,
    setProps,
    title,
    withArrow = true,
    children,
    disableReposition = false,
    onClose,
    open
}) => {
    const { lock: lockBodyScroll, unlock: unlockBodyScroll } = useScrollLock(document.body);

    const [popoverOpened, setPopoverOpened] = useState(defaultOpen);
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const [currentPosition, setCurrentPosition] = useState(correctPosition[position]);

    const arrowRef = useRef<HTMLDivElement | null>(null);

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
            offset(padding),
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

    const styles: CSSProperties =
        size === "mobile"
            ? {
                  position: "fixed",
                  bottom: "0"
              }
            : floatingStyles;

    const isShowPopover = open || popoverOpened;

    useEffect(() => {
        if (size === "mobile" && isShowPopover) {
            lockBodyScroll();
        } else {
            unlockBodyScroll();
        }
    }, [size, isShowPopover]);

    useEffect(() => {
        return () => {
            unlockBodyScroll();
        };
    }, []);

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

    return (
        <>
            {isShowPopover && (
                <FloatingPortal root={geneUIProviderRef.current}>
                    <div
                        style={styles}
                        className={`popover  popover_size_${size} popover_position_${currentDirection}`}
                        ref={refs.setFloating}
                        {...getFloatingProps()}
                    >
                        {size !== "mobile" && (
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
                        )}

                        <div className="popover__container">
                            {title && (
                                <div className="popover__header">
                                    <p className="popover__title">
                                        <InfoOutline className="popover__title_icon" size={20} />
                                        <span className="popover__title_text ellipsis-text">{title}</span>
                                    </p>
                                    <Button
                                        Icon={Close}
                                        size="small"
                                        appearance="secondary"
                                        displayType="text"
                                        className="popover__close"
                                        onClick={() => setPopoverOpened(false)}
                                    />
                                </div>
                            )}
                            {children}
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export default Popover;
