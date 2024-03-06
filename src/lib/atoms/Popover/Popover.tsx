import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    useContext,
    MouseEvent,
    FC,
    cloneElement,
    CSSProperties,
    MutableRefObject
} from 'react';
import { autoUpdate, flip, offset, shift, useDismiss, useFloating, useId, FloatingPortal } from '@floating-ui/react';
import classnames from 'classnames';
import { Placement } from '@floating-ui/utils';
import { SwipeEventData } from 'react-swipeable';
//hooks
//@ts-ignore
import { useDeviceType } from 'hooks';
import { useSwipeable } from 'react-swipeable';
import useWindowSize from '../../../hooks/useWindowSize';

// Utils
//@ts-ignore
import { noop, stopEvent } from 'utils';

// Configs
//@ts-ignore
import { popoverConfig } from 'configs';

// Components
import PortalContent from './PortalContent';
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';

//Helper
import PopoverHelper from './helper';

//Types
import { IGeneralProps } from './types';

// Styles
import './Popover.scss';

export interface IPopoverProps extends IGeneralProps {
    /**
     * The Popover will get the width of its child. The property will not work when "width" prop is specified
     */
    extendTargetWidth?: boolean;

    children: JSX.Element;

    customStyles?: CSSProperties;

    fallbackAxisSideDirection?: 'start' | 'end' | 'none';

    /**
     * If this property is enabled, rather than the popover content repositioning on a boundary collision,
     * the popover content container will move beyond the window's bounds.
     * You are, however, supplied with nudgedLeft and nudgedTop values, so you may choose to handle content overflow as you wish.
     */
    disableReposition?: boolean;
    /**
     * Will called each time the popover need to be toggled(child click, close button click, backdrop click).
     * (event: Event, isOpen: bool) => void
     */
    toggleHandler: (event: Event, isOpen?: boolean) => void;
    /**
     * Popover corner radius
     */
    cornerRadius: string;
    /**
     * The switch between mobile and desktop version of Popover will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside.
     */
    screenType: string;
    /**
     * If you'd like to apply styles to the single container div that your popover content is rendered within via stylesheets,
     * you can specify a custom className for the container here.
     */
    className?: string;
    /**
     * Popover position to be displayed
     */
    position: Placement | Placement[];
    disabled?: boolean;
    /**
     * This number determines the gap, in pixels, between your target content and your popover content
     */
    padding: number;
    /**
     * Specify does Popover needs to be toggled on child click
     */
    behave: string;
    /**
     * Possible values are start, center, and end.
     * If start is specified, the popover content's top or left location is aligned with its target's.
     * With end specified, the content's bottom or right location is aligned with its target's.
     * If center is specified, the popover content and target's centers are aligned.
     */
    align: Placement;
    /**
     * Popover content ref
     */
    contentRef?: MutableRefObject<HTMLElement> | ((element: HTMLElement) => void);
    /**
     * Use this prop to control the Popover. Note the component will start not to open and close automatically
     */
    isOpen?: boolean;
    swipeable?: boolean;
    /*
     * After DOWN swipe  (SwipeEventData) => void
     */
    onSwipedDown: (event: SwipeEventData) => void;
    containerParent?: JSX.Element;
    styles?: CSSProperties;
}

