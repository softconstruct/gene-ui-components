import React, {
    useState,
    useContext,
    CSSProperties,
    JSX,
    MouseEvent,
    FC,
    cloneElement,
    Children,
    Fragment,
    useEffect,
    RefObject,
    useMemo
} from 'react';
import { shift, flip, offset } from '@floating-ui/core';
import { FloatingPortal, autoUpdate, useFloating } from '@floating-ui/react';
import { Placement } from '@floating-ui/utils';
import { ReferenceType } from '@floating-ui/react-dom';
import { isForwardRef } from 'react-is';

// Utils
//@ts-ignore
import { noop } from 'utils';

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

    //TODO:REmove after tests
    /**
     * The action will triggered when the Tooltip component will clicked.
     */
    onClick?: (e: MouseEvent) => void;
}

type JSXWithRef = JSX.Element & { ref: RefObject<unknown> };

const FindAndSetRef = <T extends object>(
    children: JSX.Element | JSX.Element[],
    childProps: T,
    componentRef: (node: ReferenceType | null) => void
) =>
    Children.map(children, (node, i) => {
        const el = node as JSXWithRef;

        let newProps = {
            ...childProps
        };
        if (el?.type === Fragment && el.props.children) {
            return FindAndSetRef(el.props.children, newProps, componentRef);
        }
        if (isForwardRef(el)) {
            return FindAndSetRef(el.type.render(el.props, el.ref), newProps, componentRef);
        }

        if (typeof el?.type === 'string') {
            if (!el.ref && i === 0) {
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

        return el && cloneElement(el, newProps);
    });

const Tooltip: FC<ITooltipProps> = ({
    children,
    position = 'top',
    size = 'default',
    style,
    text,
    title,
    customPosition,
    alwaysShow,
    onClick = noop,
    padding = 5,
    screenType = 'desktop',
    isVisible = true,
    ...props
}) => {
    // @ts-ignore
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const { isMobile } = useDeviceType(screenType);
    const [isPopoverOpen, setIsPopoverState] = useState(false);
    const mouseEnterHandler = () => {
        !alwaysShow && setIsPopoverState(true);
    };
    const mouseLeaveHandler = () => {
        !alwaysShow && setIsPopoverState(false);
    };

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

    let component = useMemo(() => FindAndSetRef(children, childProps, refs.setReference), [children, childProps]);

    useEffect(() => {
        component.forEach((element: JSX.Element) => {
            const node = element as JSXWithRef;
            if (node?.ref?.current) {
                refs.setReference(node.ref.current as ReferenceType);
            }
        });
    }, [component]);

    console.log(component);

    return (
        <>
            {component}
            {isVisible && (alwaysShow || isPopoverOpen) && (
                //@ts-ignore
                <FloatingPortal root={geneUIProviderRef.current}>
                    {checkNudged({ nudgedLeft: context.x, nudgedTop: context.y }) && (
                        <div
                            className={`tooltip-c-p s-${size} ${position}`}
                            ref={refs.setFloating}
                            style={{
                                ...style,
                                ...floatingStyles,
                                zIndex: 400
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
