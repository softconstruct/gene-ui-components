import React, { useState, useEffect, useContext, CSSProperties, JSX, MouseEvent, FC, PointerEvent } from 'react';
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

const positions: Placement[] = ['top', 'right', 'bottom', 'left'];
const letterBufferSpace = 2;

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
    const [childElementWidth, setChildElementWidth] = useState<string | number>('fit-content');

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
        if (children?.props.disabled) {
            mouseLeaveHandler();
        }
    }, [children?.props.disabled]);

    const checkNudged = ({ nudgedLeft, nudgedTop }) => (isMobile ? !(nudgedTop || nudgedLeft) : true);

    const { debounceCallback, clearDebounce } = useDebounce();

    useEffect(() => {
        const debouncedValue = elements.domReference?.firstElementChild?.scrollWidth;

        if (debouncedValue) {
            debounceCallback(() => setChildElementWidth(debouncedValue + letterBufferSpace), 1000);
        }

        return () => {
            clearDebounce();
        };
    }, [title, text, elements.domReference?.firstElementChild?.scrollWidth]);

    useEffect(() => {
        debounceCallback(update, 100);

        return () => {
            clearDebounce();
        };
    }, [title, text, width, height, elements.domReference?.getBoundingClientRect().x]);

    return (
        <>
            {isVisible ? (
                <>
                    <div
                        onMouseEnter={mouseEnterHandler}
                        onMouseLeave={mouseLeaveHandler}
                        onClick={(e: PointerEvent<HTMLDivElement>) => {
                            const { onClick: onClickHandler } = children?.props;
                            typeof onClickHandler === 'function' && onClickHandler(e);
                            onClick(e);
                        }}
                        ref={refs.setReference}
                        className="tooltip-wrapper"
                        style={{
                            width: childElementWidth
                        }}
                    >
                        {children}
                    </div>
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
