import React, {
    useState,
    useContext,
    CSSProperties,
    JSX,
    FC,
    cloneElement,
    Children,
    Fragment,
    useEffect,
    RefObject,
    useMemo,
    useRef
} from 'react';
import { shift, flip, offset } from '@floating-ui/core';
import { FloatingPortal, autoUpdate, useFloating, arrow, FloatingArrow } from '@floating-ui/react';
import { Placement } from '@floating-ui/utils';
import { ReferenceType } from '@floating-ui/react-dom';
import { isForwardRef } from 'react-is';

import { InfoOutline } from '@geneui/icons';

// Hooks
//@ts-ignore
import { useDeviceType } from 'hooks';

// Components
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';

// Styles
import './Tooltip.scss';

const positions: Placement[] = ['top', 'right', 'bottom', 'left'];

interface ICustomPosition {
    left?: number;
    top?: number;
}

export interface ITooltipProps {
    /**
     * The Tooltip component size<br> Possible values: `default | small`
     */
    size?: 'default' | 'small';
    /**
     * Main content for the component.
     */
    text?: string;
    /**
     * Title for the component.
     */
    title?: string;
    /**
     * Style object, to have extra styles.
     */
    style?: CSSProperties;
    /**
     * If `true` the  component will be visible without any action.
     */
    alwaysShow?: boolean;
    /**
     * Will display the component in the specified location.
     */
    customPosition?: ICustomPosition;
    /**
     * Any valid React node.
     */
    children: JSX.Element | JSX.Element[];
    /**
     * Positions where will be displayed the Tooltip relates the child component.<br> Possible values: `top | right | bottom | left`
     */
    position?: 'top' | 'right' | 'bottom' | 'left';
    /**
     * Tooltip padding related to the target element
     */
    padding?: number;
    /**
     * Control with screenType  appearance of component
     */
    screenType?: 'desktop' | 'mobile';
    /**
     * In case of `false` value, the children component will rendered without Tooltip.
     */
    isVisible?: boolean;
}

type JSXWithRef = JSX.Element & { ref: RefObject<HTMLElement> };

const FindAndSetRef = <T extends object>(
    children: JSX.Element | JSX.Element[],
    childProps: T,
    componentRef: (node: ReferenceType | null) => void,
    checked: Boolean = false
) => {
    return Children.map(children, (node, i) => {
        const el = node as JSXWithRef;
        let newProps = {
            ...childProps
        };

        if (typeof el?.type === 'string') {
            if (!el.ref && i === 0 && !checked) {
                checked = true;
                newProps = { ...newProps, ref: componentRef };
            }
            return cloneElement(el, newProps);
        }

        if (typeof el?.type === 'function') {
            if (!el.ref) {
                newProps = { ...newProps, ref: componentRef };
            }
            return cloneElement(el.type(el.props), newProps);
        }

        if (el?.type === Fragment && el.props.children) {
            return FindAndSetRef(el.props.children, newProps, componentRef, checked);
        }

        if (isForwardRef(el)) {
            return FindAndSetRef(el.type.render(el.props, el.ref), newProps, componentRef, checked);
        }
        return el && cloneElement(el, newProps);
    }) as JSXWithRef[];
};

const Tooltip: FC<ITooltipProps> = ({
    children,
    position = 'top',
    size = 'default',
    style,
    text,
    title,
    customPosition,
    alwaysShow,
    padding = 5,
    screenType = 'desktop',
    isVisible = true,
    ...props
}) => {
    // @ts-ignore
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const { isMobile } = useDeviceType(screenType);
    const [isPopoverOpen, setIsPopoverState] = useState(false);

    const mouseEnterHandler = () => !alwaysShow && setIsPopoverState(true);
    const mouseLeaveHandler = () => !alwaysShow && setIsPopoverState(false);
    const arrowRef = useRef<HTMLDivElement | null>(null);

    const { refs, floatingStyles, context, middlewareData, placement } = useFloating({
        open: alwaysShow || isPopoverOpen,
        placement: position,
        middleware: [
            offset(padding),
            flip({
                fallbackAxisSideDirection: 'none',
                fallbackPlacements: positions,
                mainAxis: true
            }),
            arrow({ element: arrowRef }),
            shift(),
            {
                name: 'getCustomPosition',
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

    const checkNudged = ({ nudgedLeft, nudgedTop }) => (isMobile ? !(nudgedTop || nudgedLeft) : true);

    const childProps = {
        onMouseEnter: mouseEnterHandler,
        onMouseLeave: mouseLeaveHandler
    };

    const component = useMemo(() => FindAndSetRef(children, childProps, refs.setReference), [children, childProps]);

    useEffect(() => {
        for (let i = 0; i < component.length; i++) {
            const node = component[i];
            if (typeof node.ref === 'function' && node.ref === refs.setReference) {
                break;
            }

            if (node?.ref?.current) {
                refs.setReference(node.ref.current as ReferenceType);
                break;
            }
        }
    }, [component]);

    const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
    }[placement];

    return (
        <>
            {component}
            {isVisible && (alwaysShow || isPopoverOpen) && (
                <FloatingPortal root={geneUIProviderRef.current}>
                    {checkNudged({ nudgedLeft: context.x, nudgedTop: context.y }) && (
                        <div
                            className={`tooltip tooltip_color_inverse s-${size} tooltip_position_${position}`}
                            ref={refs.setFloating}
                            style={{
                                ...style,
                                ...floatingStyles
                            }}
                            {...props}
                        >
                            <div
                                className="tooltip__arrow"
                                ref={arrowRef}
                                style={{
                                    left: middlewareData.arrow?.x,
                                    top: middlewareData.arrow?.y,
                                    [staticSide]: arrowRef.current ? `${-arrowRef?.current?.offsetWidth + 5}px` : 0
                                }}
                            />
                            <p className="tooltip__text">{text}</p>
                            <InfoOutline size={16} />
                        </div>
                    )}
                </FloatingPortal>
            )}
        </>
    );
};

export default Tooltip;
