import React, {
    Children,
    cloneElement,
    createContext,
    FC,
    FunctionComponentElement,
    JSX,
    MutableRefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
    WheelEventHandler
} from "react";
import classNames from "classnames";

import { ChevronLeft, ChevronRight } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";

// Hooks
import useWindowSize from "@hooks/useWindowSize";

// Styles
import "./Tabs.scss";

// Components
import { Scrollbar } from "../../../index";
import { ITabProps } from ".";

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
    isLoading?: boolean;
    /**
     * Tab component. Renders inside the component
     */
    children: FunctionComponentElement<ITabProps> | FunctionComponentElement<ITabProps>[];
    /**
     *  It works when the user clicks on one of the control items. Returns  the `index`  from the `Tab`.
     */
    onChange?: (index: number) => void;
    /**
     * The prop responsible for showing  close icon fro every tab true. The default value is false
     * boolean
     */
    closable?: boolean;
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
    isLoading,
    className,
    onChange,
    closable
}) => {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const swipedElements = useRef<number>(0);

    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(true);

    const [showLeftShadows, setShowLeftShadows] = useState(false);

    const [showRightShadows, setShowRightShadows] = useState(true);

    const [AllChildren, setAllChildren] = useState<ITabProps["children"][]>(Children.toArray(children));

    const { width } = useWindowSize();

    const leftButtonRef = useRef<HTMLButtonElement | null>(null);
    const rightButtonRef = useRef<HTMLButtonElement | null>(null);

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
        if (leftButtonRef.current) {
            disableButton(leftButtonRef, true);
        }
    }, [parentRef.current]);

    /* eslint consistent-return: off */
    useEffect(() => {
        const animationFrame = requestAnimationFrame(() => {
            return requestAnimationFrame(() => {
                if (!parentRef.current) return;
                setShowArrows(parentRef.current.scrollWidth > width);
            });
        });

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [closable, width]);

    const slideShift = (isLeft?: boolean) => {
        if (!parentRef.current || !leftButtonRef.current || !rightButtonRef.current) return;

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
        const removedChildFromData = [...AllChildren];
        removedChildFromData.splice(index, 1);
        setAllChildren(removedChildFromData);

        if (index < selectedTabIndex) {
            setSelectedTabIndex((prev) => prev - 1);
        }

        if (!parentRef.current) return;
        setShowArrows(parentRef.current.scrollWidth > window.innerWidth);
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
    };

    const isMobile = width <= 767;

    if (isLoading) {
        return <div>Skeleton </div>;
    }

    return (
        <TabsContext.Provider value={memoizedContextValues}>
            <div className={classNames(`tabs tabs_${direction} tabs_${type} tabs_${size}`, className, direction, type)}>
                <div
                    className={classNames("tabs__nav", {
                        tabs__shadow_before: isMobile && showLeftShadows && isHorizontal,
                        tabs__shadow_after: isMobile && showRightShadows && isHorizontal
                    })}
                    aria-label="Sample Tabs"
                >
                    {isHorizontal && showArrows && !isMobile && (
                        <div className="tabs__nav_button">
                            <Button
                                ref={leftButtonRef}
                                size={size}
                                appearance="secondary"
                                displayType="text"
                                fullWidth
                                Icon={ChevronLeft}
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

                    {isHorizontal && showArrows && !isMobile && (
                        <div className="tabs__nav_button">
                            <Button
                                ref={rightButtonRef}
                                size={size}
                                appearance="secondary"
                                displayType="text"
                                fullWidth
                                Icon={ChevronRight}
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
