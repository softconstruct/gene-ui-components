import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { WindowScroller, AutoSizer } from 'react-virtualized';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { useDeviceType, useKeyDown, useMount, useUpdatableRef, useClick, useClickOutside } from 'hooks';
import { inputConfig, screenTypes, popoverConfig } from 'configs';
import { noop, stopEvent } from 'utils';

import callAfterDelay from '../../../utils/callAfterDelay';
import ExtendedInput from '../../molecules/ExtendedInput';
import BusyLoader from '../../atoms/BusyLoader';
import Tooltip from '../../molecules/Tooltip';
import Popover from '../../atoms/PopoverV2';
import Empty from '../../atoms/Empty';

import MultipleSelect from './MultipleSelect';
import SingleSelect from './SingleSelect';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';
import useEllipsisDetection from '../../../hooks/useEllipsisDetection';

const MULTISELECT_SEARCH_HEIGHT = 65;
const CHECK_ALL_HEIGHT = 40;
const INPUT_HEIGHT = 232;
const DELAY = 10;

const searchCondition = ({ item, labelKey, searchQuery }) =>
    item[labelKey] && item[labelKey].toString().toLowerCase().includes(searchQuery.toString().toLowerCase());
const mapToLastChild = (item, ind, arr) => ({
    ...item,
    groupLastChild: !!((item.childId || item.parentId) && !('childId' in arr[ind + 1 > arr.length - 1 ? ind : ind + 1]))
});

