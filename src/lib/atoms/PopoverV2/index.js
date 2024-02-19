import React, { useState, useMemo, useEffect, forwardRef, useCallback, useRef, useContext } from 'react';
import { Popover as TinyPopover } from 'react-tiny-popover-latest';
import { useSwipeable } from 'react-swipeable';
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Helpers
import { noop, stopEvent, debounce } from 'utils';
import { useDeviceType, useClickOutside } from 'hooks';
import { screenTypes, popoverV2Config } from 'configs';

// Components
import Scrollbar from '../Scrollbar';
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';

// Styles
import './index.scss';

const PopoverV2 = forwardRef((props, ref) => {
    const {
        nativeOutsideClick,
        extendTargetWidth,
        disableReposition,
        disableTransform,
        containerParent,
        scrollbarNeeded,
        onClickOutside,
        trackClassName,
        toggleHandler,
        cornerRadius,
        getScrollRef,
        onSwipedDown,
        contentRef,
        screenType,
        minHeight,
        maxHeight,
        className,
        swipeable,
        children,
        position,
        disabled,
        Content,
        padding,
        behave,
        Header,
        Footer,
        isOpen,
        align,
        scrollbarProps,
        ...restProps
    } = props;

    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);

    const popoverRef = useRef(null);
    const popoverBodyRef = useRef(null);
    const popoverTrackRef = useRef(null);

    const [updateKey, setUpdateKey] = useState(0);
    const [targetWidth, setTargetWidth] = useState(null);
    const [popoverOpened, setPopoverOpened] = useState(false);
    const [swipingPosition, setSwipingPosition] = useState(0);

    const { isMobile } = useDeviceType(screenType);

    const isControlled = 'isOpen' in props;
    const popoverState = isControlled ? isOpen : popoverOpened;
    const positions = useMemo(() => (Array.isArray(position) ? position : [position]), [position]);

    useEffect(() => {
        document.documentElement.classList[popoverState ? 'add' : 'remove'](popoverV2Config.onOpenClassName);
    }, [popoverState]);

    useEffect(() => {
        setUpdateKey(Date.now());
    }, [isMobile, cornerRadius]);

    useEffect(() => {
        if (popoverRef.current && popoverRef.current?.offsetWidth) {
            setTargetWidth(popoverRef.current?.offsetWidth);
            const debouncedHandleResize = debounce(() => {
                setTargetWidth(popoverRef.current?.offsetWidth);
            }, 20);

            window.addEventListener('resize', debouncedHandleResize);
            return () => window.removeEventListener('resize', debouncedHandleResize);
        }
    }, [popoverRef.current?.offsetWidth]);

    /* *** START SWIPE FUNCTIONALITY *** */
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
    /* *** END SWIPE FUNCTIONALITY *** */

    /* *** START OPEN/CLOSE FUNCTIONALITY *** */
    const togglePopupOpened = useCallback(
        (event) => {
            stopEvent(event);
            if (isControlled) {
                toggleHandler(event, isOpen);
            } else {
                setPopoverOpened((status) => {
                    toggleHandler(event, !status);
                    return !status;
                });
            }
        },
        [isControlled, toggleHandler, isOpen]
    );

    const handleTrackClick = useCallback(
        (event) => {
            if (!disabled) {
                if (behave === 'toggle') {
                    togglePopupOpened(event);
                } else if (!isControlled && behave === 'open') {
                    setPopoverOpened(true);
                }
            }
        },
        [disabled, isControlled, behave, togglePopupOpened]
    );

    const handleOutsideClick = useClickOutside((event) => {
        if (popoverRef && !popoverRef.current.contains(event.target)) {
            onClickOutside(event);
            if (!isControlled) {
                setPopoverOpened(false);
            }
        }
    });
    /* *** END OPEN/CLOSE FUNCTIONALITY *** */

    /* *** START GENERATE REFS *** */
    const generatePopoverRef = useCallback(
        (element) => {
            popoverRef && (popoverRef.current = element);
            ref && (ref.current = element);
        },
        [ref]
    );

    const generateContentRef = useCallback(
        (element) => {
            isMobile && getScrollRef(element);
            handleOutsideClick(element);
            if (contentRef) {
                typeof contentRef === 'function' ? contentRef(element) : (contentRef.current = element);
            }
        },
        [isMobile, contentRef, getScrollRef]
    );
    /* *** END GENERATE REFS *** */
    const portalContent = (
        <div {...swipeHandlers}>
            <ul
                onClick={stopEvent}
                ref={generateContentRef}
                className="popover-content"
                style={{
                    bottom: swipingPosition,
                    width: (extendTargetWidth && !isMobile && targetWidth) || null
                }}
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
            {isMobile && <div className="popover-mobile-backdrop" onClick={togglePopupOpened} />}
        </div>
    );

    const childElement = useMemo(
        () => (
            <div
                onClick={handleTrackClick}
                className={classnames('popover-track cursor-pointer', trackClassName, {
                    'popover-opened': popoverState,
                    'popover-disabled': disabled
                })}
            >
                {children}
            </div>
        ),
        [popoverTrackRef, children, trackClassName, popoverState, disabled, handleTrackClick]
    );

    const containerParentMemo = useMemo(
        () =>
            containerParent || geneUIProviderRef.current
                ? {
                      containerParent: containerParent || geneUIProviderRef.current
                  }
                : {},
        [containerParent, geneUIProviderRef.current]
    );

    if (!Content) {
        return childElement;
    }

    return (
        <TinyPopover
            key={updateKey}
            ref={generatePopoverRef}
            align={align}
            positions={positions}
            padding={padding}
            onClickOutside={nativeOutsideClick}
            isOpen={popoverState}
            content={portalContent}
            reposition={!isMobile && disableReposition}
            containerStyle={{
                overflow: null
            }}
            containerClassName={classnames('popover-positioner', `cr-${cornerRadius}`, className, {
                'mobile-view': isMobile,
                'popover-positioner-disable': disableTransform && containerParent && !isMobile
            })}
            children={childElement}
            {...containerParentMemo}
            {...restProps}
        />
    );
});

