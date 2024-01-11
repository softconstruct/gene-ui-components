import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import classnames from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import isEqual from 'react-fast-compare';

import { useMount } from 'hooks';
import { callAfterDelay, stopEvent, debounce } from 'utils';

import { Popover, Icon, Dropdown, ExtendedInput, Menu } from 'components';
import { resizeConfigs, searchConfigs } from '../../../../utils/configs/tableConfigs';


import { itemTypes } from '../utils';
import resizeHandler from './resize';

function HeaderItem({
    id,
    index,
    thStyle,
    centered,
    scrollBar,
    sortOrder,
    prefix,
    moveItem,
    className,
    isEditActive,
    sortActiveId,
    stickyColumns,
    updateColsInfo,
    handleStickyClick,
    changeSortColumn,
    onMenuActionClick,
    popoverOpenedId,
    onToggleColumnAutoSize,
    setPopoverOpenedId,
    setStickyColumns,
    initialColWidth,
    tableRef,
    eventRef,
    lastColRef,
    firstColRef,
    sortableColumns,
    resizableColumns,
    draggableColumns,
    sortedRowsLength,
    disabledColumnPin,
    columnSizeChangeHandler,
    searchHandler,
    lastIndexOf,
    colsInfo: {
        [id]: { autoSizeOn: currColAutoSizeOn, customWidth, autoSizeWidth, defaultCustomWidth }
    },
    ...column
}) {
    const {
        text,
        render,
        dataKey,
        draggable,
        width: propWidth = null,
        sortable,
        resizable,
        hasOptions,
        searchInColumns
    } = column;

    const { [index]: colStickyInfo = {} } = stickyColumns;
    const { offset = {}, isStickyLeft, isStickyRight } = colStickyInfo;
    const stickyStatus = stickyColumns.hasOwnProperty(String(index));
    const isDraggable = typeof draggable === 'boolean' ? draggable : draggableColumns;
    const isResizable = typeof resizable === 'boolean' ? resizable : resizableColumns;

    const leftStickyRef = useRef(null);
    const rightStickyRef = useRef(null);
    const mainRef = useRef(null);
    const rightResizeRef = useRef(null);
    const isSortActive = id === sortActiveId;
    const [resizeMode, setResizeMode] = useState(false);
    const [{ isOver }, drop] = useDrop({
        accept: `${itemTypes.th}${eventRef.current}`,
        drop(item) {
            const dragIndex = item.index;
            const hoverIndex = index;
            moveItem(dragIndex, hoverIndex);
        },
        canDrop: () => !stickyStatus,
        collect: (monitor) => ({ isOver: !!monitor.isOver() })
    });

    const [_, drag] = useDrag({
        item: { index },
        type: `${itemTypes.th}${eventRef.current}`,
        canDrag: () => !resizeMode && isDraggable && !stickyStatus
    });

    const [width, setWidth] = useState(propWidth);

    useMount(() => {
        updateColsInfo(id, false, width);
    });

    useEffect(() => {
        updateColsInfo(id, false, defaultCustomWidth || initialColWidth);
    }, [initialColWidth]);

    drag(drop(mainRef));

    const handleColInfoUpdate = useCallback((width) => updateColsInfo(id, false, width), [id]);
    const onSortClick = useCallback(
        () => column.sortable !== false && !resizeMode && changeSortColumn({ id, index, column, dataKey }),
        [resizeMode, changeSortColumn, id, index, column, dataKey]
    );

    const onStickyClick = useCallback(() => {
        setPopoverOpenedId(null);
        handleStickyClick(index, leftStickyRef.current, rightStickyRef.current, mainRef.current);
    }, [handleStickyClick, index, leftStickyRef.current, rightStickyRef.current, mainRef.current]);

    const isPopoverOpened = id === popoverOpenedId;

    const handleToggle = useCallback(() => setPopoverOpenedId((prevId) => (prevId === id ? null : id)), [id]);

    const inlineStyle = {
        width: currColAutoSizeOn ? autoSizeWidth : customWidth || defaultCustomWidth || width || initialColWidth || 0
    };
    const { left = 0, right = 0 } = offset;
    const style = { left, right, ...inlineStyle, ...thStyle };

    const toggleAutoSizing = () => {
        setPopoverOpenedId(null);
        callAfterDelay(() => {
            onToggleColumnAutoSize(id, !currColAutoSizeOn, width);
            returnSizeHandler(resizeConfigs.typeEnum.autoSize);
        }, 180);
    };

    const anySortActive = isSortActive && !!sortOrder;
    const isSortable = typeof sortable === 'boolean' ? sortable : sortableColumns;

    const returnSizeHandler = useCallback(
        (type, width = null) => columnSizeChangeHandler && columnSizeChangeHandler({ type, width, key: dataKey }),
        [columnSizeChangeHandler, dataKey]
    );

    const onMouseDownHandler = useCallback(
        (e) => {
            stopEvent(e);
            resizeHandler(
                mainRef.current,
                setWidth,
                propWidth || initialColWidth,
                setResizeMode,
                handleColInfoUpdate,
                Object.keys(stickyColumns).length,
                setStickyColumns,
                tableRef,
                eventRef,
                firstColRef,
                lastColRef,
                returnSizeHandler
            );
        },
        [
            mainRef.current,
            propWidth,
            initialColWidth,
            stickyColumns,
            tableRef.current,
            eventRef,
            firstColRef,
            lastColRef,
            returnSizeHandler
        ]
    );

    const dataChangeHandler = useCallback(
        ({ action, type }) => {
            const filter = {
                value: null,
                dataKey,
                type
            };
            if (type === searchConfigs.typeEnum.select) {
                filter.value = action.map((i) => i.value);
            } else if (type === searchConfigs.typeEnum.text) {
                filter.value = action;
            }
            searchHandler(filter);
        },
        [dataKey, searchHandler]
    );

    const debounceHandler = useCallback(
        ({ action }) =>
            debounce(
                dataChangeHandler({
                    action: action.target.value,
                    type: searchInColumns.type
                }),
                500
            ),
        [dataChangeHandler, debounce]
    );

    return (
        <>
            {stickyStatus && isStickyLeft && <sub />}
            {stickyStatus && isStickyRight && <sup />}
            <div
                ref={mainRef}
                className={classnames('ta-cell ta-header-cell', className, {
                    ...(!disabledColumnPin
                        ? {
                              'now-sticky': isStickyLeft || isStickyRight,
                              sticky: stickyStatus,
                              'sticky-left': isStickyLeft,
                              'sticky-right': isStickyRight
                          }
                        : {}),
                    'is-dragged-over': isOver,
                    'cursor-pointer': isSortable,
                    'cursor-grab': isDraggable,
                    centered
                })}
                data-id={`${prefix}-${id}`}
                style={style}
                onClick={onSortClick}
                title={render ? '' : text}
            >
                <div className="ta-cell-block">
                    <div className="ta-cell-header-tittle ta-cell-header-item">
                        <div className="sticky-viewport-checker" ref={leftStickyRef} style={{ width: 1, left: -1 }} />
                        <div className="table-heading">
                            <div
                                className={classnames('table-heading-text', 'ellipsis-text', {
                                    active: anySortActive
                                })}
                            >
                                {render ? render(column, index, isEditActive) : text}
                            </div>
                            {isSortable && (
                                <div
                                    className={classnames('ta-filter-icon', {
                                        [`active-${sortOrder}`]: anySortActive
                                    })}
                                />
                            )}
                        </div>
                        {hasOptions && (
                            <div onClick={stopEvent}>
                                <Popover
                                    align="end"
                                    padding={0}
                                    disableReposition={false}
                                    isOpen={isPopoverOpened}
                                    toggleHandler={handleToggle}
                                    extendTargetWidth={false}
                                    Content={
                                        <Menu
                                            data={[
                                                {
                                                    title: `${stickyStatus ? 'Unpin' : 'Pin'} column`,
                                                    slug: 'pin',
                                                    onClick: onStickyClick,
                                                    disabled: !sortedRowsLength || disabledColumnPin
                                                },
                                                {
                                                    title: currColAutoSizeOn ? 'Unautosize' : 'Autosize',
                                                    slug: 'autosize',
                                                    onClick: toggleAutoSizing,
                                                    disabled: !sortedRowsLength
                                                }
                                            ]}
                                            onSelect={handleToggle}
                                        />
                                    }
                                >
                                    <Icon type="bc-icon-drag" className="cell-options" />
                                </Popover>
                            </div>
                        )}
                    </div>
                    {searchInColumns && (
                        <div className="ta-cell-search-block ta-cell-header-item">
                            {searchInColumns.type === searchConfigs.typeEnum.text && (
                                <ExtendedInput
                                    onChange={(action) => debounceHandler({ action })}
                                    onClick={stopEvent}
                                    placeholder={text}
                                />
                            )}
                            {searchInColumns.type === searchConfigs.typeEnum.select && (
                                <Dropdown
                                    className="search-dropdown"
                                    onChange={(action) =>
                                        dataChangeHandler({
                                            action,
                                            type: searchInColumns.type
                                        })
                                    }
                                    data={searchInColumns.data || []}
                                    isMultiSelect
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="th-divider-holder" onClick={stopEvent}>
                    {isResizable && (
                        <i className="table-resize-handle" ref={rightResizeRef} onMouseDown={onMouseDownHandler} />
                    )}
                    {!!lastIndexOf && <i className="th-divider" />}
                </div>
                <div className="sticky-viewport-checker" ref={rightStickyRef} style={{ width: 1, right: -1 }} />
            </div>
            {isDraggable && (
                <div
                    className={classnames('drop-placeholder', {
                        'drop-placeholder-scale': isOver
                    })}
                />
            )}
        </>
    );
}

HeaderItem.defaultProps = {
    sortableColumns: false,
    resizableColumns: false,
    draggableColumns: false,
    hasOptions: true
};

export default memo(HeaderItem, isEqual);
