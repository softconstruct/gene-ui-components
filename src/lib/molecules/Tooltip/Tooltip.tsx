import React, {
    useState,
    useEffect,
    useContext,
    CSSProperties,
    JSX,
    MouseEvent,
    FC,
    PointerEvent,
    cloneElement,
    Children
} from 'react';
import classnames from 'classnames';
import { shift, flip, offset } from '@floating-ui/core';
import { FloatingPortal, autoUpdate, useFloating } from '@floating-ui/react';
import { Placement } from '@floating-ui/utils';

// Utils
//@ts-ignore
import { noop } from 'utils';

// Hooks
//@ts-ignore
import { useDeviceType, useDebounce, useWindowSize } from 'hooks';

// Components
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';

// Styles
import './Tooltip.scss';
import { ReferenceType } from '@floating-ui/react-dom';

const positions: Placement[] = ['top', 'right', 'bottom', 'left'];

interface ICustomPosition {
    left?: number;
    top?: number;
}

export interface ITooltipProps {
    /**
     * The Tooltip component size
     * Possible values: `default | small`
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
    children: JSX.Element;
    /**
     * Disable/Enable auto repositions.
     */
    disableReposition?: boolean;
    /**
     * Positions where will be displayed the Tooltip relates the child component.
     * Possible values: `top | right | bottom | left`
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
    children: JSX.Element,
    childProps: T,
    componentRef: (node: ReferenceType | null) => void
) =>
    Children.map(children, (el, i) => {
        const onClick = (e: PointerEvent) => childProps?.onClick(e, el);
        const newProps = { ...childProps, onClick, ref: i === 0 ? componentRef : {} };
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
    const { width, height } = useWindowSize();

    const [isPopoverOpen, setPopoverState] = useState(false);

    const mouseEnterHandler = () => !alwaysShow && setPopoverState(true);
    const mouseLeaveHandler = () => !alwaysShow && setPopoverState(false);

    const { refs, floatingStyles, context, update, elements } = useFloating({
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

    useEffect(() => {
        if (alwaysShow) {
            window.addEventListener('scroll', update);
        }

        return () => window.removeEventListener('scroll', update);
    }, [alwaysShow]);

    useEffect(() => {
        if (children?.props?.disabled) {
            mouseLeaveHandler();
        }
    }, [children?.props?.disabled]);

    const checkNudged = ({ nudgedLeft, nudgedTop }) => (isMobile ? !(nudgedTop || nudgedLeft) : true);

    const { debounceCallback, clearDebounce } = useDebounce();

    useEffect(() => {
        debounceCallback(update, 100);

        return () => {
            clearDebounce();
        };
    }, [title, text, width, height, elements.domReference?.getBoundingClientRect().x]);

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
            {isVisible ? (
                <>
                    {FindAndMergeRef(children, childProps, refs.setReference)}

                    {(alwaysShow || isPopoverOpen) && (
                        <FloatingPortal root={geneUIProviderRef.current}>
                            {checkNudged({ nudgedLeft: context.x, nudgedTop: context.y }) && (
                                <div
                                    className={classnames('tooltip-c-p', `s-${size}`)}
                                    ref={refs.setFloating}
                                    style={{
                                        zIndex: 10,
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
            ) : (
                children
            )}
        </>
    );
};

export default Tooltip;