const Popover: FC<IPopoverProps> = (props) => {
    const {
        extendTargetWidth = true,
        disableReposition = true,
        toggleHandler = noop,
        cornerRadius = popoverConfig.cornerRadius[0],
        screenType,
        minHeight = 0,
        maxHeight = 510,
        className,
        children,
        position = popoverConfig.position,
        disabled,
        Content,
        padding = 10,
        behave = popoverConfig.behave[0],
        Header,
        Footer,
        align = 'bottom-start',
        scrollbarNeeded = true,
        contentRef,
        isOpen = false,
        getScrollRef = noop,
        swipeable = false,
        onSwipedDown = noop,
        scrollbarProps,
        fullHeight = false,
        containerParent,
        styles,
        customStyles,
        fallbackAxisSideDirection = 'end',
        ...restProps
    } = props;

    const [swipingPosition, setSwipingPosition] = useState(0);
    const popoverBodyRef = useRef(null);
    const [popoverOpened, setPopoverOpened] = useState(false);
    //@ts-ignore
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);
    const [targetWidth, setTargetWidth] = useState<null | number>(null);
    const isToggle = behave === 'toggle';
    const isControlled = 'isOpen' in props;
    const { width } = useWindowSize();

    const popoverState = useMemo(() => (isControlled ? isOpen : popoverOpened), [isControlled, isOpen, popoverOpened]);
    //@ts-ignore
    const checkBodyContains = (event: Event) => popoverBodyRef?.current?.contains(event.target as HTMLElement);

    const handleSwiped = () => PopoverHelper.handleSwiped(setSwipingPosition);

    const handleSwiping = ({ deltaY, event }) =>
        PopoverHelper.handleSwiping({ deltaY, event, setSwipingPosition, checkBodyContains });

    const handleSwipedDown = (touchEvent) =>
        PopoverHelper.handleSwipedDown({ touchEvent, checkBodyContains, onSwipedDown });

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
    const { refs, floatingStyles, context } = useFloating({
        open: popoverState,
        onOpenChange(_, event) {
            if (event) {
                popoverStateChange(event);
            }
        },
        placement: align,
        strategy: 'absolute',
        middleware: [
            offset(padding),
            flip({
                fallbackAxisSideDirection,
                mainAxis: true,
                fallbackPlacements: Array.isArray(position) ? position : [position]
            }),
            shift({
                mainAxis: disableReposition
            })
        ],
        whileElementsMounted: autoUpdate
    });

    useDismiss(context, {
        outsidePressEvent: 'click'
    });

    const handlePopoverStateChange = (event: MouseEvent | Event) => {
        children.props.onClick && children.props.onClick(event);

        popoverStateChange(event);
    };
    const { isMobile } = useDeviceType(screenType);

    const headingId = useId();

    const generateContentRef = (element: HTMLUListElement) => {
        isMobile && getScrollRef(element);

        if (contentRef) {
            typeof contentRef === 'function' ? contentRef(element) : (contentRef.current = element);
        }
        return element;
    };

    const handleClick = (e: MouseEvent) => {
        if (!disabled) {
            if (isToggle && popoverState) {
                handlePopoverStateChange(e);
            } else if (!isToggle) {
                setPopoverOpened(true);
            } else if (!popoverState) {
                handlePopoverStateChange(e);
            }
        }
    };

    const popoverStateChange = (event: MouseEvent | Event) => {
        stopEvent(event);
        if (isControlled) {
            toggleHandler(event, isOpen);
        } else {
            setPopoverOpened((isPopoverOpened) => !isPopoverOpened);
        }
    };

    useEffect(() => {
        if (refs.reference?.current) {
            setTargetWidth(refs.reference?.current?.getBoundingClientRect().width);
        }
    }, [refs, width]);

    const child = useMemo(() => {
        const { className, ...props } = children.props;

        return cloneElement(children, {
            className: classnames('cursor-pointer', 'Popover', className, {
                'popover-opened': popoverState,
                'popover-disabled': disabled
            }),
            onClick: handleClick,
            ...props
        });
    }, [children, handleClick]);

    return Content ? (
        <>
            <div ref={refs.setReference} style={customStyles}>
                {child}
            </div>
            {popoverState && (
                <FloatingPortal root={containerParent || geneUIProviderRef}>
                    <div
                        id={headingId}
                        style={{
                            width: (extendTargetWidth && !isMobile && targetWidth) || 'none',
                            ...floatingStyles
                        }}
                        className={classnames(`popover-positioner`, `cr-${cornerRadius}`, className, {
                            'mobile-view': isMobile
                        })}
                        {...swipeHandlers}
                        ref={refs.setFloating}
                        {...restProps}
                    >
                        <PortalContent
                            width={(extendTargetWidth && !isMobile && targetWidth) || null}
                            stopEvent={stopEvent}
                            generateContentRef={generateContentRef}
                            swipingPosition={swipingPosition}
                            isMobile={isMobile}
                            Header={Header}
                            popoverBodyRef={popoverBodyRef}
                            scrollbarNeeded={scrollbarNeeded}
                            Content={Content}
                            Footer={Footer}
                            popoverStateChange={popoverStateChange}
                            fullHeight={fullHeight}
                            maxHeight={maxHeight}
                            minHeight={minHeight}
                            scrollbarProps={scrollbarProps}
                            getScrollRef={getScrollRef}
                        />
                    </div>
                </FloatingPortal>
            )}
        </>
    ) : (
        children
    );
};

export default Popover;