PopoverV2.propTypes = {
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
        PropTypes.oneOf(popoverV2Config.position),
        PropTypes.arrayOf(PropTypes.oneOf(popoverV2Config.position))
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
    align: PropTypes.oneOf(popoverV2Config.align),
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
    cornerRadius: PropTypes.oneOf(popoverV2Config.cornerRadius),
    /**
     * The switch between mobile and desktop version of Popover will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside.
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Specify does Popover needs to be toggled on child click
     */
    behave: PropTypes.oneOf(popoverV2Config.behave),
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
    /**
     * This number specifies the inset around your containerParent's border
     * that boundary violations are determined at. Defaults to 0. Can be negative.
     */
    boundaryInset: PropTypes.number,
    /**
     * If you want to apply styles to the popup tracker div where your children are using
     * stylesheets, you can provide a custom class name for the container here.
     */
    trackClassName: PropTypes.string,
    /*
     * After DOWN swipe  (SwipeEventData) => void
     */
    onSwipedDown: PropTypes.func,
    swipeable: PropTypes.bool,
    /*
     * If react-tiny-popover detects a click event outside of the target and outside
     * of the popover, you may handle this event here, in the form of (e: MouseEvent) => void.
     */
    onClickOutside: PropTypes.func,
    nativeOutsideClick: PropTypes.func,
    /*
     * props for scrollbar
     */
    scrollbarProps: PropTypes.shape({
        ...Scrollbar.propTypes
    }),
    /*
     * When disableTransform is true and containerParent has ref.current, the popover generates in a dropdown wrapper instead of closing the body tag, and the position will not calculate.
     */
    disableTransform: PropTypes.bool,
    /*
     * Provide an HTML element ref here to have your popover content appended to that element rather than document.body. This is useful if you'd like your popover to sit at a particular place within the DOM.
     */
    containerParent: PropTypes.object
};

PopoverV2.defaultProps = {
    cornerRadius: popoverV2Config.cornerRadius[0],
    position: popoverV2Config.position,
    align: popoverV2Config.align[0],
    toggleHandler: noop,
    behave: popoverV2Config.behave[0],
    extendTargetWidth: true,
    disableReposition: true,
    disableTransform: false,
    minHeight: 0,
    maxHeight: 510,
    padding: 10,
    getScrollRef: noop,
    scrollbarNeeded: true,
    swipeable: false,
    onSwipedDown: noop,
    onClickOutside: noop,
    nativeOutsideClick: noop
};

export default PopoverV2;