function Dropdown({
    multiSelectWrappedText,
    searchPlaceholderText,
    shownRowsCountDesktop,
    shownRowsCountMobile,
    inputLabelTooltip,
    extendParentScope,
    multiSelectCount,
    rowHeightDesktop,
    labelAppearance,
    rowHeightMobile,
    showIconOnValid,
    unCheckAllText,
    isMultiSelect,
    data: options,
    defaultOpened,
    cornerRadius,
    defaultValue,
    checkAllText,
    colorOnValid,
    customSearch,
    onSwipedDown,
    flexibility,
    placeholder,
    tooltipText,
    description,
    onScrollEnd,
    appearance,
    screenType,
    noDataText,
    hasSearch,
    errorText,
    inputSize,
    className,
    isLoading,
    clearable,
    swipeable,
    labelKey,
    valueKey,
    onSearch,
    onScroll,
    disabled,
    onChange,
    readOnly,
    position,
    required,
    onClear,
    isValid,
    onClose,
    onOpen,
    onBlur,
    style,
    label,
    align,
    icon,
    ...restProps
}) {
    const [scrollRef, updateScrollRef] = useUpdatableRef(null);
    const setListRef = useClick((e) => e.preventDefault());
    const hoveredRowRef = useRef(null);
    const searchRef = useRef(null);
    const parentRef = useRef(null);
    const inputRef = useRef(null);

    const [selectedValue, setSelectedValue] = useState(null);
    const [scrollToIndex, setScrollToIndex] = useState(0);
    const [hoveredState, setHoveredState] = useState(-1);
    const [searchQuery, setSearchQuery] = useState(null);
    const [opened, setOpened] = useState(defaultOpened);
    const [openedOptions, setOpenedOptions] = useState([]);
    const [inputOutsideClick, setInputOutsideClick] = useState(false);

    const { isMobile } = useDeviceType(screenType);

    const dropdownWidth = parentRef.current ? parentRef.current.clientWidth : 0;
    const rowHeight = isMobile ? rowHeightMobile : rowHeightDesktop;
    const showSearch = hasSearch && (isMultiSelect || isMobile);
    const showActions = isMultiSelect && isMobile;
    const inputLabel = label || placeholder;
    const shownRowsHeight = rowHeight * (isMobile ? shownRowsCountMobile : shownRowsCountDesktop) + 16;

    const [isControlled, controlledValue] = useMemo(() => ['value' in restProps, restProps.value], [restProps]);
    const initialValue = useMemo(
        () => (isControlled ? controlledValue : defaultValue),
        [isControlled, controlledValue, defaultValue]
    );
    const setScrollRef = (element) => element && updateScrollRef(element);

    const [selectedValues, setSelectedValues] = useState(
        initialValue && initialValue.constructor === Array ? initialValue : []
    );
    const updatedSelectedValues = isControlled ? controlledValue || [] : selectedValues;
    const updatedSelectedValueMapping = isMultiSelect ? updatedSelectedValues : [];

    /**
     * setting openedOption
     */

    useEffect(() => {
        JSON.parse(JSON.stringify(options)).forEach((elem) => {
            if (!Array.isArray(elem.value)) {
                setOpenedOptions((prev) => [...prev, elem]);
            } else {
                const parentId = (Math.random() + 1).toString(36).substring(2);
                elem.parentId = parentId;

                setOpenedOptions((prev) => [...prev, elem]);
                elem.value.forEach((e) => {
                    e.childId = parentId;
                    setOpenedOptions((prev) => [...prev, e]);
                });
            }
        });

        return () => setOpenedOptions([]);
    }, [options]);

    const data = useMemo(
        () =>
            readOnly && isMultiSelect
                ? openedOptions.filter((item) => selectedValues.includes(item[valueKey]))
                : openedOptions,
        [readOnly, isMultiSelect, valueKey, options, openedOptions]
    );
    const inputValue = useMemo(() => {
        if (isMultiSelect) {
            return updatedSelectedValues.length
                ? updatedSelectedValues
                      .map((item) => {
                          const elem = data.find((i) => i[valueKey] === item);
                          return elem ? elem[labelKey] : null;
                      })
                      .join(', ')
                : '';
        }
        const foundValue = data.find((item) => item[valueKey] === selectedValue);
        const result = foundValue ? foundValue[labelKey] : '';
        if (searchQuery === '' && inputOutsideClick) return result;
        if (searchQuery !== null && !isMobile) return searchQuery;
        return result;
    }, [
        isMultiSelect,
        updatedSelectedValues,
        data,
        labelKey,
        valueKey,
        searchQuery,
        isMobile,
        selectedValue,
        inputOutsideClick
    ]);

    const [canClear, setCanClear] = useState(!!inputValue && clearable);

    const filteredData = useMemo(() => {
        const childIds = {};
        const parentIds = {};
        if (customSearch || !searchQuery) {
            return data.map(mapToLastChild);
        }
        // finding childIds and pushing in childIds
        for (const item of data) {
            if (searchCondition({ item, labelKey, searchQuery })) {
                item.childId && (childIds[item.childId] = item.childId);
                item.parentId && !childIds[item.parentId] && (parentIds[item.parentId] = item.parentId);
            }
        }

        return data
            .filter((item) => {
                // return groupParents of items that match
                if (item.parentId && childIds[item.parentId]) return true;

                if (parentIds[item.parentId] || parentIds[item.childId]) return true;

                return searchCondition({ item, labelKey, searchQuery }) && !item.parentId;

                // find last child in group
            })
            .map(mapToLastChild);
    }, [data, labelKey, searchQuery, customSearch, options, openedOptions]);

    const dataWithoutDisabledAndGroupParent = useMemo(
        () => filteredData.filter(({ disabled, parentId }) => !disabled && !parentId),
        [filteredData]
    );

    const hasSelectAll = useMemo(
        () => isMultiSelect && !readOnly && !isMobile && filteredData.length > 1,
        [isMultiSelect, readOnly, isMobile, filteredData, options, openedOptions]
    );

    const resetHovered = useCallback(() => {
        setScrollToIndex(-1);
        setHoveredState(-1);
    }, []);
    const open = useCallback(() => {
        if (!opened) {
            setInputOutsideClick(false);
            setOpened(true);
            onOpen();
        }
    }, [onOpen, opened, setInputOutsideClick]);

    const blur = useCallback(() => callAfterDelay(() => inputRef?.current?.blur()), []);

    const focus = useCallback(() => callAfterDelay(() => inputRef?.current?.focus()), []);

    const close = useCallback(() => {
        if (opened) {
            setOpened(false);
            nextAndPrevIsGroupChecker(hoveredState);
            setSearchQuery(null);
            resetHovered();
            onClose();
            blur();
        }
    }, [onClose, opened, resetHovered, blur]);

    /**
     * select dropdown change all handler
     */
    const handleChangeAll = useCallback(() => {
        const values = filteredData.filter(({ disabled, parentId }) => !disabled && !parentId);
        const newValues = values.length === updatedSelectedValues.length ? [] : values;
        const result = newValues.map((item) => item[valueKey]);
        if (!isControlled || !!controlledValue) {
            setSelectedValues(result);
        }
        onChange(data.filter((item) => result.includes(item[valueKey])));
    }, [filteredData, updatedSelectedValues.length, isControlled, controlledValue, onChange, data, valueKey]);

    /**
     * select dropdown swipe handler
     */
    const handleSwipedDown = useCallback(
        (event) => {
            if (opened) {
                onSwipedDown(event);
                close();
                blur();
            }
        },
        [close, opened, onSwipedDown, blur]
    );

    /**
     * select dropdown search handler
     */
    const handleSearchChange = useCallback(
        (e) => {
            resetHovered();
            const { value } = e.target;
            value !== '' && open();
            onSearch(value);
            nextAndPrevIsGroupChecker(hoveredState);
            setSearchQuery(value);
            setScrollToIndex(0);
        },
        [onSearch]
    );

    /**
     * checkbox click (check/unCheck) handler
     */
    const handleCheckboxModel = useCallback(
        (selections) => {
            const selectedList = data.filter((item) => selections.includes(item[valueKey]));
            setSelectedValues(selectedList.map((item) => item[valueKey]));
            onChange(selectedList);
            focus();
        },
        [onChange, data, valueKey, focus]
    );

    /**
     * single select dropdown selection handler
     */
    const handleSingleSelectSelection = useCallback(
        (item) => {
            if (!isControlled || (controlledValue !== null && item[valueKey] === controlledValue)) {
                setSelectedValue(item[valueKey]);
            }
            clearable && setCanClear(!!item);
            close();
            onChange(item);
        },
        [clearable, close, controlledValue, isControlled, onChange, valueKey, focus]
    );

    /**
     * select dropdown clear handler
     */
    const clearHandler = useCallback(() => {
        const setter = isMultiSelect ? [] : null;
        setCanClear(false);
        close();
        isMultiSelect ? setSelectedValues([]) : setSelectedValue(null);
        onChange(setter);
        onClear();
    }, [close, isMultiSelect, onChange, onClear]);

    /**
     * select dropdown blur handler
     */
    const handleBlur = useCallback(() => !isMultiSelect && !isMobile && onBlur(), [isMultiSelect, isMobile, onBlur]);

    /**
     * select dropdown outside click handler
     */
    const outsideClickHandler = useClickOutside((e) => {
        if (opened && !parentRef.current.contains(e.target)) {
            close();
            onBlur();
        }
    });

    /**
     * select Input outside click handler
     */
    const outsideClickInputHandler = useClickOutside((e) => {
        if (!opened && !parentRef.current.contains(e.target)) {
            setInputOutsideClick(selectedValue);
        }
    });

    /**
     * select dropdown scroll handler
     */
    const onScrollHandler = useCallback(
        (e) => {
            if (scrollRef.current.scrollHeight - INPUT_HEIGHT - e.scrollTop < 50) {
                onScrollEnd && onScrollEnd(e);
            }
            onScroll(e);
            setScrollToIndex(-1);
        },
        [onScroll, onScrollEnd, scrollRef]
    );

    /**
     * select dropdown header click handler
     */
    const onClickHandler = useCallback(() => {
        nextAndPrevIsGroupChecker(hoveredState);
        if (opened) {
            close();
            blur();
        } else if (readOnly && updatedSelectedValueMapping.length > 1) {
            open();
            !hasSearch && focus();
        } else if (!readOnly) {
            open();
            !hasSearch && focus();
        }
    }, [opened, close, open, blur, hasSearch, focus, readOnly, updatedSelectedValueMapping]);

    /**
     * select dropdown scroll top handler
     */
    const calculateScrollTopPosition = useCallback(
        (scrollTop) => {
            if (scrollToIndex >= 0) {
                const lastSectionsIndex =
                    filteredData.length + 1 - (isMobile ? shownRowsCountMobile : shownRowsCountDesktop);

                return scrollToIndex < lastSectionsIndex ? scrollToIndex * rowHeight : lastSectionsIndex * rowHeight;
            }
            return scrollTop;
        },
        [scrollToIndex, filteredData.length, rowHeight, isMobile, shownRowsCountMobile, shownRowsCountDesktop]
    );
    const nextAndPrevIsGroupChecker = (hoveredStateProp) => {
        const nextAndPrevState = {
            prevStep: 1,
            nextStep: 1,
            hoveredState: hoveredStateProp
        };

        if (
            filteredData.length &&
            (filteredData[hoveredStateProp] || hoveredStateProp === -1) &&
            filteredData[filteredData[hoveredStateProp + 1] ? hoveredStateProp + 1 : hoveredStateProp] &&
            ('parentId' in filteredData[filteredData[hoveredStateProp + 1] ? hoveredStateProp + 1 : hoveredStateProp] ||
                'disabled' in
                    filteredData[filteredData[hoveredStateProp + 1] ? hoveredStateProp + 1 : hoveredStateProp])
        ) {
            nextAndPrevState.nextStep = 2;

            const recursionNext = () => {
                if (
                    filteredData[hoveredStateProp + nextAndPrevState.nextStep] &&
                    ('parentId' in filteredData[hoveredStateProp + nextAndPrevState.nextStep] ||
                        'disabled' in filteredData[hoveredStateProp + nextAndPrevState.nextStep])
                ) {
                    nextAndPrevState.nextStep += 1;
                    recursionNext();
                }
            };
            recursionNext();
        }

        // prevStepCounter
        if (
            filteredData.length &&
            hoveredStateProp >= 0 &&
            filteredData[filteredData[hoveredStateProp - 1] ? hoveredStateProp - 1 : hoveredStateProp] &&
            ('parentId' in filteredData[filteredData[hoveredStateProp - 1] ? hoveredStateProp - 1 : hoveredStateProp] ||
                'disabled' in
                    filteredData[filteredData[hoveredStateProp - 1] ? hoveredStateProp - 1 : hoveredStateProp])
        ) {
            nextAndPrevState.prevStep = 2;
            const recursionPrev = () => {
                if (
                    filteredData[hoveredStateProp - nextAndPrevState.prevStep] &&
                    ('parentId' in filteredData[hoveredStateProp - nextAndPrevState.prevStep] ||
                        'disabled' in filteredData[hoveredStateProp - nextAndPrevState.prevStep])
                ) {
                    nextAndPrevState.prevStep += 1;
                    recursionPrev();
                }
            };
            recursionPrev();
        }

        return nextAndPrevState;
    };
    const arrowDownHandler = useCallback(() => {
        const { nextStep } = nextAndPrevIsGroupChecker(hoveredState);
        const maxIndex = filteredData.length - 1;
        if (hoveredState === maxIndex) return;
        setHoveredState((prevHoveredState) => {
            if (hoveredRowRef.current && scrollRef.current) {
                if (
                    hoveredRowRef.current.getBoundingClientRect().top -
                        scrollRef.current.getBoundingClientRect().top +
                        40 >
                    shownRowsHeight - MULTISELECT_SEARCH_HEIGHT - (hasSelectAll ? CHECK_ALL_HEIGHT : 0)
                ) {
                    const newState =
                        filteredData.length - nextStep > prevHoveredState
                            ? prevHoveredState + nextStep
                            : prevHoveredState;

                    const rowCount =
                        Math.floor((shownRowsHeight - (hasSelectAll ? CHECK_ALL_HEIGHT : 0)) / rowHeight) - 1;
                    newState > rowCount && setScrollToIndex(newState + (nextStep - 1) - rowCount);
                    return newState;
                }
                return maxIndex >= prevHoveredState + nextStep ? prevHoveredState + nextStep : prevHoveredState;
            }
            return prevHoveredState + nextStep;
        });
    }, [hoveredRowRef, shownRowsHeight, hasSelectAll, filteredData, nextAndPrevIsGroupChecker]);

    const arrowUpHandler = useCallback(() => {
        const minIndex = !isMultiSelect ? 0 : hasSelectAll ? -1 : 0;

        setHoveredState((prevHoveredState) => {
            const { prevStep } = nextAndPrevIsGroupChecker(prevHoveredState);

            let newState;
            if (prevHoveredState - prevStep >= minIndex) {
                newState = prevHoveredState - prevStep;
            } else {
                newState = prevHoveredState;
            }

            if (hoveredRowRef.current && scrollRef.current) {
                if (
                    hoveredRowRef.current.getBoundingClientRect().top - scrollRef.current.getBoundingClientRect().top <=
                    rowHeight + (isMultiSelect && hasSelectAll ? CHECK_ALL_HEIGHT : 0)
                ) {
                    setScrollToIndex(newState - prevStep <= minIndex ? 0 : newState);
                }
            }

            return newState;
        });
    }, [hoveredRowRef, shownRowsHeight, hasSelectAll, filteredData, nextAndPrevIsGroupChecker]);

    const multiselectEnterHandler = useCallback(() => {
        const hoveredStateOfData = filteredData[hoveredState];
        if (!readOnly) {
            if (hoveredState === -1) {
                handleChangeAll();
            } else if (hoveredStateOfData && !hoveredStateOfData.parentId && !hoveredStateOfData.disabled) {
                const newValues = !selectedValues.find((i) => i === hoveredStateOfData[valueKey])
                    ? selectedValues.concat(hoveredStateOfData[valueKey])
                    : selectedValues.filter((i) => i !== hoveredStateOfData[valueKey]);

                handleCheckboxModel(newValues);
            }
        }
        callAfterDelay(() => searchRef.current.focus(), DELAY);
    }, [filteredData, handleChangeAll, handleCheckboxModel, hoveredState, selectedValues, valueKey]);

    useEffect(() => {
        setCanClear(clearable && !!inputValue);
    }, [clearable, inputValue]);

    useEffect(() => {
        defaultOpened && focus();
    }, [defaultOpened]);

    useEffect(() => {
        if (isMultiSelect && filteredData && filteredData.length && hasSearch) {
            if (filteredData.every((i) => i.disabled) || filteredData.every((i) => i.parentId)) {
                setHoveredState(null);
            } else {
                setHoveredState(hasSelectAll ? -1 : 0);
            }
        }
    }, []);

    useEffect(() => {
        isMultiSelect && hasSearch && searchRef?.current && callAfterDelay(() => searchRef.current.focus());
    }, [hasSearch, searchRef?.current]);

    useEffect(() => {
        const dataObject = (data && data.find((item) => item[valueKey] === initialValue)) || {};
        setSelectedValue(dataObject[valueKey]);
    }, [data, initialValue, valueKey]);

    useKeyDown(
        (e) => {
            stopEvent(e, true);

            if (e.key === 'ArrowDown') {
                if (!opened) {
                    open();
                    return;
                }
                arrowDownHandler();
            } else if (e.key === 'ArrowUp') {
                arrowUpHandler();
            } else if (e.key === 'Enter') {
                if (!opened) {
                    open();
                    return;
                }
                const hoveredStateOfData = filteredData[hoveredState];
                if (isMultiSelect) {
                    multiselectEnterHandler();
                } else {
                    hoveredStateOfData &&
                        !hoveredStateOfData.disabled &&
                        !('parentId' in hoveredStateOfData) &&
                        handleSingleSelectSelection(hoveredStateOfData);
                }
            }
        },
        [
            open,
            opened,
            filteredData,
            handleSingleSelectSelection,
            arrowDownHandler,
            arrowUpHandler,
            hoveredState,
            multiselectEnterHandler
        ],
        parentRef,
        ['ArrowUp', 'ArrowDown', 'Enter']
    );

    useKeyDown(
        (e) => {
            stopEvent(e, true);
            if (e.key === 'Escape') {
                close();
                opened ? focus() : blur();
            } else if (e.key === 'ArrowDown') {
                arrowDownHandler();
            } else if (e.key === 'ArrowUp') {
                arrowUpHandler();
            } else if (e.key === 'Enter') {
                multiselectEnterHandler();
            }
        },
        [inputRef, arrowDownHandler, arrowUpHandler, multiselectEnterHandler, searchRef, close, focus, opened, blur],
        searchRef,
        ['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'Escape']
    );

    useKeyDown(
        (e) => {
            close();
            if (e.key === 'Escape') {
                opened ? focus() : blur();
            }
        },
        [close, opened, focus, blur],
        parentRef,
        ['Escape', 'Tab']
    );

    const dropdownInputValue = useMemo(
        () =>
            isMultiSelect && multiSelectCount < updatedSelectedValueMapping.length
                ? `${updatedSelectedValueMapping.length} ${multiSelectWrappedText}`
                : inputValue,
        [
            inputValue,
            updatedSelectedValueMapping,
            multiSelectWrappedText,
            isMultiSelect,
            multiSelectCount,
            updatedSelectedValueMapping
        ]
    );

    const [isTextTruncated, setIsTextTruncated] = useState(false);
    const ellipsisDetector = useEllipsisDetection(inputRef, [dropdownInputValue]);
    useEffect(() => setIsTextTruncated(ellipsisDetector), [ellipsisDetector]);

    const inputComponent = (
        <Tooltip padding={5} text={dropdownInputValue} position="bottom" isVisible={isTextTruncated}>
            <ExtendedInput
                value={
                    isMultiSelect && multiSelectCount < updatedSelectedValueMapping.length
                        ? `${updatedSelectedValueMapping.length} ${multiSelectWrappedText}`
                        : inputValue
                }
                ref={inputRef}
                labelAppearance={
                    labelAppearance === inputConfig.labelAppearance[2]
                        ? inputConfig.labelAppearance[2]
                        : inputConfig.labelAppearance[0]
                }
                onChange={(e) => {
                    onSearch(e.target.value);
                    return !isMultiSelect ? handleSearchChange(e) : noop;
                }}
                writeProtected={!hasSearch || isMobile || isMultiSelect}
                isDropdown={readOnly ? isMultiSelect : true}
                showClickableTooltipOnError={false}
                showIconOnValid={showIconOnValid}
                cornerRadius={cornerRadius}
                colorOnValid={colorOnValid}
                flexibility={flexibility}
                placeholder={placeholder}
                tooltipText={tooltipText}
                onClick={onClickHandler}
                appearance={appearance}
                screenType={screenType}
                onClear={clearHandler}
                inputSize={inputSize}
                errorText={errorText}
                showErrorIcon={false}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                onBlur={handleBlur}
                canClear={canClear}
                isValid={isValid}
                icon={icon}
                className={classnames({
                    'read-only-cursor-default': readOnly && updatedSelectedValueMapping.length < 2
                })}
            />
        </Tooltip>
    );

    const setClosePopover = () => document.hidden && setOpened(false);
    useMount(() => {
        document.addEventListener('visibilitychange', setClosePopover);
        return () => {
            document.removeEventListener('visibilitychange', setClosePopover);
        };
    });
    const conditionalContainerParent = useMemo(
        () => (!isMobile && extendParentScope ? { containerParent: parentRef?.current, disableTransform: true } : {}),
        [parentRef?.current, isMobile, extendParentScope]
    );

    const handleParentFocus = () => {
        inputRef.current.focus();
    };

    return (
        <div
            className={classnames(
                className,
                'dropdown-holder',
                `f-${flexibility}`,
                `a-${appearance}`,
                `s-${inputSize}`,
                {
                    'mobile-view': isMobile,
                    'pointer-events-none-dropdown': disabled || (!isMultiSelect && readOnly)
                }
            )}
            ref={parentRef}
            style={style}
            {...restProps}
        >
            {labelAppearance === inputConfig.labelAppearance[1] && (
                <Tooltip position="auto" title={inputLabel}>
                    <div
                        style={{
                            width: 'fit-content'
                        }}
                        className="input-title ellipsis-text"
                    >
                        {inputLabel}
                    </div>
                </Tooltip>
            )}

            {!disabled ? (
                <Popover
                    contentRef={outsideClickHandler}
                    onSwipedDown={handleSwipedDown}
                    getScrollRef={setScrollRef}
                    maxHeight={shownRowsHeight}
                    cornerRadius={cornerRadius}
                    screenType={screenType}
                    swipeable={swipeable}
                    position={position}
                    disableReposition
                    isOpen={opened}
                    align={align}
                    padding={5}
                    Header={
                        (showActions || showSearch) && (
                            <>
                                {showActions && (
                                    <ul className="dropdown-actions">
                                        <li>
                                            <button onClick={handleChangeAll} className="cursor-pointer">
                                                {selectedValues.length === dataWithoutDisabledAndGroupParent.length
                                                    ? unCheckAllText
                                                    : checkAllText}
                                                {` (${selectedValues.length}/${dataWithoutDisabledAndGroupParent.length})`}
                                            </button>
                                        </li>
                                        <li className="cursor-pointer">
                                            <strong onClick={close}>Done</strong>
                                        </li>
                                    </ul>
                                )}
                                {(readOnly ? data.length > 4 : showSearch) && (
                                    <div className="popover-search">
                                        <ExtendedInput
                                            inputSize={isMobile ? 'big' : inputSize}
                                            placeholder={searchPlaceholderText}
                                            showIconOnValid={showIconOnValid}
                                            onChange={handleSearchChange}
                                            colorOnValid={colorOnValid}
                                            icon="bc-icon-search"
                                            appearance="minimal"
                                            value={searchQuery}
                                            ref={searchRef}
                                            onBlur={onBlur}
                                            canClear
                                        />
                                    </div>
                                )}
                            </>
                        )
                    }
                    Content={
                        <div ref={setListRef} className="popover-top-bottom-padding">
                            {isLoading ? (
                                <BusyLoader isBusy className="busy-loader" />
                            ) : filteredData.length ? (
                                scrollRef.current && (
                                    <WindowScroller scrollElement={scrollRef.current} onScroll={onScrollHandler}>
                                        {({ isScrolling, scrollTop, onChildScroll, height = 0 }) => (
                                            <AutoSizer disableHeight>
                                                {({ width }) =>
                                                    isMultiSelect ? (
                                                        <MultipleSelect
                                                            defaultSelected={
                                                                !isControlled ? updatedSelectedValueMapping : []
                                                            }
                                                            value={isControlled ? updatedSelectedValueMapping : null}
                                                            scrollTop={calculateScrollTopPosition(scrollTop)}
                                                            hideSelectAll={filteredData.length <= 1}
                                                            dropdownWidth={width || dropdownWidth}
                                                            onHoverChange={setHoveredState}
                                                            onChange={handleCheckboxModel}
                                                            scrollToIndex={scrollToIndex}
                                                            onChildScroll={onChildScroll}
                                                            onChangeAll={handleChangeAll}
                                                            checkAllText={checkAllText}
                                                            hoveredState={hoveredState}
                                                            showSelectAll={!isMobile}
                                                            isScrolling={isScrolling}
                                                            rowHeight={rowHeight}
                                                            ref={hoveredRowRef}
                                                            readOnly={readOnly}
                                                            data={filteredData}
                                                            valueKey={valueKey}
                                                            labelKey={labelKey}
                                                            isMobile={isMobile}
                                                            listHeight={height}
                                                        />
                                                    ) : (
                                                        <SingleSelect
                                                            scrollTop={calculateScrollTopPosition(scrollTop)}
                                                            onChange={handleSingleSelectSelection}
                                                            dropdownWidth={width || dropdownWidth}
                                                            onHoverChange={setHoveredState}
                                                            selectedValue={selectedValue}
                                                            onChildScroll={onChildScroll}
                                                            scrollToIndex={scrollToIndex}
                                                            hoveredState={hoveredState}
                                                            isScrolling={isScrolling}
                                                            rowHeight={rowHeight}
                                                            ref={hoveredRowRef}
                                                            valueKey={valueKey}
                                                            labelKey={labelKey}
                                                            data={filteredData}
                                                            listHeight={height}
                                                            isMobile={isMobile}
                                                        />
                                                    )
                                                }
                                            </AutoSizer>
                                        )}
                                    </WindowScroller>
                                )
                            ) : (
                                !isLoading && (
                                    <div className="empty-data-holder">
                                        <Empty
                                            appearance="greyscale"
                                            className="absolute"
                                            title={noDataText}
                                            withImage
                                            type="image"
                                            size="small"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    }
                    {...conditionalContainerParent}
                >
                    <div onFocus={handleParentFocus} ref={outsideClickInputHandler}>
                        {inputComponent}
                    </div>
                </Popover>
            ) : (
                inputComponent
            )}
            {description && <div className="input-description">{description}</div>}
        </div>
    );
}

Dropdown.propTypes = {
    /**
     * Data is an Array with objects
     * default
     * {
     * label:string,
     * value:string
     * }
     *
     * optional
     * {
     * disabled:true,
     *     tag: {
     *             name: string,
     *             color: string,
     *             size: string,//one of 'small', 'default', 'big'
     *             appearance: string,//one of  'outline', 'minimal', 'light'
     *             cornerRadius:string,//one of  'full-radius', 'smooth-radius',
     *         }
     * }
     *
     *for grouping value of item must be Array of items
     *     {
     *          label:string,
     *          value:[{item},{item}]
     *      }
     *
     * for adding info icon with tooltip add to group Object tooltip key with Tooltip component props ( all Tooltip component props are support (for more info see Molecules/Tooltip))
     *     {
     *          label:string,
     *          tooltip{
     *               title:'tooltip title',
     *               text: 'tooltip Text',
     *               ...
     *          }
     *          value:[{item},{item}]
     *      }
     */
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    /**
     * labelKey variables for object of "data"
     * user defines what dropdown should expect for label, value
     */
    labelKey: PropTypes.string,
    /**
     * valueKey variables for object of "data"
     * user defines what dropdown should expect for label, value
     */
    valueKey: PropTypes.string,
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Validation of dropdown
     * e.g. when isValue === false, dropdown has red shape
     */
    isValid: PropTypes.bool,
    /**
     * Text for check all
     */
    checkAllText: PropTypes.string,
    /**
     * Text for uncheck all
     */
    unCheckAllText: PropTypes.string,
    /**
     * Dropdown can be opened as default
     */
    defaultOpened: PropTypes.bool,
    /**
     * Placeholder for dropdown
     */
    placeholder: PropTypes.string,
    /**
     * Placeholder for search of multiple select dropdown
     */
    searchPlaceholderText: PropTypes.string,
    /**
     * Error message when field is invalid
     */
    errorText: PropTypes.string,
    /**
     * Use this prop to specify tooltip message.
     */
    tooltipText: PropTypes.string,
    /**
     * Disabled state
     */
    disabled: PropTypes.bool,
    /**
     * Dropdown can have default value
     */
    defaultValue: PropTypes.any,
    /**
     * Value for controlled dropdown,
     * can be changed outside of dropdown logic
     */
    value: PropTypes.any,
    /**
     * Multiple select dropdown options count
     * when count reached, system automatically
     * switches selected options text (Option 1, Option2, Option 3) to short/simple text (3 option selected),
     * which is given by `multiSelectWrappedText` prop;
     */
    multiSelectCount: PropTypes.number,
    /**
     * Text for wrapping options e.g. ((Option 1, Option2, Option 3) to short/simple text (3 option selected))
     */
    multiSelectWrappedText: PropTypes.string,
    /**
     * Different types/view/design for dropdown
     */
    appearance: PropTypes.oneOf(inputConfig.appearance),
    /**
     * Switches from single Select dropdown to Maltiple select dropdown
     */
    isMultiSelect: PropTypes.bool,
    /**
     * The switch between mobile and desktop version of Dropdown will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside.
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Dropdown size switcher
     */
    inputSize: PropTypes.oneOf(inputConfig.size),
    /**
     * Custom No data text
     */
    noDataText: PropTypes.string,
    /**
     * Fires event for handling change of value/selected option
     * (data => isMultiSelect' ? [{}] : {}])
     */
    onChange: PropTypes.func,
    /**
     * If  true then search functional must be controlled outside
     */
    customSearch: PropTypes.bool,
    /**
     * Enable/Disable search in dropdown
     */
    hasSearch: PropTypes.bool,
    /**
     * Fires event when search
     */
    onSearch: PropTypes.func,
    /**
     * Fires event when scroll
     */
    onScroll: PropTypes.func,
    /**
     * Fires event when dropdown is being opened
     */
    onOpen: PropTypes.func,
    /**
     * Fires event when dropdown is being closed
     * ((event: Event) => void)
     */
    onClose: PropTypes.func,
    /**
     * Fires event when scroll ends
     * ((event: { scrollTop: number, scrollLeft: number }) => void)
     */
    onScrollEnd: PropTypes.func,
    /**
     * How to display inscription in relation to it's parent in ExtenedInput
     * ((event: Event) => void)
     */
    flexibility: PropTypes.oneOf(inputConfig.flexibility),
    /**
     * Read only state for dropdown
     */
    readOnly: PropTypes.bool,
    /**
     * Defines style of dropdown corner
     */
    cornerRadius: PropTypes.oneOf(inputConfig.cornerRadius),
    /**
     * Defines which side to open dropdown
     */
    position: PropTypes.oneOfType([
        PropTypes.oneOf(popoverConfig.position),
        PropTypes.arrayOf(PropTypes.oneOf(popoverConfig.position))
    ]),
    /**
     * Possible values are start, center, and end.
     * If start is specified, the popover content's top or left location is aligned with its target's.
     * With end specified, the content's bottom or right location is aligned with its target's.
     * If center is specified, the popover content and target's centers are aligned.
     */
    align: PropTypes.oneOf(popoverConfig.align),
    /**
     * Label for dropdown
     */
    label: PropTypes.string,
    /**
     * Behaviour of label
     */
    labelAppearance: PropTypes.oneOf(inputConfig.labelAppearance),
    /**
     * Description for dropdown
     */
    description: PropTypes.string,
    /**
     * Label tooltip
     */
    inputLabelTooltip: PropTypes.string,
    /**
     * Dropdown can have icon,
     * as default its empty,
     * for having one, icon must be defined e.g. 'bc-icon-apps'
     *
     * Valid values are same as "Icon" atom "type" prop values
     */
    icon: PropTypes.string,
    /**
     * Prop is being used for dropdown to clear selected value
     */
    clearable: PropTypes.bool,
    /**
     * Row height for desktop device
     */
    rowHeightDesktop: PropTypes.number,
    /**
     * Row height for mobile device
     */
    rowHeightMobile: PropTypes.number,
    /**
     * Shown rows count from desktop device
     */
    shownRowsCountDesktop: PropTypes.number,
    /**
     * Shown rows count from mobile device
     */
    shownRowsCountMobile: PropTypes.number,
    /**
     * Show color when field valid
     */
    colorOnValid: PropTypes.bool,
    /**
     * Show icon when field valid
     */
    showIconOnValid: PropTypes.bool,
    /**
     * Is loading state.
     */
    isLoading: PropTypes.bool,
    /**
     * Swipeable dropdown body state
     */
    swipeable: PropTypes.bool,
    /**
     * Fires event when dropdown swiped down
     * ((event: Event) => void)
     */
    onSwipedDown: PropTypes.func,
    /**
     * When extendParentScope is true, the popover generates in a dropdown wrapper instead of closing the body tag, and the position will not calculate.
     */
    extendParentScope: PropTypes.bool
};

Dropdown.defaultProps = {
    labelAppearance: inputConfig.labelAppearance[0],
    multiSelectWrappedText: 'options selected',
    cornerRadius: inputConfig.cornerRadius[0],
    flexibility: inputConfig.flexibility[0],
    appearance: inputConfig.appearance[0],
    searchPlaceholderText: 'Search',
    unCheckAllText: 'Deselect All',
    inputSize: inputConfig.size[1],
    align: popoverConfig.align[0],
    noDataText: 'No data found',
    position: ['bottom', 'top'],
    checkAllText: 'Select All',
    extendParentScope: false,
    showIconOnValid: false,
    placeholder: 'Select',
    defaultOpened: false,
    isMultiSelect: false,
    colorOnValid: false,
    shownRowsCountDesktop: 5,
    shownRowsCountMobile: 7,
    rowHeightDesktop: 40,
    rowHeightMobile: 48,
    multiSelectCount: 2,
    labelKey: 'label',
    valueKey: 'value',
    description: '',
    isLoading: false,
    clearable: false,
    disabled: false,
    hasSearch: true,
    readOnly: false,
    isValid: true,
    onScrollEnd: noop,
    onChange: noop,
    onSearch: noop,
    onScroll: noop,
    onClear: noop,
    onClose: noop,
    onOpen: noop,
    onBlur: noop,
    label: '',
    icon: '',
    onSwipedDown: noop,
    swipeable: false
};

export default Dropdown;
