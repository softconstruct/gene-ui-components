import React, {
    Children,
    cloneElement,
    createContext,
    FC,
    FunctionComponentElement,
    JSX,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "@geneui/icons";

// Styles
import "./Tabs.scss";

// Components
import Button from "../../atoms/Button";
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
     * Icon position
     * If the prop is true the Icon will be shown before the text otherwise after the text.
     * boolean
     */
    iconBefore?: boolean;
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

    isClosable?: boolean;
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
    iconBefore,
    isLoading,
    className,
    onChange,
    isClosable
}) => {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const swipedElements = useRef<number>(0);

    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [showArrows, setShowArrows] = useState(true);

    const [AllChildren, setAllChildren] = useState<ITabProps["children"][]>(Children.toArray(children));

    const leftButtonRef = useRef<HTMLButtonElement | null>(null);
    const rightButtonRef = useRef<HTMLButtonElement | null>(null);

    const updateTransform = (offset: number) => {
        parentRef.current?.scrollTo({
            left: offset
        });
    };

    useEffect(() => {
        if (leftButtonRef.current) {
            leftButtonRef.current.disabled = true;
        }
    }, []);

    /* eslint consistent-return: off */
    useEffect(() => {
        if (!parentRef.current) return;

        const animationFrame = requestAnimationFrame(() => {
            if (!parentRef.current) return;
            setShowArrows(parentRef.current.scrollWidth > window.innerWidth);
        });

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    const slideShift = (isLeft?: boolean) => {
        if (!parentRef.current || !leftButtonRef.current || !rightButtonRef.current) return;

        if (isLeft) {
            if (swipedElements.current < parentRef.current.scrollWidth) {
                swipedElements.current += parentRef.current.offsetWidth;
            }
            if (swipedElements.current + parentRef.current.offsetWidth >= parentRef.current.scrollWidth) {
                rightButtonRef.current.disabled = true;
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

    const scrollHandler = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (rightButtonRef.current && leftButtonRef.current) {
            rightButtonRef.current.disabled = false;
            leftButtonRef.current.disabled = false;
        }
        const delta = e.deltaY;
        swipedElements.current = Math.max(0, swipedElements.current + delta);
    };

    const removeTabHandler = (index: number) => {
        const removedChildFromData = [...AllChildren];
        removedChildFromData.splice(index, 1);
        setAllChildren(removedChildFromData);

        if (!parentRef.current) return;
        setShowArrows(parentRef.current.scrollWidth > window.innerWidth);
    };

    const getIndex = (index: number) => {
        setSelectedTabIndex(index);
        if (onChange && index) {
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

    if (isLoading) {
        return <div>Skeleton </div>;
    }

    return (
        <TabsContext.Provider value={memoizedContextValues}>
            <div className={classNames(`tabs tabs_${direction} tabs_${type}`, className, direction, type)}>
                <div className="tabs__nav" role="tablist" aria-label="Sample Tabs">
                    {isHorizontal && showArrows && (
                        <Button
                            className="tabs__nav_button"
                            Icon={ChevronLeft}
                            size={size}
                            ref={leftButtonRef}
                            appearance="secondary"
                            displayType="text"
                            onClick={() => slideShift()}
                        />
                    )}

                    <div className="tabs__list" ref={parentRef} onWheel={scrollHandler}>
                        {Children.map(AllChildren, (child, index) =>
                            cloneElement(child as JSX.Element, {
                                iconBefore,
                                isClosable,
                                ...(child as JSX.Element).props,
                                index
                            })
                        )}
                    </div>

                    {isHorizontal && showArrows && (
                        <Button
                            className="tabs__nav_button"
                            Icon={ChevronRight}
                            size={size}
                            appearance="secondary"
                            displayType="text"
                            ref={rightButtonRef}
                            onClick={() => slideShift(true)}
                        />
                    )}
                </div>

                <div className="tabs__stage">{(AllChildren[selectedTabIndex] as JSX.Element).props.children}</div>
            </div>
        </TabsContext.Provider>
    );
};
export { ITabsProps, Tabs as default };
