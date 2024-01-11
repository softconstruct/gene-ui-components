import React, { useCallback, useRef, memo, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import isEqual from 'react-fast-compare';

import { useMutationObserver, useUpdate } from 'hooks';
import { stopEvent } from 'utils';

import ActionBar from './actionBar';
import Nested from './Nested';
import Col from './col';

import { itemTypes } from '../utils';
import Icon from '../../../atoms/Icon';

function Row({
    style,
    index,
    prefix,
    opened,
    rowKey,
    orders,
    onClick,
    columns,
    eventRef,
    rowCount,
    colsInfo,
    moveItem,
    hasFooter,
    actionBar,
    rowsHover,
    sortedRows,
    rowsLength,
    lastColRef,
    isEditActive,
    CustomPreview,
    stickyColumns,
    setToggledRefs,
    rowExtraClick,
    toggleTooltips,
    rowExtraClickIconTooltip,
    selectedRowKey,
    withLeftCorner,
    rowOrderNumber,
    selectableRows,
    handleRowClick,
    rowHeightCache,
    stickyLeftExist,
    handleSelectRow,
    virtualizedList,
    initialColWidth,
    stickyRightExist,
    hasNestedElements,
    getDragAcceptType,
    disabledColumnPin,
    rowExtraClickNeeded,
    setToggledRowsKeys,
    renderRowNestedChildren,
    getExpandIconDisableState, // TODO: change prop name to getExpandDisableState
    ...row
}) {
    const { data, nestedTable, sortType, hasHover, dragDisable, className, disabled, render } = row;
    const ref = useRef(null);
    const nestedRef = useRef(null);

    const isExpandDisabled = useMemo(
        () => getExpandIconDisableState && getExpandIconDisableState(row, index),
        [getExpandIconDisableState, index, row]
    );

    const handleNestedUpdate = useCallback(() => {
        rowHeightCache.clear(rowOrderNumber);
        virtualizedList.recomputeRowHeights(rowOrderNumber + 1);
    }, [setToggledRefs, rowHeightCache, rowOrderNumber, virtualizedList]);

    useMutationObserver(nestedRef, handleNestedUpdate, { childList: true });

    const [_, drop] = useDrop({
        accept: `${itemTypes.tr}${eventRef.current}`,
        drop(item) {
            const dragIndex = item.index;
            const hoverIndex = index;
            moveItem(dragIndex, hoverIndex);
        }
    });

    const [ignored, drag, preview] = useDrag({
        item: { index },
        type: `${itemTypes.tr}${eventRef.current}`,
        canDrag: () => !opened && !dragDisable && !sortType && !isEditActive && rowsLength > 0,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    useEffect(() => {
        setToggledRefs((prev) => {
            const { [index]: removableKey, ...refs } = prev;

            return opened ? { ...refs, [index]: nestedRef } : refs;
        });
    }, [opened, index, nestedRef.current]);

    useUpdate(() => {
        handleNestedUpdate();
    }, [handleNestedUpdate]);

    const rowSelected = rowKey === selectedRowKey;

    const extraClickNeeded =
        typeof rowExtraClickNeeded === 'function' ? rowExtraClickNeeded(row, index) : rowExtraClickNeeded;

    const rowToggleHandler = useCallback(
        (e) => {
            stopEvent(e);
            if (!disabled) {
                handleRowClick(index, row);

                if (!isExpandDisabled) {
                    hasNestedElements &&
                        setToggledRowsKeys(
                            (prev) => {
                                if (prev.includes(rowKey)) {
                                    return prev.filter((key) => key !== rowKey);
                                }
                                return [...prev, rowKey];
                            },
                            [hasNestedElements]
                        );

                    handleNestedUpdate();
                }
            }
        },
        [
            isExpandDisabled,
            handleNestedUpdate,
            setToggledRowsKeys,
            handleRowClick,
            nestedRef,
            disabled,
            rowKey,
            index,
            row
        ]
    );

    const onExtraClick = useCallback(
        (e) => {
            stopEvent(e);
            extraClickNeeded && rowExtraClick && rowExtraClick(e, data, index, row);
        },
        [index, data, row, rowExtraClick, extraClickNeeded]
    );

    const handleClick = useCallback(() => {
        !opened && handleSelectRow(row, index, rowKey);
        onClick && onClick(data, index, row);
    }, [handleSelectRow, row, index, rowKey, onClick, data]);

    !dragDisable && drag(drop(ref));
    const customNestedElement = useMemo(
        () => renderRowNestedChildren && renderRowNestedChildren(row, index),
        [renderRowNestedChildren, index, row]
    );

    const hasNestedElement = useMemo(() => !!nestedTable || !!customNestedElement, [nestedTable, customNestedElement]);

    const isHoverable = useMemo(() => (typeof hasHover === 'boolean' ? hasHover : rowsHover), [hasHover, rowsHover]);

    useEffect(() => {
        CustomPreview && preview(getEmptyImage(), { captureDraggingState: true });
    }, [CustomPreview]);

    useEffect(() => {
        eventRef.current && getDragAcceptType(`${itemTypes.tr}${eventRef.current}`);
    }, [eventRef.current, getDragAcceptType]);

    if (render) {
        return (
            <div className={classnames('ta-group', className)} ref={ref} style={style}>
                {render(row, index)}
            </div>
        );
    }

    return (
        <div className={classnames('ta-group', className)} ref={ref} style={style} data-index={index}>
            <div
                className={classnames('ta-row', {
                    'even-coloring': rowOrderNumber % 2,
                    'hover-able': isHoverable || !!onClick || !!nestedTable || !!actionBar,
                    selected: rowSelected || opened,
                    'border-bottom': !(rowCount === index + 1 && hasFooter),
                    'cursor-grab': !dragDisable,
                    disabled
                })}
                onClick={handleClick}
                onDoubleClick={rowToggleHandler}
            >
                <div className="ta-gr-left-line" />
                {withLeftCorner && (
                    <div
                        className={classnames('ta-cell a-square', {
                            'sticky sticky-left now-sticky': stickyLeftExist,
                            'left-actions-holder': !stickyLeftExist
                        })}
                    >
                        {rowExtraClick ? (
                            extraClickNeeded ? (
                                <Icon
                                    title={rowExtraClickIconTooltip}
                                    onClick={onExtraClick}
                                    type="bc-icon-arrow-right"
                                    className="tl-bc-icon-action"
                                />
                            ) : (
                                <div className="ta-cell a-square" />
                            )
                        ) : null}
                        {hasNestedElements ? (
                            hasNestedElement ? (
                                <Icon
                                    type="bc-icon-arrow-down"
                                    disabled={isExpandDisabled}
                                    className={classnames('tl-bc-icon-action', {
                                        active: opened
                                    })}
                                    title={toggleTooltips[Number(opened)]}
                                    onClick={rowToggleHandler}
                                />
                            ) : (
                                <div className="ta-cell a-square" />
                            )
                        ) : null}
                    </div>
                )}
                {orders.map(({ dataKey, id }, colIndex) => {
                    const {
                        hide,
                        getter,
                        copyable,
                        formatter,
                        colRenderer,
                        copyableValue,
                        copyTooltipText,
                        copiedTooltipText
                    } = columns.find((column) => column.uid === id) || {};
                    const { autoSizeOn, customWidth, autoSizeWidth, defaultCustomWidth } = colsInfo[id];
                    if (hide) return null;
                    return (
                        <Col
                            id={id}
                            key={id}
                            row={row}
                            prefix={prefix}
                            index={index}
                            getter={getter}
                            copyable={copyable}
                            colIndex={colIndex}
                            text={data[dataKey]}
                            formatter={formatter}
                            autoSizeOn={autoSizeOn}
                            colRenderer={colRenderer}
                            customWidth={customWidth}
                            isEditActive={isEditActive}
                            copyableValue={copyableValue}
                            autoSizeWidth={autoSizeWidth}
                            stickyColumns={stickyColumns}
                            disabledColumnPin={disabledColumnPin}
                            initialColWidth={initialColWidth}
                            copyTooltipText={copyTooltipText}
                            copiedTooltipText={copiedTooltipText}
                            defaultCustomWidth={defaultCustomWidth}
                        />
                    );
                })}
                {actionBar && (
                    <ActionBar lastColRef={lastColRef} stickyRightExist={stickyRightExist}>
                        {actionBar(row, index, isEditActive)}
                    </ActionBar>
                )}
            </div>
            {opened && (
                <div className="ta-nested-child-holder">
                    <div className="ta-nested-child" ref={nestedRef}>
                        {nestedTable ? (
                            <Nested {...nestedTable} isEditActive={isEditActive} />
                        ) : (
                            customNestedElement && customNestedElement(row, index)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(Row, isEqual);
