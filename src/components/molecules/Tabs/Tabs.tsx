import React, {
    Children,
    cloneElement,
    createContext,
    FC,
    FunctionComponentElement,
    JSX,
    MutableRefObject,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    WheelEventHandler
} from "react";
import classNames from "classnames";

// Icons
import { ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Scrollbar from "@components/atoms/Scrollbar";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Hooks
import useWindowSize from "@hooks/useWindowSize";

// Styles
import "./Tabs.scss";

import type { ITabProps } from "./Tab";

interface ITabsProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Tabs direction <br/>
     * Possible values: `horizontal | vertical`
     */
    direction?: "horizontal" | "vertical";
    /**
     * Tabs button size <br/>
     * Possible values: `large | medium`
     */
    size?: "large" | "medium";
    /**
     * Tabs type <br/>
     * Possible values: `line | contained`
     */
    type?: "line" | "contained";
    /**
     * The prop responsible for showing the loading skeleton if passed true. The default value is false
     * boolean
     */
    loading?: boolean;
    /**
     * Tab component. Renders inside the component
     */
    children?: FunctionComponentElement<ITabProps> | FunctionComponentElement<ITabProps>[];
    /**
     *  It works when the user clicks on one of the control items. Returns  the `index`  from the `Tab`.
     */
    onChange?: (index: number) => void;
    /**
     * The prop responsible for showing  close icon for every tab true. The default value is false
     */
    closable?: boolean;
    /**
     * Callback fired when a tab's close button is clicked.
     * If provided, the component operates in controlled mode - the parent should handle tab removal by updating the `children` prop.
     * If not provided, the component operates in uncontrolled mode and handles tab removal internally.
     */
    onClose?: (index: number) => void;
}

/**
 * Editor is an interactive tool designed for creating, editing, and formatting text content within a user interface. It allows users to input text and apply various styles or structures to their content, offering both simple and advanced text manipulation capabilities.
 */

interface IContextProps extends Pick<ITabsProps, "size"> {
    getIndex: (i: number) => void;
    selectedTabIndex?: number;
    removeTabHandler: (index: number) => void;
}

export const TabsContext = createContext<IContextProps>({} as IContextProps);

