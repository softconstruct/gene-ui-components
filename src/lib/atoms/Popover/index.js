import React, { useState, Children, useMemo, useEffect, forwardRef, useCallback, useRef, useContext } from 'react';
import ReactPopover from 'react-tiny-popover';
import { useSwipeable } from 'react-swipeable';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Helpers
import { useDeviceType, useUpdatableRef } from 'hooks';
import { noop, guid, stopEvent } from 'utils';
import { screenTypes, popoverConfig } from 'configs';

// Components
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';

// Local Components
import Portal from '../Portal';
import Scrollbar from '../Scrollbar';

// Styles
import './index.scss';

const setRef = (ref, currentRef) => {
    if (!ref) return;
    if (typeof ref === 'function') {
        ref(currentRef);
    } else {
        ref.current = currentRef;
    }
};

const Popover = forwardRef((props, ref) => {
    const {
        extendTargetWidth,
        disableReposition,
        toggleHandler,
        cornerRadius,
        screenType,
        minHeight,
        maxHeight,
        className,
        children,
        position,
        disabled,
        Content,
        padding,
        behave,
        Header,
        Footer,
        align,
        scrollbarNeeded,
        contentRef,
        isOpen,
        getScrollRef,
        swipeable,
        onSwipedDown,
        scrollbarProps,
        fullHeight,
        ...restProps
    } = props;

    const id = guid();
    const popoverBodyRef = useRef(null);
    const [popoverOpened, setPopoverOpened] = useState(false);
    const isControlled = 'isOpen' in props;
    const popoverState = isControlled ? isOpen : popoverOpened;
    const { isMobile } = useDeviceType(screenType);
    const isToggle = behave === 'toggle';
    const [targetWidth, setTargetWidth] = useState(null);
    const [swipingPosition, setSwipingPosition] = useState(0);
    const [portalContainerRef, updatePortalContainerRef] = useUpdatableRef(null);

    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);

    const checkBodyContains = (event) => popoverBodyRef.current.contains(event.target);

    const handleSwiped = (event) => setSwipingPosition(0);

    const handleSwipedDown = (touchEvent) => {
        !checkBodyContains(touchEvent.event) && onSwipedDown(touchEvent);
    };

    const handleSwiping = useCallback(
        ({ deltaY, event }) => {
            if (checkBodyContains(event)) {
                stopEvent(event);
            } else if (deltaY >= 0) {
                setSwipingPosition(deltaY * -1);
            }
        },
        [popoverBodyRef, setSwipingPosition]
    );

    const swipeHandlers = useSwipeable(
        useMemo(
            () =>
                swipeable
                    ? {
                          onSwipedDown: handleSwipedDown,
                          onSwiping: handleSwiping,
                          onSwiped: handleSwiped
                      }
                    : {},
            [swipeable, handleSwipedDown, handleSwiping, handleSwiped]
        )
    );

    const popoverStateChange = useCallback(
        (event) => {
            stopEvent(event);
            if (isControlled) {
                toggleHandler(event, isOpen);
            } else {
                setPopoverOpened((isPopoverOpened) => {
                    toggleHandler(event, !isPopoverOpened);
                    return !isPopoverOpened;
                });
            }
        },
        [isControlled, toggleHandler, isOpen]
    );

    const handlePopoverStateChange = useCallback(
        (event) => {
            Children.map(children, (child) => child.props.onClick && child.props.onClick(event));

            popoverStateChange(event);
        },
        [children, popoverStateChange]
    );

    const setPopoverRef = (popoverRef) => {
        setRef(ref, popoverRef);
        const rect = popoverRef && popoverRef.target.getBoundingClientRect();
        setTargetWidth(rect && rect.width);
    };

    const handleClick = useCallback(
        (e) => {
            if (!disabled) {
                popoverState ? isToggle && handlePopoverStateChange(e) : handlePopoverStateChange(e);
            }
        },
        [popoverState, isToggle, disabled, handlePopoverStateChange]
    );

    const generateContentRef = useCallback(
        (element) => {
            isMobile && getScrollRef(element);

            if (contentRef) {
                typeof contentRef === 'function' ? contentRef(element) : (contentRef.current = element);
            }
        },
        [isMobile, contentRef, getScrollRef]
    );

    const portalContent = (
        <>
            <ul
                onClick={stopEvent}
                ref={generateContentRef}
                className={classnames('popover-content', { fullHeight: fullHeight && isMobile })}
                style={{ bottom: swipingPosition }}
            >
                {Header && <li className="popover-header">{Header}</li>}
                <li ref={popoverBodyRef} className="popover-body">
                    {scrollbarNeeded && !isMobile ? (
                        <Scrollbar
                            ref={(scrollbar) => {
                                scrollbar && getScrollRef(scrollbar.view);
                            }}
                            autoHeight
                            autoHeightMax={maxHeight}
                            autoHeightMin={minHeight}
                            {...scrollbarProps}
                        >
                            {Content}
                        </Scrollbar>
                    ) : (
                        Content
                    )}
                </li>
                {Footer && <li className="popover-footer">{Footer}</li>}
            </ul>
            {isMobile && <div className="popover-mobile-backdrop" onClick={popoverStateChange} />}
        </>
    );

    const getChild = useCallback(
        (child, index) =>
            React.cloneElement(child, {
                key: index,
                onClick: (e) => handleClick(e),
                className: classnames(child.props.className, 'cursor-pointer', {
                    'popover-opened': popoverState,
                    'popover-disabled': disabled
                })
            }),
        [handleClick, popoverState, disabled]
    );

    const childElements = useMemo(() => Children.map(children, getChild), [getChild, children]);

    useEffect(() => {
        !popoverState && updatePortalContainerRef(null);
    }, [popoverState]);

    return Content ? (
        <>
            <ReactPopover
                contentDestination={geneUIProviderRef.current}
                disableReposition={disableReposition}
                ref={setPopoverRef}
                isOpen={popoverState}
                position={position}
                align={align}
                onClickOutside={handlePopoverStateChange}
                containerClassName={classnames(`popover-positioner`, `cr-${cornerRadius}`, className, {
                    'mobile-view': isMobile
                })}
                transitionDuration={-1}
                padding={padding}
                content={
                    <div {...swipeHandlers}>
                        <div
                            ref={updatePortalContainerRef}
                            id={id}
                            style={{
                                width: (extendTargetWidth && !isMobile && targetWidth) || null
                            }}
                        />
                    </div>
                }
                containerStyle={{
                    overflow: null
                }}
                {...restProps}
            >
                {childElements}
            </ReactPopover>
            {portalContainerRef.current && (
                <Portal isOpen container={portalContainerRef.current}>
                    {portalContent}
                </Portal>
            )}
        </>
    ) : (
        childElements
    );
});

