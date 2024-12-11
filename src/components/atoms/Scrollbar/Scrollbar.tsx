import React, { FC, JSX, useRef, useState, UIEvent, useEffect } from "react";
import classNames from "classnames";

// Components
import Scrollbars, { Scrollbar as ScrollBarTypes } from "react-scrollbars-custom";

// Hooks
import useDebouncedCallback from "../../../hooks/useDebounceCallback";

// Styles
import "./Scrollbar.scss";

interface IScrollbarProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     *The content to be rendered inside the scrollable area.
     */
    children: JSX.Element;
    /**
     * Automatically scrolls the container to a specific vertical position (in pixels).
     */
    autoScrollTopTo?: number;
    /**
     * Automatically scrolls the container to a specific horizontal position (in pixels).
     */
    autoScrollLeftTo?: number;
    /**
     * Callback function triggered during scroll events. Receives the scroll event as an argument.
     */
    onScroll?: (e: UIEvent<HTMLSpanElement>) => void;
    /**
     * 	Custom height for the scrollable container.<br>
     * 	Default is 100%.<br>
     * 	Possible values: `any valid css value`
     */
    customHeight?: string;
    /**
     * 	Custom width for the scrollable container.<br>
     * 	Default is 100%.<br>
     * 	Possible values: `any valid css value`
     */
    customWidth?: string;
}

/**
 * Scrollbar is a UI element that allows users to navigate through content that extends beyond the visible area of a container or window. It typically appears along the right side or bottom of the viewport, providing a draggable handle and directional arrows for vertical or horizontal scrolling, enabling users to access all available content.
 */
const Scrollbar: FC<IScrollbarProps> = ({
    className,
    children,
    autoScrollTopTo,
    autoScrollLeftTo,
    onScroll,
    customHeight,
    customWidth
}) => {
    const [scrollDirection, setScrollDirection] = useState<"x" | "y" | null>(null);
    const previousScrollPosition = useRef({ scrollTop: 0, scrollLeft: 0 });
    const scrollbarsRef = useRef<(ScrollBarTypes & HTMLDivElement) | null>(null);

    const scrollStateResetHandler = () => {
        setScrollDirection(null);
    };

    const { debouncedCallback, clearDebounce } = useDebouncedCallback(scrollStateResetHandler, 1000);

    const scrollHandler = (e: UIEvent<HTMLSpanElement>) => {
        onScroll?.(e);
        const target = e.target as HTMLSpanElement;

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

    const showScrollbarHandler = (direction: "x" | "y") => {
        if (scrollDirection === direction) {
            setScrollDirection(direction);
            clearDebounce();
        }
    };

    const hideScrollbarHandler = () => {
        debouncedCallback();
    };

    // autoScrollTo Top and Left
    useEffect(() => {
        const scrollRefCurrent = scrollbarsRef.current;
        if (scrollRefCurrent?.contentElement?.parentElement && (autoScrollTopTo || autoScrollLeftTo)) {
            scrollRefCurrent.contentElement.parentElement?.scrollTo({
                ...(autoScrollTopTo ? { top: autoScrollTopTo } : {}),
                ...(autoScrollLeftTo ? { left: autoScrollLeftTo } : {}),
                behavior: "smooth"
            });
        }
    }, [autoScrollTopTo, autoScrollLeftTo]);

    return (
        <Scrollbars
            className={classNames("scrollbar", className)}
            noDefaultStyles
            scrollerProps={{
                className: "scrollbar__scroller"
            }}
            style={{ height: customHeight, width: customWidth }}
            minimalThumbSize={30}
            ref={scrollbarsRef}
            wrapperProps={{ className: "scrollbar__wrapper", onScroll: scrollHandler }}
            trackYProps={{
                renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return (
                        <span
                            {...restProps}
                            ref={elementRef}
                            onMouseEnter={() => showScrollbarHandler("y")}
                            onMouseLeave={hideScrollbarHandler}
                            className={classNames("scrollbar__track", {
                                scrollbar__track_direction_y: scrollDirection === "y"
                            })}
                        />
                    );
                }
            }}
            thumbYProps={{
                renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return (
                        <span
                            {...restProps}
                            onDragStart={() => {
                                showScrollbarHandler("y");
                            }}
                            onDragEnd={hideScrollbarHandler}
                            ref={elementRef}
                            className={classNames("scrollbar__thumb", {
                                scrollbar__thumb_direction_y: scrollDirection === "y"
                            })}
                        />
                    );
                }
            }}
            trackXProps={{
                renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return (
                        <span
                            {...restProps}
                            ref={elementRef}
                            onMouseEnter={() => showScrollbarHandler("x")}
                            onMouseLeave={hideScrollbarHandler}
                            className={classNames("scrollbar__track", {
                                scrollbar__track_direction_x: scrollDirection === "x"
                            })}
                        />
                    );
                }
            }}
            thumbXProps={{
                renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return (
                        <span
                            {...restProps}
                            onDragStart={() => {
                                showScrollbarHandler("x");
                            }}
                            onDragEnd={hideScrollbarHandler}
                            ref={elementRef}
                            className={classNames("scrollbar__thumb", {
                                scrollbar__thumb_direction_x: scrollDirection === "x"
                            })}
                        />
                    );
                }
            }}
        >
            {children}
        </Scrollbars>
    );
};

export { IScrollbarProps, Scrollbar as default };