const Tabs: FC<ITabsProps> = ({
    direction = "vertical",
    size = "large",
    type = "line",
    children,
    loading,
    className,
    onChange,
    closable,
    onClose
}) => {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const swipedElements = useRef<number>(0);

    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(true);

    const [showLeftShadows, setShowLeftShadows] = useState(false);

    const [showRightShadows, setShowRightShadows] = useState(true);

    const isControlled = onClose !== undefined;
    const [AllChildren, setAllChildren] = useState<ITabProps["children"][]>(children ? Children.toArray(children) : []);

    const { width } = useWindowSize();

    useEffect(() => {
        if (isControlled) {
            const newChildren = children ? Children.toArray(children) : [];
            setAllChildren((prevChildren) => {
                const prevLength = prevChildren.length;

                if (newChildren.length !== prevLength) {
                    setSelectedTabIndex((prevIndex) => {
                        if (newChildren.length === 0) {
                            return 0;
                        }

                        if (prevIndex >= newChildren.length) {
                            const newIndex = newChildren.length - 1;
                            onChange?.(newIndex);
                            return newIndex;
                        }

                        return prevIndex;
                    });
                }

                return newChildren;
            });
        } else if (children !== undefined) {
            const newChildren = Children.toArray(children);
            setAllChildren(newChildren);

            if (selectedTabIndex >= newChildren.length && newChildren.length > 0) {
                const newIndex = newChildren.length - 1;
                setSelectedTabIndex(newIndex);
                onChange?.(newIndex);
            } else if (newChildren.length === 0) {
                setSelectedTabIndex(0);
            }
        }
    }, [children, isControlled, onChange]);

    const leftButtonRef = useRef<HTMLButtonElement | null>(null);
    const rightButtonRef = useRef<HTMLButtonElement | null>(null);

    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;

    const isRTLMode = document.dir === "rtl";

    const updateTransform = (offset: number) => {
        parentRef.current?.scrollTo({
            left: offset
        });
    };

    const disableButton = (ref: MutableRefObject<HTMLButtonElement | null>, isDisabled: boolean) => {
        if (ref.current) {
            // eslint-disable-next-line no-param-reassign
            ref.current.disabled = isDisabled;
        }
    };

    useEffect(() => {
        const initializeButtons = () => {
            if (!parentRef.current || !leftButtonRef.current || !rightButtonRef.current) return;

            const { scrollWidth } = parentRef.current;
            const { offsetWidth } = parentRef.current;
            const currentScroll = parentRef.current.scrollLeft;

            // Initialize swipedElements to match current scroll position
            swipedElements.current = currentScroll;

            if (isRTLMode) {
                if (currentScroll >= 0) {
                    disableButton(leftButtonRef, true);
                    setShowLeftShadows(false);
                } else {
                    disableButton(leftButtonRef, false);
                    setShowLeftShadows(true);
                }

                const maxScroll = scrollWidth - offsetWidth;
                const minScroll = -maxScroll;
                if (currentScroll <= minScroll) {
                    disableButton(rightButtonRef, true);
                    setShowRightShadows(false);
                } else {
                    disableButton(rightButtonRef, false);
                    setShowRightShadows(true);
                }
            } else {
                // LTR mode - left button disabled at start
                if (currentScroll <= 0) {
                    disableButton(leftButtonRef, true);
                    setShowLeftShadows(false);
                } else {
                    disableButton(leftButtonRef, false);
                    setShowLeftShadows(true);
                }

                if (currentScroll + offsetWidth >= scrollWidth) {
                    disableButton(rightButtonRef, true);
                    setShowRightShadows(false);
                } else {
                    disableButton(rightButtonRef, false);
                    setShowRightShadows(true);
                }
            }
        };

        const animationFrame = requestAnimationFrame(() => {
            return requestAnimationFrame(() => {
                if (!parentRef.current) return;
                setShowArrows(parentRef.current.scrollWidth > width);
                initializeButtons();
            });
        });

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [closable, width, isRTLMode]);

    const slideShift = (isLeft?: boolean) => {
        if (!parentRef.current || !leftButtonRef.current || !rightButtonRef.current) return;

        const { scrollWidth } = parentRef.current;
        const { offsetWidth } = parentRef.current;
        const maxScroll = scrollWidth - offsetWidth;

        if (isRTLMode) {
            if (isLeft) {
                const currentScroll = parentRef.current.scrollLeft;
                const minScroll = -maxScroll;

                if (currentScroll > minScroll) {
                    swipedElements.current = Math.max(currentScroll - offsetWidth, minScroll);
                }

                if (swipedElements.current <= minScroll) {
                    rightButtonRef.current.disabled = true;
                    setShowRightShadows(true);
                    swipedElements.current = minScroll;
                } else {
                    rightButtonRef.current.disabled = false;
                }

                leftButtonRef.current.disabled = false;
                updateTransform(swipedElements.current);
                return;
            }

            const currentScroll = parentRef.current.scrollLeft;

            if (currentScroll < 0) {
                swipedElements.current = Math.min(currentScroll + offsetWidth, 0);
            }

            if (swipedElements.current >= 0) {
                leftButtonRef.current.disabled = true;
                setShowLeftShadows(false);
                swipedElements.current = 0;
            } else {
                leftButtonRef.current.disabled = false;
                setShowLeftShadows(true);
            }

            rightButtonRef.current.disabled = false;
            updateTransform(swipedElements.current);
            return;
        }

        if (isLeft) {
            if (swipedElements.current < parentRef.current.scrollWidth) {
                swipedElements.current += parentRef.current.offsetWidth;
            }
            if (swipedElements.current + parentRef.current.offsetWidth >= parentRef.current.scrollWidth) {
                rightButtonRef.current.disabled = true;
                setShowRightShadows(true);
                swipedElements.current = parentRef.current.scrollWidth - parentRef.current.offsetWidth;
            }
            leftButtonRef.current!.disabled = false;
            updateTransform(swipedElements.current);
            return;
        }

        if (swipedElements.current > 0) {
            swipedElements.current -= parentRef.current.offsetWidth;
        }

        if (swipedElements.current <= 0) {
            leftButtonRef.current.disabled = true;

            swipedElements.current = 0;
        }

        rightButtonRef.current.disabled = false;

        updateTransform(swipedElements.current);
    };

    const removeTabHandler = (index: number) => {
        onClose?.(index);

        if (!isControlled) {
            const removedChildFromData = [...AllChildren];
            removedChildFromData.splice(index, 1);
            setAllChildren(removedChildFromData);

            if (index < selectedTabIndex) {
                setSelectedTabIndex((prev) => prev - 1);
            } else if (index === selectedTabIndex && removedChildFromData.length > 0) {
                const newIndex = Math.min(selectedTabIndex, removedChildFromData.length - 1);
                setSelectedTabIndex(newIndex);
                onChange?.(newIndex);
            }

            if (!parentRef.current) return;
            setShowArrows(parentRef.current.scrollWidth > window.innerWidth);
        }
    };

    const getIndex = (index: number) => {
        setSelectedTabIndex(index);

        if (onChange && index !== undefined) {
            onChange(index);
        }
    };

    const memoizedContextValues = useMemo(
        () => ({
            size,
            getIndex,
            selectedTabIndex,
            removeTabHandler
        }),
        [size, getIndex, selectedTabIndex, removeTabHandler]
    );

    const isHorizontal = direction === "horizontal";

    const scrollEvent: WheelEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();

        swipedElements.current = e.currentTarget.scrollLeft;

        if (!parentRef.current) return;

        const { scrollWidth } = parentRef.current;
        const { offsetWidth } = parentRef.current;
        const maxScroll = scrollWidth - offsetWidth;

        if (isRTLMode) {
            const minScroll = -maxScroll;

            if (swipedElements.current >= 0) {
                disableButton(leftButtonRef, true);
                setShowLeftShadows(false);
                swipedElements.current = 0;
            } else {
                disableButton(leftButtonRef, false);
                setShowLeftShadows(true);
            }

            if (swipedElements.current <= minScroll) {
                disableButton(rightButtonRef, true);
                swipedElements.current = minScroll;
                setShowRightShadows(false);
            } else {
                disableButton(rightButtonRef, false);
                setShowRightShadows(true);
            }
        } else {
            if (swipedElements.current <= 0) {
                disableButton(leftButtonRef, true);
                setShowLeftShadows(false);
                swipedElements.current = 0;
            } else {
                disableButton(leftButtonRef, false);
                setShowLeftShadows(true);
            }
            if (swipedElements.current + parentRef.current.offsetWidth >= parentRef.current.scrollWidth) {
                disableButton(rightButtonRef, true);
                swipedElements.current = parentRef.current.scrollWidth - parentRef.current.offsetWidth;
                setShowRightShadows(false);
            } else {
                disableButton(rightButtonRef, false);

                setShowRightShadows(true);
            }
        }
    };

    if (loading) {
        return <div>Skeleton </div>;
    }

    return (
        <TabsContext.Provider value={memoizedContextValues}>
            <div className={classNames(`tabs tabs_${direction} tabs_${type} tabs_${size}`, className, direction, type)}>
                <div
                    className={classNames("tabs__nav", {
                        tabs__shadow_before: isMobileBreakpoint && showLeftShadows && isHorizontal,
                        tabs__shadow_after: isMobileBreakpoint && showRightShadows && isHorizontal
                    })}
                    aria-label="Sample Tabs"
                >
                    {isHorizontal && showArrows && !isMobileBreakpoint && (
                        <div className="tabs__nav_button">
                            <Button
                                ref={leftButtonRef}
                                size={size}
                                appearance="secondary"
                                layout="text"
                                fullWidth
                                Icon={isRTLMode ? ChevronRight : ChevronLeft}
                                onClick={() => slideShift()}
                            />
                        </div>
                    )}

                    <Scrollbar className="tabs__wrapper">
                        <div className="tabs__list" role="tablist" ref={parentRef} onScroll={scrollEvent}>
                            {Children.map(AllChildren, (child, index) =>
                                cloneElement(child as JSX.Element, {
                                    closable,
                                    ...(child as JSX.Element).props,
                                    index
                                })
                            )}
                        </div>
                    </Scrollbar>

                    {isHorizontal && showArrows && !isMobileBreakpoint && (
                        <div className="tabs__nav_button">
                            <Button
                                ref={rightButtonRef}
                                size={size}
                                appearance="secondary"
                                layout="text"
                                fullWidth
                                Icon={isRTLMode ? ChevronLeft : ChevronRight}
                                onClick={() => slideShift(true)}
                            />
                        </div>
                    )}
                </div>

                <div className="tabs__stage">{(AllChildren[selectedTabIndex] as JSX.Element)?.props.children}</div>
            </div>
        </TabsContext.Provider>
    );
};
export { ITabsProps, Tabs as default };
