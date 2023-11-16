import React, { forwardRef } from 'react';
import classnames from 'classnames';
import { List } from 'react-virtualized';

import { stopEvent } from 'utils';
import Icon from '../../atoms/Icon';
import Tag from '../../molecules/Tag';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';
import { Tooltip } from '../../molecules';

const SingleSelect = forwardRef(
    (
        {
            selectedValue,
            onHoverChange,
            scrollToIndex,
            dropdownWidth,
            onChildScroll,
            hoveredState,
            isScrolling,
            listHeight,
            rowHeight,
            valueKey,
            onChange,
            labelKey,
            scrollTop,
            data
        },
        ref
    ) => {
        const clickHandler = (e, item) => {
            stopEvent(e);
            if (!item.parentId) onChange(item);
        };

        const renderedList = (item, index, style) => {
            const label = item[labelKey];
            const { icon, tag, parentId } = item;
            const value = item[valueKey];

            return (
                <div
                    key={index}
                    style={style}
                    onMouseOver={() => onHoverChange(index)}
                    onClick={(event) => clickHandler(event, item)}
                    ref={index === hoveredState ? ref : null}
                    className={classnames('dropdown-item', {
                        selected: value === selectedValue,
                        hovered: index === hoveredState,
                        disabled: item.disabled,
                        'group-title': item.parentId,
                        groupLastChild: item.groupLastChild
                    })}
                >
                    <p title={typeof label === 'string' ? label : ''}>
                        {icon && <Icon type={icon} />}
                        <span>{label}</span>
                    </p>
                    {!parentId ? (
                        tag?.color ? (
                            <Tag name={tag?.name} color={tag.color} {...tag} />
                        ) : (
                            tag?.name && <div className="dropdown-item-tag">{tag.name}</div>
                        )
                    ) : (
                        item.tooltip && (
                            <Tooltip {...item.tooltip}>
                                <Icon className="group-title-icon" type="bc-icon-info-48" />
                            </Tooltip>
                        )
                    )}
                    {!parentId && <small className="icon bc-icon-selected" />}
                </div>
            );
        };

        const virtualizedRowRenderer = (params) => {
            const { index, style } = params;

            const item = data[index] || {};

            return renderedList(item, index, style);
        };

        return (
            <List
                rowRenderer={virtualizedRowRenderer}
                scrollToIndex={scrollToIndex}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={data.length}
                width={dropdownWidth}
                scrollTop={scrollTop}
                rowHeight={rowHeight}
                height={listHeight}
                autoHeight
            />
        );
    }
);

export default SingleSelect;
