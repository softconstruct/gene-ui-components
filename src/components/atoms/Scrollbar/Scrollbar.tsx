import React, { FC, JSX, useRef, useState, UIEvent, useEffect } from "react";
import classNames from "classnames";
// Styles
import "./Scrollbar.scss";
import Scrollbars, { Scrollbar as ScrollBarTypes } from "react-scrollbars-custom";
import useDebouncedCallback from "../../../hooks/useDebounceCallback";

interface IScrollbarProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    children: JSX.Element;
    autoScrollTopTo?: number;
    autoScrollLeftTo?: number;
}

/**
 * Scrollbar is a UI element that allows users to navigate through content that extends beyond the visible area of a container or window. It typically appears along the right side or bottom of the viewport, providing a draggable handle and directional arrows for vertical or horizontal scrolling, enabling users to access all available content.
 */
const Scrollbar: FC<IScrollbarProps> = ({ className, children, autoScrollTopTo, autoScrollLeftTo }) => {
    const [scrollDirection, setScrollDirection] = useState<"x" | "y" | null>(null);
    const previousScrollPosition = useRef({ scrollTop: 0, scrollLeft: 0 });
    const scrollbarsRef = useRef<(ScrollBarTypes & HTMLDivElement) | null>(null);

    const scrollStateResetHandler = () => {
        setScrollDirection(null);
    };

    const { debouncedCallback, clearDebounce } = useDebouncedCallback(scrollStateResetHandler, 1000);

    const scrollHandler = (e: UIEvent<HTMLSpanElement>) => {
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
            scrollRefCurrent.contentElement.parentElement.scrollTo({
                top: autoScrollTopTo,
                left: autoScrollLeftTo,
                behavior: "smooth"
            });
        }
    }, [autoScrollTopTo, autoScrollLeftTo]);

    return (
        <Scrollbars
            className={classNames("scrollbar", className)}
            noDefaultStyles
            // scrollTop={800}
            // momentum={false}
            // scrollDetectionThreshold={400}
            ref={scrollbarsRef}
            // rtl
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
