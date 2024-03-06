import React, {
    useState,
    useCallback,
    useEffect,
    useContext,
    CSSProperties,
    JSX,
    MouseEvent,
    FC,
    cloneElement
} from 'react';
import classnames from 'classnames';
import { shift, flip, offset } from '@floating-ui/core';
import { FloatingPortal, useFloating } from '@floating-ui/react';
import { Placement } from '@floating-ui/utils';
//configs
//@ts-ignore
import { positions } from 'configs';
//utils
//@ts-ignore
import { noop } from 'utils';
// Helpers
//@ts-ignore
import { useDeviceType } from 'hooks';
// Components
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';
// Styles
import './index.scss';

interface ICustomPosition {
    left?: number;
    top?: number;
}

export interface ITooltipProps {
    /**
     * Different sizes for 'Tooltip'.
     */
    size?: 'default' | 'small';
    /**
     * Text for 'Tooltip'.
     */
    text?: string;
    /**
     * Title for 'Tooltip'.
     */
    title?: string;
    /**
     * Style object, to have extra styles.
     */
    style?: CSSProperties;
    /**
     * Have always visible 'Tooltip'.
     */
    alwaysShow?: boolean;
    /**
     * Custom positions(left, top) for 'Tooltip'.
     */
    customPosition?: ICustomPosition;
    /**
     * Any valid React node.
     */
    children: JSX.Element;
    /**
     * Disable/Enable repositions.
     */
    disableReposition?: boolean;
    /**
     * 'Tooltip' position to be displayed
     */
    position?: Placement;

    /**
     * 'Tooltip' padding from the target element
     */
    padding?: number;
    screenType?: 'desktop' | 'mobile';
    /**
     * If isVisible is false, the component will render only children without a tooltip wrapped.
     */
    isVisible?: boolean;
    onClick: (e: MouseEvent) => void;
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
    const { isMobile } = useDeviceType(screenType);
    const [isPopoverOpen, setPopoverState] = useState(false);
    // @ts-ignore
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);

    const mouseEnterHandler = () => !alwaysShow && setPopoverState(true);
    const mouseLeaveHandler = () => !alwaysShow && setPopoverState(false);

    const getCustomPosition = {
        name: 'getCustomPosition',
        fn() {
            return customPosition
                ? {
                      x: customPosition?.left,
                      y: customPosition?.top
                  }
                : {};
        }
    };

    const { refs, floatingStyles, context } = useFloating({
        open: alwaysShow || isPopoverOpen,
        placement: position,

        middleware: [
            offset(padding),
            flip({
                fallbackAxisSideDirection: 'none',
                fallbackPlacements: positions
            }),
            shift({
                mainAxis: !disableReposition
            }),
            getCustomPosition
        ]
    });

    useEffect(() => {
        if (children.props.disabled) {
            mouseLeaveHandler();
        }
    }, [children.props.disabled]);

    const checkNudged = useCallback(
        ({ nudgedLeft, nudgedTop }) => (isMobile ? !(nudgedTop || nudgedLeft) : true),
        [isMobile]
    );
    return (
        <>
            {isVisible ? (
                <>
                    {cloneElement(children, {
                        onMouseEnter: mouseEnterHandler,
                        onMouseLeave: mouseLeaveHandler,
                        onClick: (e) => {
                            const { onClick: onClickHandler } = children.props;
                            typeof onClickHandler === 'function' && onClickHandler(e);
                            onClick(e);
                        },
                        ref: refs.setReference
                    })}

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
