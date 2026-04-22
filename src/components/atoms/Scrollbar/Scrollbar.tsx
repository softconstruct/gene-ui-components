import React, { forwardRef, ReactNode, UIEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import classNames from "classnames";
import Scrollbars from "react-scrollbars-custom";

// Hooks
import useDebouncedCallback from "@hooks/useDebounceCallback";

// Styles
import "./Scrollbar.scss";

interface IScrollbarProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The content to be rendered inside the scrollable area.
     */
    children: ReactNode;
    /**
     * Callback function triggered during scroll events. Receives the scroll event as an argument.
     */
    onScroll?: (e: UIEvent<HTMLDivElement>) => void;
    /**
     * 	Control width for the scrollbar.<br>
     * 	Possible values: `full | auto`
     */
    width?: "full" | "auto";
    /**
     * 	Control height for the scrollbar.<br>
     * 	Possible values: `full | auto`
     */
    height?: "full" | "auto";
    /**
     * Automatically scrolls the container to a specific vertical position (in pixels).
     */
    scrollToTop?: number;
    /**
     * Automatically scrolls the container to a specific horizontal position (in pixels).
     */
    scrollToLeft?: number;
    /**
     * scrollBehaviorSmooth by default is true, set to false if needed instant scroll.
     */
    scrollBehaviorSmooth?: boolean;
}

type ScrollbarRefType = {
    /**
     * Reference to the instance of the Scrollbar component
     */
    scrollbarRef: Scrollbars | null;
};

/**
 * Scrollbar is a UI element that allows users to navigate through content that extends beyond the visible area of a container or window. It typically appears along the right side or bottom of the viewport, providing a draggable handle and directional arrows for vertical or horizontal scrolling, enabling users to access all available content.
 */
const Scrollbar = forwardRef<ScrollbarRefType, IScrollbarProps>((props, ref) => {
    const {
        className,
        children,
        onScroll,
        width = "full",
        height = "full",
        scrollToTop,
        scrollToLeft,
        scrollBehaviorSmooth = true
    } = props;

    const [scrollDirection, setScrollDirection] = useState<"x" | "y" | null>(null);
    const [grabbedDirection, setGrabbedDirection] = useState<"x" | "y" | null>(null);
    const grabbedDirectionRef = useRef<"x" | "y" | null>(null);
    const previousScrollPosition = useRef({ scrollTop: 0, scrollLeft: 0 });
    const scrollbarRef = useRef<Scrollbars | null>(null);

    useImperativeHandle(ref, () => ({
        scrollbarRef: scrollbarRef.current
    }));

    const scrollStateResetHandler = () => {
        if (grabbedDirectionRef.current) {
            return;
        }
        setScrollDirection(null);
    };

    const { debouncedCallback, clearDebounce } = useDebouncedCallback(scrollStateResetHandler, 1000);

    const scrollHandler = (e: UIEvent<HTMLDivElement>) => {
        onScroll?.(e);
        const target = e.target as HTMLDivElement;

        const { scrollTop, scrollLeft } = target;

        const previous = previousScrollPosition.current;

        const deltaY = scrollTop - previous.scrollTop;
        const deltaX = scrollLeft - previous.scrollLeft;

        if (Math.abs(deltaY) >= Math.abs(deltaX) && deltaY !== 0) {
            setScrollDirection("y");
        } else if (deltaX !== 0) {
            setScrollDirection("x");
        }

        previousScrollPosition.current = { scrollTop, scrollLeft };

        debouncedCallback();
    };

    const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
        const { deltaX, deltaY } = e;
        if (Math.abs(deltaY) >= Math.abs(deltaX) && deltaY !== 0) {
            setScrollDirection("y");
            clearDebounce();
            debouncedCallback();
        } else if (deltaX !== 0) {
            setScrollDirection("x");
            clearDebounce();
            debouncedCallback();
        }
    };

    const showScrollbarHandler = (direction: "x" | "y" | null) => {
        if (direction) {
            setScrollDirection(direction);
            clearDebounce();
        }
    };

    const hideScrollbarHandler = () => {
        if (grabbedDirectionRef.current) {
            return;
        }
        debouncedCallback();
    };

    const grabScrollbarHandler = (direction: "x" | "y" | null) => {
        if (direction) {
            grabbedDirectionRef.current = direction;
            setGrabbedDirection(direction);
            showScrollbarHandler(direction);
        }
    };

    const releaseScrollbarHandler = () => {
        grabbedDirectionRef.current = null;
        setGrabbedDirection(null);
        clearDebounce();
        debouncedCallback();
    };

    useEffect(() => {
        const scrollRefCurrent = scrollbarRef.current;
        const hasScrollToTop = "scrollToTop" in props;
        const hasScrollToLeft = "scrollToLeft" in props;

        if (scrollRefCurrent && (hasScrollToTop || hasScrollToLeft)) {
            scrollRefCurrent?.scrollerElement?.scrollTo({
                ...(hasScrollToTop ? { top: scrollToTop } : {}),
                ...(hasScrollToLeft ? { left: scrollToLeft } : {}),
                ...(scrollBehaviorSmooth ? { behavior: "smooth" } : {})
            });
        }
        return () => {
            clearDebounce();
        };
    }, [scrollToTop, scrollToLeft, scrollbarRef.current?.scrollerElement?.clientHeight]);

    useEffect(() => {
        if (!grabbedDirection) {
            return undefined;
        }

        window.addEventListener("mouseup", releaseScrollbarHandler);

        return () => {
            window.removeEventListener("mouseup", releaseScrollbarHandler);
        };
    }, [grabbedDirection]);

    const trackProps = (direction: "x" | "y" | null) => {
        return {
            onMouseEnter: () => showScrollbarHandler(direction),
            onMouseLeave: () => hideScrollbarHandler(),
            className: classNames("scrollbar__track", `scrollbar__track_direction_${direction}`, {
                scrollbar__track_active: scrollDirection === direction || grabbedDirection === direction
            })
        };
    };

    const thumbProps = (direction: "x" | "y" | null) => {
        return {
            onDragStart: () => grabScrollbarHandler(direction),
            onDragEnd: () => releaseScrollbarHandler(),
            className: classNames("scrollbar__thumb", `scrollbar__thumb_direction_${direction}`, {
                scrollbar__thumb_active: scrollDirection === direction || grabbedDirection === direction
            })
        };
    };

    return (
        <Scrollbars
            className={classNames(`scrollbar scrollbar_width_${width} scrollbar_height_${height}`, className)}
            noDefaultStyles
            scrollerProps={{
                className: "scrollbar__scroller",
                onScroll: scrollHandler,
                onWheel: wheelHandler
            }}
            role="scrollbar"
            aria-valuenow={0}
            contentProps={{
                className: "scrollbar__content"
            }}
            minimalThumbSize={30}
            ref={(instance: unknown) => {
                scrollbarRef.current = instance as Scrollbars | null;
            }}
            wrapperProps={{
                className: "scrollbar__wrapper",
                onScroll: scrollHandler,
                onWheel: wheelHandler
            }}
            trackYProps={trackProps("y")}
            trackXProps={trackProps("x")}
            thumbYProps={thumbProps("y")}
            thumbXProps={thumbProps("x")}
        >
            {children}
        </Scrollbars>
    );
});

export { IScrollbarProps, ScrollbarRefType, Scrollbar as default };
