import React, { forwardRef, useCallback, useMemo } from 'react';
import { List } from 'react-virtualized';
import classnames from 'classnames';

import './index.scss';

import { Tooltip, Icon, Checkbox } from 'components';

const MultipleSelect = forwardRef(
    (
        {
            defaultSelected,
            showSelectAll,
            hideSelectAll,
            dropdownWidth,
            onHoverChange,
            scrollToIndex,
            onChildScroll,
            checkAllText,
            hoveredState,
            onChangeAll,
            isScrolling,
            listHeight,
            rowHeight,
            scrollTop,
            isMobile,
            valueKey,
            onChange,
            labelKey,
            readOnly,
            value,
            data
        },
        ref
    ) => {
        const activeData = useMemo(() => data.filter(({ disabled, parentId }) => !disabled && !parentId), [data]);
        const isControlled = !!value;
        const values = isControlled ? value : defaultSelected;
        const valuesLength = values.length;
        const dataLength = activeData.length;

        const labelPosition = useMemo(() => (isMobile ? 'left' : 'right'), [isMobile]);
        const labelAlignment = useMemo(() => (isMobile ? 'end' : 'start'), [isMobile]);

        const handleChange = useCallback(
            (e) => {
                if (!readOnly) {
                    const { checked, value } = e.target;
                    const newValues = checked ? values.concat(value) : values.filter((item) => item !== value);

                    onChange && onChange(newValues);
                }
            },
            [onChange, readOnly, values]
        );
        const virtualizedRowRenderer = (params) => {
            const { key, index, style } = params;

            const item = data[index] || {};
            const label = item[labelKey];
            const value = item[valueKey];

            return (
                <label
                    ref={index === hoveredState ? ref : null}
                    key={key}
                    style={style}
                    className={classnames('dropdown-item', {
                        hovered: index === hoveredState,
                        'read-only': readOnly,
                        disabled: item.disabled,
                        'group-title': item.parentId,
                        groupLastChild: item.groupLastChild
                    })}
                    tabIndex={index}
                    onMouseOver={() => onHoverChange(index)}
                    title={typeof label === 'string' ? label : ''}
                >
                    {readOnly ? (
                        label
                    ) : item.parentId ? (
                        <>
                            <p>{label}</p>
                            {item.tooltip && (
                                <Tooltip {...item.tooltip}>
                                    <Icon className="group-title-icon" type="bc-icon-info-48" />
                                </Tooltip>
                            )}
                        </>
                    ) : (
                        <Checkbox
                            checked={values.includes(value)}
                            labelAlignment={labelAlignment}
                            labelPosition={labelPosition}
                            onChange={handleChange}
                            label={label}
                            value={value}
                        />
                    )}
                </label>
            );
        };

        return (
            <>
                {!readOnly && showSelectAll && !hideSelectAll && (
                    <label
                        className={classnames('dropdown-item sticky-option', {
                            hovered: hoveredState === -1
                        })}
                        onMouseOver={() => onHoverChange(-1)}
                    >
                        <Checkbox
                            value="all"
                            indeterminate={valuesLength > 0 && valuesLength < dataLength}
                            checked={valuesLength >= dataLength}
                            labelAlignment={labelAlignment}
                            labelPosition={labelPosition}
                            onChange={onChangeAll}
                            label={checkAllText}
                        />
                    </label>
                )}
                <List
                    rowRenderer={virtualizedRowRenderer}
                    scrollToIndex={scrollToIndex}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    rowCount={data.length}
                    scrollTop={scrollTop}
                    rowHeight={rowHeight}
                    width={dropdownWidth}
                    height={listHeight}
                    autoHeight
                />
            </>
        );
    }
);

export default MultipleSelect;