Popover.propTypes = {
    /**
     * The component that need to be displayed in the Popover. Any valid React node
     */
    Content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /**
     * The component that need to be displayed as Popover header. Any valid React node
     */
    Header: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /**
     * The component that need to be displayed as Popover footer. Any valid React node
     */
    Footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /**
     * The component which click needs to trigger the Popover to open. Need to passed as child to Popover. Any valid React node
     */
    children: PropTypes.node,
    /**
     * The Popover will get the width of its child. The property will not work when "width" prop is specified
     */
    extendTargetWidth: PropTypes.bool,
    /**
     * The Popover "Content" minimum scroll height
     */
    minHeight: PropTypes.number,
    /**
     * The Popover "Content" maximum scroll height. Will not work when the "screenType" is "mobile"
     */
    maxHeight: PropTypes.number,
    /**
     * Use this prop to control the Popover. Note the component will start not to open and close automatically
     */
    isOpen: PropTypes.bool,
    /**
     * Popover position to be displayed
     */
    position: PropTypes.oneOfType([
        PropTypes.oneOf(popoverConfig.position),
        PropTypes.arrayOf(PropTypes.oneOf(popoverConfig.position))
    ]),
    /**
     * Will called each time the popover need to be toggled(child click, close button click, backdrop click).
     * (event: Event, isOpen: bool) => void
     */
    toggleHandler: PropTypes.func,
    /**
     * Possible values are start, center, and end.
     * If start is specified, the popover content's top or left location is aligned with its target's.
     * With end specified, the content's bottom or right location is aligned with its target's.
     * If center is specified, the popover content and target's centers are aligned.
     */
    align: PropTypes.oneOf(popoverConfig.align),
    /**
     * If you'd like to apply styles to the single container div that your popover content is rendered within via stylesheets,
     * you can specify a custom className for the container here.
     */
    className: PropTypes.string,
    /**
     * This number determines the gap, in pixels, between your target content and your popover content
     */
    padding: PropTypes.number,
    /**
     * If this property is enabled, rather than the popover content repositioning on a boundary collision,
     * the popover content container will move beyond the window's bounds.
     * You are, however, supplied with nudgedLeft and nudgedTop values, so you may choose to handle content overflow as you wish.
     */
    disableReposition: PropTypes.bool,
    /**
     * Popover corner radius
     */
    cornerRadius: PropTypes.oneOf(popoverConfig.cornerRadius),
    /**
     * The switch between mobile and desktop version of Popover will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside.
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Specify does Popover needs to be toggled on child click
     */
    behave: PropTypes.oneOf(popoverConfig.behave),
    /**
     * Given content prop can have its own scroll, and with this props we can use/not use default scroll that has popover
     */
    scrollbarNeeded: PropTypes.bool,
    /**
     * Popover content ref
     */
    contentRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),

    disabled: PropTypes.bool,
    getScrollRef: PropTypes.func,

    /*
     * After DOWN swipe  (SwipeEventData) => void
     */
    onSwipedDown: PropTypes.func,
    /*
     * props for scrollbar
     */
    scrollbarProps: PropTypes.shape({
        ...Scrollbar.propTypes
    }),
    /*
     * Popup content opens with full height. Mobile only property.
     */
    fullHeight: PropTypes.bool,
    swipeable: PropTypes.bool
};

Popover.defaultProps = {
    cornerRadius: popoverConfig.cornerRadius[0],
    position: popoverConfig.position,
    align: popoverConfig.align[0],
    toggleHandler: noop,
    behave: popoverConfig.behave[0],
    fullHeight: false,
    extendTargetWidth: true,
    disableReposition: true,
    minHeight: 0,
    maxHeight: 510,
    padding: 10,
    getScrollRef: noop,
    scrollbarNeeded: true,
    swipeable: false,
    onSwipedDown: noop
};

export default Popover;
