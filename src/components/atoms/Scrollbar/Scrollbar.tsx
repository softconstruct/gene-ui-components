import React, { FC, ReactNode, UIEvent, useEffect, useRef, useState } from "react";
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
}

/**
 * Scrollbar is a UI element that allows users to navigate through content that extends beyond the visible area of a container or window. It typically appears along the right side or bottom of the viewport, providing a draggable handle and directional arrows for vertical or horizontal scrolling, enabling users to access all available content.
 */
const Scrollbar: FC<IScrollbarProps> = (props) => {
    const { className, children, onScroll, width = "full", height = "full", scrollToTop, scrollToLeft } = props;

    const [scrollDirection, setScrollDirection] = useState<"x" | "y" | null>(null);
    const previousScrollPosition = useRef({ scrollTop: 0, scrollLeft: 0 });
    const scrollbarRef = useRef<Scrollbars | null>(null);

    const scrollStateResetHandler = () => {
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

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            setScrollDirection("y");
        } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setScrollDirection("x");
        }

        previousScrollPosition.current = { scrollTop, scrollLeft };

        debouncedCallback();
    };

    const showScrollbarHandler = (direction: "x" | "y" | null) => {
        if (scrollDirection === direction) {
            setScrollDirection(direction);
            clearDebounce();
        }
    };

    const hideScrollbarHandler = () => {
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
                behavior: "smooth"
            });
        }
    }, [scrollToTop, scrollToLeft]);

    const trackProps = (direction: "x" | "y" | null) => {
        return {
            onMouseEnter: () => showScrollbarHandler(direction),
            onMouseLeave: () => hideScrollbarHandler(),
            className: classNames("scrollbar__track", {
                [`scrollbar__track_direction_${direction}`]: scrollDirection === direction
            })
        };
    };

    const thumbProps = (direction: "x" | "y" | null) => {
        return {
            onDragStart: () => showScrollbarHandler(direction),
            onDragEnd: () => hideScrollbarHandler(),
            className: classNames("scrollbar__thumb", {
                [`scrollbar__thumb_direction_${direction}`]: scrollDirection === direction
            })
        };
    };

    return (
        <Scrollbars
            className={classNames(`scrollbar scrollbar_width_${width} scrollbar_height_${height}`, className)}
            noDefaultStyles
            scrollerProps={{
                className: "scrollbar__scroller"
            }}
            role="scrollbar"
            aria-valuenow={0}
            contentProps={{
                tabIndex: 0,
                className: "scrollbar__content"
            }}
            minimalThumbSize={30}
            ref={(instance: unknown) => {
                scrollbarRef.current = instance as Scrollbars | null;
            }}
            wrapperProps={{
                className: "scrollbar__wrapper",
                onScroll: scrollHandler
            }}
            trackYProps={trackProps("y")}
            trackXProps={trackProps("x")}
            thumbYProps={thumbProps("y")}
            thumbXProps={thumbProps("x")}
        >
            {children}
        </Scrollbars>
    );
};

export { IScrollbarProps, Scrollbar as default };
