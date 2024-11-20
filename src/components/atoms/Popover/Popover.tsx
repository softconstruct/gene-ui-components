import React, {
    useState,
    useRef,
    useContext,
    FC,
    useEffect,
    Dispatch,
    SetStateAction,
    ReactNode,
    CSSProperties
} from "react";
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
    platform,
    arrow
} from "@floating-ui/react";
import { Placement } from "@floating-ui/utils";
import { Close, InfoOutline } from "@geneui/icons";

// Components
import { GeneUIDesignSystemContext } from "../../providers/GeneUIProvider";
import Button, { IButtonProps } from "../Button";

// Styles
import "./Popover.scss";
import { useBodyScrollBlock } from "../../../hooks";

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

interface IButtons extends Omit<IButtonProps, "children"> {
    title: string;
}

export interface IPopoverProps {
    /**
     * Whether the popover is open initially. Defaults to `false`.
     */
    isOpen?: boolean;

    /**
     * Size of the popover: `xLarge`, `large`, `medium`, `small`, or `mobile`.
     */
    size: "xLarge" | "large" | "medium" | "small" | "mobile";

    /**
     * Title displayed in the popover header.
     */
    title?: string;

    /**
     * Position of the popover relative to the target (e.g., `top`, `bottom-right`).
     */
    position?: keyof typeof correctPosition;

    /**
     * Padding between the popover and the target element.
     */
    padding: number;

    /**
     * If `true`, the popover is always visible.
     */
    alwaysShow?: boolean;

    /**
     * Function to update popover props dynamically.
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;

    /**
     * Properties for the primary action button.
     */
    primaryButton?: IButtons;

    /**
     * Properties for the secondary action button.
     */
    secondaryButton?: IButtons;

    /**
     * Additional content displayed in the popover footer.
     */
    footerContent?: ReactNode;

    /**
     * The content displayed inside the popover.
     */
    children: ReactNode;
}
/**
 Popover displays additional content or information in an overlay box.
 It appears on top of the main content when triggered by a user action, 
 such as a click or hover. Unlike tooltips, popovers can contain more
 complex and interactive content, including text, images, and form elements.
*/

const Popover: FC<IPopoverProps> = ({
    size,
    position = "top-right",
    padding = 10,
    isOpen = false,
    alwaysShow,
    setProps,
    title,
    primaryButton,
    secondaryButton,
    footerContent,
    children
}) => {
    const popoverState = isOpen || false;
    const [popoverOpened, setPopoverOpened] = useState(popoverState);
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const arrowRef = useRef<HTMLDivElement | null>(null);

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
                fallbackAxisSideDirection: "none",
                fallbackPlacements: positions
            }),
            arrow({ element: arrowRef }),

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

    useEffect(() => {
        setProps({
            ref: refs.setReference,
            ...getReferenceProps()
        });
    }, [setProps, getReferenceProps, refs.setReference]);

    const [currentDirection] = placement.split("-") as [keyof typeof staticSides];

    const offsetFromEdge = 8;

    const middlewareArrowData = middlewareData.arrow;

    const staticSide = staticSides[currentDirection] as keyof typeof staticSides;

    const arrowPosition = arrowPositions[placement];

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

    const isShowPopover = alwaysShow || popoverOpened;

    const isScrollable = size === "mobile" && isShowPopover;

    useBodyScrollBlock(isScrollable);

    const arrowOffsetFromEdge = staticSide === "left" || staticSide === "right" ? 7 : 11;

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
                                className="popover__arrow"
                                ref={arrowRef}
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
                                    <path
                                        d="M8.75061 0.999513C9.48105 0.415163 10.519 0.415162 11.2494 0.999512L20 8H0L8.75061 0.999513Z"
                                        className="popover__arrowPath"
                                    />
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
                                        onClick={() => setPopoverOpened(false)}
                                    />
                                </div>
                            )}
                            <div className="popover__body">
                                <div className="popover__content">{children} </div>
                            </div>
                            {primaryButton && (
                                <div className="popover__footer">
                                    {footerContent && footerContent}

                                    <div className="popover__footer_buttons">
                                        {secondaryButton && (
                                            <Button {...secondaryButton} size="medium" appearance="secondary">
                                                {secondaryButton.title}
                                            </Button>
                                        )}
                                        <Button {...primaryButton} size="medium" appearance="primary">
                                            {primaryButton.title}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export default Popover;
