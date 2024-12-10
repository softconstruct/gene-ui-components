import React, {
    useState,
    useContext,
    JSX,
    FC,
    cloneElement,
    Children,
    Fragment,
    useEffect,
    RefObject,
    useRef
} from "react";
import { shift, flip, offset } from "@floating-ui/core";
import {
    FloatingPortal,
    autoUpdate,
    useFloating,
    arrow,
    useHover,
    useInteractions,
    platform
} from "@floating-ui/react";
import { Placement } from "@floating-ui/utils";
import { ReferenceType } from "@floating-ui/react-dom";
import { isForwardRef } from "react-is";

// Components
import { IconProps } from "@geneui/icons";
import { GeneUIDesignSystemContext } from "../../providers/GeneUIProvider";

// Styles
import "./Tooltip.scss";

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

interface ITooltipProps {
    /**
     * Main content for the component.
     */
    text?: string;
    /**
     * If `true` the  component will be visible without any action.
     */
    alwaysShow?: boolean;
    /**
     * Will display the component in the specified location.
     */
    customPosition?: {
        left?: number;
        top?: number;
    };
    /**
     * Any valid React node.
     */
    children: JSX.Element | JSX.Element[];
    /**
     * Positions where will be displayed the Tooltip relates the child component.<br>
     * Possible values: `top | right | bottom | left`
     */
    position?: keyof typeof correctPosition;
    /**
     * Tooltip padding related to the target element
     */
    padding?: number;
    /**
     * In case of `false` value, the children component will rendered without Tooltip.
     */
    isVisible?: boolean;
    /**
     * Available style varieties of Empty atom to display <br/>
     * Possible values: `inverse | default`
     */
    appearance?: "inverse" | "default";
    /**
     * The `Icon` prop accepts a JSX element that will be displayed as an tooltip.
     */
    Icon?: FC<IconProps>;
}

type JSXWithRef = JSX.Element & { ref: RefObject<HTMLElement> };

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

const FindAndSetRef = <T extends object>(
    children: JSX.Element | JSX.Element[],
    childProps: T,
    componentRef: (node: ReferenceType | null) => void,
    checked: boolean,
    Tooltip: FC<ITooltipProps>
): JSX.Element[] => {
    let isChecked = checked;

    return Children.map(children, (node, i) => {
        const el = node as JSXWithRef;
        let newProps = {
            ...childProps
        };
        if (!React.isValidElement(el)) return null;

        if (el.type === Tooltip) {
            return null;
        }

        if (typeof el?.type === "string") {
            if (!el.ref && i === 0 && !isChecked) {
                isChecked = true;
                newProps = { ...newProps, ref: componentRef };
            }
            return cloneElement(el, newProps);
        }
        if (typeof el?.type === "function") {
            if (!el.ref) {
                newProps = { ...newProps, ref: componentRef };
            }
            return FindAndSetRef(cloneElement(el.type(el.props), newProps), newProps, componentRef, isChecked, Tooltip);
        }

        if (el?.type === Fragment && el.props.children) {
            return FindAndSetRef(el.props.children, newProps, componentRef, isChecked, Tooltip);
        }

        if (isForwardRef(el)) {
            return FindAndSetRef(el.type.render(el.props, el.ref), newProps, componentRef, isChecked, Tooltip);
        }
        return el && cloneElement(el, newProps);
    }) as JSX.Element[];
};

/**
A tooltip is a small, elevated surface that appears to provide contextual information when a user hovers over or focuses on a UI element.
Tooltips should be used to offer helpful plaintext information, not to communicate system feedback. Use a popover instead if you need to deliver structured information or enable interactions.
*/
const Tooltip: FC<ITooltipProps> = ({
    children,
    position = "top-right",
    text,
    customPosition,
    alwaysShow,
    padding = 10,
    isVisible = true,
    appearance = "default",
    Icon
}) => {
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const arrowRef = useRef<HTMLDivElement | null>(null);

    const { refs, floatingStyles, context, middlewareData, placement } = useFloating({
        open: alwaysShow || isPopoverOpen,
        placement: correctPosition[position],
        onOpenChange: setIsPopoverOpen,
        platform: {
            ...platform,
            isRTL: () => false
        },
        middleware: [
            offset(padding),
            flip({
                fallbackAxisSideDirection: "none",
                fallbackPlacements: positions,
                mainAxis: true
            }),
            arrow({ element: arrowRef }),
            shift(),
            {
                name: "getCustomPosition",
                fn: () =>
                    customPosition
                        ? {
                              x: customPosition?.left,
                              y: customPosition?.top
                          }
                        : {}
            }
        ],
        whileElementsMounted: autoUpdate
    });

    const hover = useHover(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

    const component = FindAndSetRef(children, getReferenceProps(), refs.setReference, false, Tooltip);
    useEffect(() => {
        if (component.length) {
            for (let i = 0; i < component.length; i++) {
                const node = component[i] as JSXWithRef;

                if (typeof node.ref === "function" && node.ref === refs.setReference) {
                    break;
                }

                if (node?.ref?.current) {
                    refs.setReference(node.ref.current as ReferenceType);
                    break;
                }
            }
        }
    }, [component]);

    if (!component.length) {
        return children;
    }
    const [currentDirection] = placement.split("-") as [keyof typeof staticSides];

    const staticSide = staticSides[currentDirection];

    const middlewareArrowData = middlewareData.arrow;

    const offsetFromEdge = 8;

    const arrowPosition = arrowPositions[placement];
    const getCorrectPosition = arrowPosition
        ? { [arrowPosition]: offsetFromEdge }
        : { insetInlineStart: middlewareArrowData?.x };

    return (
        <>
            {component}
            {isVisible && (alwaysShow || isPopoverOpen) && (
                <FloatingPortal root={geneUIProviderRef.current}>
                    <div
                        className={`tooltip tooltip_color_${appearance}  tooltip_position_${currentDirection}`}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        <div
                            className="tooltip__arrow"
                            ref={arrowRef}
                            style={{
                                ...getCorrectPosition,
                                top: middlewareArrowData?.y,
                                [staticSide!]: arrowRef.current ? `${-arrowRef.current.offsetWidth + 6}px` : 0
                            }}
                        >
                            <svg
                                width="12"
                                height="4"
                                viewBox="0 0 12 4"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path className="tooltip__arrowPath" d="M6 4L0 0L12 0L6 4Z" />
                            </svg>
                        </div>

                        <div className="tooltip__textWrapper">
                            <p className="tooltip__text">{text}</p>
                        </div>

                        {Icon && (
                            <div className="tooltip__icon">
                                <Icon size={16} />
                            </div>
                        )}
                    </div>
                </FloatingPortal>
            )}
        </>
    );
};

export { ITooltipProps, Tooltip as default };