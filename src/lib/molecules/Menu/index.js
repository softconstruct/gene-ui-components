import React, { forwardRef, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { screenTypes } from 'configs';
import { findDeep } from './utils';

// Components
import Option from '../../atoms/Option';
import Scrollbar from '../../atoms/Scrollbar';

// Styles
import './index.scss';

const findHeaderByIndexStack = (data, indexStack) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    const [currentIndex, ...nextIndexStack] = indexStack;
    const nextData = data[currentIndex]?.children;

    return indexStack.length === 1 ? data[currentIndex] : findHeaderByIndexStack(nextData, nextIndexStack);
};

const Menu = forwardRef(
    (
        { data, onBack, toggle, onNext, onSelect, screenType, scrollToActiveElement, initialIndexStack, ...restProps },
        ref
    ) => {
        const initialHeader = useMemo(
            () =>
                initialIndexStack?.reduce((headerItem, stackIndex, index) => {
                    const nextItem = headerItem ? headerItem[stackIndex] : data[stackIndex];
                    const isLast = index === initialIndexStack.length - 1;
                    return isLast ? nextItem : nextItem.children;
                }, null),
            [initialIndexStack, data]
        );

        const [header, setHeader] = useState(initialHeader);
        const [indexStack, setIndexStack] = useState(initialIndexStack ?? []);
        const listRef = useRef(null);
        const activeElementRef = useRef(null);
        const [scrollTopGap, setScrollTopGap] = useState(0);

        const layer = useMemo(
            () =>
                findDeep(
                    data?.filter((item) => item),
                    indexStack
                ),
            [data, indexStack]
        );

        // Scroll to active element
        const [activeElementTop, setActiveElementTop] = useState(null);
        const [allowScroll, setAllowScroll] = useState(false);
        const [isScrolled, setIsScrolled] = useState(false);
        const [scrollWithArrowKey, setScrollWithArrowKey] = useState(false);

        useEffect(() => {
            if (allowScroll || scrollWithArrowKey) {
                setActiveElementTop(activeElementRef?.current?.offsetTop - scrollTopGap);
                setAllowScroll(false);
                setScrollWithArrowKey(false);
            }
        }, [allowScroll, indexStack, activeElementRef?.current?.offsetTop, scrollTopGap, scrollWithArrowKey]);

        useEffect(() => {
            if (!isScrolled && listRef?.current?.container.firstChild.children.length === layer.length) {
                setAllowScroll(true);
                setIsScrolled(true);
            }
        });

        const handleClick = useCallback(
            (e, item, isHeader, index) => {
                setWithSmoothScroll(false);
                setAllowScroll(true);
                setHoverIndex(null);
                setScrollTopGap(item?.scrollTopGap ? item?.scrollTopGap : 0);

                const newIndexStack = indexStack.slice(0, -1);

                if (isHeader) {
                    setIndexStack(newIndexStack);
                    onBack && onBack(e, item);
                    setHeader(findHeaderByIndexStack(data, newIndexStack));
                } else {
                    const { onClick, children } = item;
                    if (children) {
                        setIndexStack([...indexStack, index]);
                        setHeader(item);
                        onNext && onNext(e, item);
                    } else {
                        onSelect && onSelect(e, item);
                    }
                    onClick && onClick(e, item);
                }
            },
            [indexStack]
        );

        const isOtherLayoutExists = layer?.some((item) => !!item.children);

        // key accessibility
        const [hoverIndex, setHoverIndex] = useState(null);
        const [allowHoverOnActiveElement, setAllowHoverOnActiveElement] = useState(false);
        const [withHeader, setWithHeader] = useState(false);
        const [hoveredHeader, setHoveredHeader] = useState(false);
        const [withSmoothScroll, setWithSmoothScroll] = useState(false);

        const handleMenuFocus = () => setHoverIndex(0);

        const keyDownHandler = (e) => {
            setWithSmoothScroll(true);
            switch (e.key) {
                case 'ArrowDown': {
                    if (hoveredHeader) {
                        setHoverIndex(0);
                        setHoveredHeader(false);
                    } else {
                        setHoverIndex((prev) => (prev >= layer.length - 1 ? layer.length - 1 : prev + 1));
                        setScrollWithArrowKey(true);
                    }
                    break;
                }
                case 'ArrowUp': {
                    if (hoverIndex <= 0) {
                        setHoverIndex(null);
                        if (withHeader) {
                            setHoveredHeader(true);
                        } else {
                            setScrollWithArrowKey(true);
                        }
                    } else {
                        setHoverIndex((prev) => prev - 1);
                        setScrollWithArrowKey(true);
                    }
                    break;
                }
                case 'Enter': {
                    setAllowHoverOnActiveElement(true);
                    const selectedItem = layer[hoverIndex];

                    if (selectedItem) {
                        handleClick(e, selectedItem, false, hoverIndex);
                        setHoverIndex(0);
                    }
                    if (hoveredHeader) handleClick(e, header, true);
                    break;
                }
                case 'Tab':
                case 'Escape':
                    toggle && toggle(false);
                    break;
            }
        };

        const omitLayoutProps = (obj) => {
            let result = obj;
            if (obj?.maxHeight) {
                const { maxHeight, ...restProps } = result;
                result = restProps;
            }
            if (obj?.scrollTopGap) {
                const { scrollTopGap, ...restProps } = result;
                result = restProps;
            }
            return result;
        };

        const contentListMemo = useMemo(
            () =>
                layer?.map((item, index) => {
                    const itemProps = omitLayoutProps(item);

                    if (allowHoverOnActiveElement && item.active) {
                        setHoverIndex(index);
                        setAllowHoverOnActiveElement(false);
                    }

                    return (
                        item.component || (
                            <Option
                                key={`${item.header}${index}`}
                                title={item.title}
                                onClick={(e) => handleClick(e, item, false, index)}
                                forwardMark={!!item.children}
                                screenType={screenType}
                                {...((scrollToActiveElement && item.active && allowScroll) || index === hoverIndex
                                    ? { forwardedRef: activeElementRef }
                                    : {})}
                                {...itemProps}
                                className={classnames({ hovered: index === hoverIndex }, itemProps.className)}
                            />
                        )
                    );
                }),
            [indexStack, layer, hoverIndex]
        );

        const headerMemo = useMemo(() => {
            const headerProps = omitLayoutProps(header);

            setWithHeader(!!headerProps);
            return (
                header && (
                    <Option
                        onClick={(e) => handleClick(e, header, true)}
                        icon="bc-icon-arrow-left"
                        border="bottom"
                        className={classnames({ hovered: hoveredHeader })}
                        screenType={screenType}
                        titlePosition="center"
                        {...headerProps}
                        title={header.title}
                    />
                )
            );
        }, [header, screenType, header?.maxHeight, indexStack, hoveredHeader]);

        return (
            <div
                className="menu-items-wrapper popover-top-bottom-padding"
                onKeyDown={keyDownHandler}
                onFocus={handleMenuFocus}
                tabIndex={0}
                ref={ref}
                {...restProps}
            >
                <ul style={{ '--translate-x': `${indexStack.length * 100}%` }}>
                    {indexStack.map((_, index) => (
                        <li key={index} />
                    ))}
                    <li>
                        {headerMemo}
                        {header?.maxHeight ? (
                            <Scrollbar
                                style={{ height: `${header.maxHeight}px` }}
                                ref={listRef}
                                scrollTop={activeElementTop}
                                withSmoothScroll={withSmoothScroll}
                            >
                                {contentListMemo}
                            </Scrollbar>
                        ) : (
                            contentListMemo
                        )}
                    </li>
                    {isOtherLayoutExists && <li />}
                </ul>
            </div>
        );
    }
);

Menu.defaultProps = {
    screenType: screenTypes[0]
};

Menu.propTypes = {
    /**
     * This is an array where you send menu options, if you send a component,
     * then your component will be rendered, and if parameters, they will be
     * used for the atoms/Option component.<br/>
     * Add <code>maxHeight</code> to data to add scrollbar with maxHeight(px)
     */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            component: PropTypes.node,
            maxHeight: PropTypes.number,
            ...Option.propTypes
        })
    ),
    /**
     * Fires event when user click on header elements;
     * (event: Event, item: Object) => void
     */
    onBack: PropTypes.func,
    /**
     * Fires event when user click on option elements;
     * (event: Event, item: Object) => void
     */
    onNext: PropTypes.func,
    /**
     * Fires event when user click on elements;
     * (event: Event, item: Object) => void
     */
    onSelect: PropTypes.func,
    /**
     * Controls screen type
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * auto scroll to activeElement
     */
    scrollToActiveElement: PropTypes.bool,
    /**
     * Initial selected options indexes array
     */
    initialIndexStack: PropTypes.arrayOf(PropTypes.string)
};

export default Menu;
