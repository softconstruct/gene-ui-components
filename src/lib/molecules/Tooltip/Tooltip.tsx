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
    RefObject
} from 'react';
import { shift, flip, offset } from '@floating-ui/core';
import { FloatingPortal, autoUpdate, useFloating } from '@floating-ui/react';
import { Placement } from '@floating-ui/utils';
import { ReferenceType } from '@floating-ui/react-dom';
import { isForwardRef } from 'react-is';

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

type JSXWithRef = JSX.Element & { ref: RefObject<unknown> };

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

        if (typeof el?.type === 'string') {
            if (!el.ref && i === 0 && !isChecked) {
                isChecked = true;
                newProps = { ...newProps, ref: componentRef };
            }
            return cloneElement(el, newProps);
        }
        if (typeof el?.type === 'function') {
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

    const { refs, floatingStyles, context } = useFloating({
        open: alwaysShow || isPopoverOpen,
        placement: position,
        middleware: [
            offset(padding),
            flip({
                fallbackAxisSideDirection: 'none',
                fallbackPlacements: positions,
                mainAxis: true
            }),
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

    const component = FindAndSetRef(children, childProps, refs.setReference, false, Tooltip);

    useEffect(() => {
        if (component.length) {
            for (let i = 0; i < component.length; i++) {
                const node = component[i] as JSXWithRef;

                if (typeof node.ref === 'function' && node.ref === refs.setReference) {
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

    return (
        <>
            {component}
            {isVisible && (alwaysShow || isPopoverOpen) && (
                <FloatingPortal root={geneUIProviderRef.current}>
                    {checkNudged({ nudgedLeft: context.x, nudgedTop: context.y }) && (
                        <div
                            className={`tooltip-c-p s-${size} ${position}`}
                            ref={refs.setFloating}
                            style={{
                                ...style,
                                ...floatingStyles,
                                zIndex: 400 //TODO: Remove after 3.0.0
                            }}
                            {...props}
                        >
                            {(title || text) && (
                                <div className="tooltip-content">
                                    {title && <div className="tooltip-title">{title}</div>}
                                    {text && <div className="tooltip-text">{text}</div>}
                                </div>
                            )}
                        </div>
                    )}
                </FloatingPortal>
            )}
        </>
    );
};

export default Tooltip;
