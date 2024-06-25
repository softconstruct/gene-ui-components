import React, {
    useState,
    useContext,
    CSSProperties,
    JSX,
    MouseEvent,
    FC,
    PointerEvent,
    cloneElement,
    Children,
    Fragment,
    useEffect
} from 'react';
import { shift, flip, offset } from '@floating-ui/core';
import { FloatingPortal, autoUpdate, useFloating } from '@floating-ui/react';
import { Placement } from '@floating-ui/utils';
import { ReferenceType } from '@floating-ui/react-dom';

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
import { update } from 'draft-js/lib/DefaultDraftBlockRenderMap';
import { flushSync } from 'react-dom/cjs/react-dom.production.min';

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
     * The component will be visible without any action.
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
     * Disable/Enable auto repositions.
     */
    disableReposition?: boolean;
    /**
     * Positions where will be displayed the Tooltip relates the child component.<br> Possible values: `top | right | bottom | left`
     */
    position?: 'top' | 'right' | 'bottom' | 'left';
    /**
     * Tooltip padding from the target element
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
    /**
     * The action will triggered when the Tooltip component will clicked.
     */
    onClick?: (e: MouseEvent) => void;
}

const FindAndMergeRef = <T extends { onClick: (e: PointerEvent, el: JSX.Element) => void }>(
    children: JSX.Element | JSX.Element[],
    childProps: T,
    componentRef: (node: ReferenceType | null) => void
) =>
    Children.map(children, (el, i) => {
        const newProps = {
            ...childProps,
            onClick: (e: PointerEvent) => childProps?.onClick(e, el),
            ref: i === 0 ? componentRef : {}
        };

        if (el.type === Fragment && el.props.children) {
            return FindAndMergeRef(el.props.children, childProps, componentRef);
        }

        if (typeof el.type === 'string') {
            return cloneElement(el, newProps);
        } else if (typeof el.type === 'function') {
            return cloneElement(el.type(el.props), newProps);
        }
        return cloneElement(el, newProps);
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
    disableReposition = false,
    onClick = noop,
    padding = 5,
    screenType = 'desktop',
    isVisible = true,
    ...props
}) => {
    // @ts-ignore
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);

    const { isMobile } = useDeviceType(screenType);

    const [isPopoverOpen, setPopoverState] = useState(false);
    //window.print
    const mouseEnterHandler = () => !alwaysShow && setPopoverState(true);
    const mouseLeaveHandler = () => {
        !alwaysShow && setPopoverState(false);
    };

    const { refs, floatingStyles, context } = useFloating({
        open: alwaysShow || isPopoverOpen,
        placement: position,
        middleware: [
            offset(padding),
            flip({
                fallbackAxisSideDirection: 'none',
                fallbackPlacements: positions,
                mainAxis: !disableReposition
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
        onMouseLeave: mouseLeaveHandler,

        onClick: (e: PointerEvent, el: JSX.Element) => {
            const { onClick: onClickHandler } = el?.props;
            typeof onClickHandler === 'function' && onClickHandler(e);
            onClick(e);
        }
    };

    return (
        <>
            {FindAndMergeRef(children, childProps, refs.setReference)}
            {isVisible && (alwaysShow || isPopoverOpen) && (
                <FloatingPortal root={geneUIProviderRef.current}>
                    {checkNudged({ nudgedLeft: context.x, nudgedTop: context.y }) && (
                        <div
                            className={`tooltip-c-p s-${size}`}
                            ref={refs.setFloating}
                            style={{
                                ...style,
                                ...floatingStyles
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
