import React, { useMemo, useCallback, forwardRef, memo } from 'react';
import classnames from 'classnames';
import isEqual from 'react-fast-compare';

// Helpers
import { arrayReorder } from '../utils';

// Local components
import HeaderItem from './item';
import ActionBar from '../Row/actionBar';

// Styles
import './index.scss';

const Header = forwardRef(
    (
        {
            orders,
            groups,
            columns,
            disabled,
            hasDoubleHeader,
            changeOrders,
            withLeftCorners,
            withRightCorner,
            stickyLeftExist,
            colsInfo,
            ...rest
        },
        ref
    ) => {
        const moveItem = useCallback(
            (dragIndex, hoverIndex) => {
                if (dragIndex === hoverIndex) return;
                if (hoverIndex === 0 && columns[0].draggable === false) return;

                changeOrders(arrayReorder(orders, dragIndex, hoverIndex));
            },
            [orders, changeOrders]
        );

        const findColumn = (id) => columns.find((column) => column.uid === id);

        const groupSteps = useMemo(
            () =>
                groups &&
                groups.length > 0 &&
                groups.reduce(
                    (acc, { innerColCount }, index) => [...acc, index ? acc[index - 1] + innerColCount : innerColCount],
                    []
                ),
            [groups]
        );

        const innerColWidth = useCallback(
            (index) => {
                const width = [...columns]
                    .slice(index ? groupSteps[index - 1] : 0, groupSteps[index])
                    .reduce((prev, { uid }) => {
                        if (!colsInfo[uid]) return prev;

                        const { customWidth, autoSizeWidth, defaultCustomWidth = 150 } = colsInfo[uid];

                        return prev + (autoSizeWidth || customWidth || defaultCustomWidth);
                    }, 0);

                return {
                    [index]: {
                        customWidth: width,
                        autoSizeWidth: 0,
                        defaultCustomWidth: 0,
                        autoSizeOn: false
                    }
                };
            },
            [colsInfo, columns, groupSteps]
        );

        const templateRenderer = (content) => (
            <div className="ta-row border-bottom">
                {withLeftCorners.map(
                    (item, index) =>
                        item && (
                            <div
                                key={index}
                                className={classnames('ta-cell a-square', {
                                    'sticky sticky-left now-sticky': stickyLeftExist
                                })}
                                {...(index === 0 && { ref })}
                            />
                        )
                )}
                {content}
                {withRightCorner && <ActionBar />}
            </div>
        );

        return (
            <div
                className={classnames('ta-n-body ta-header', {
                    'pointer-events-none': disabled
                })}
            >
                {hasDoubleHeader &&
                    groups &&
                    groups.length > 0 &&
                    templateRenderer(
                        groups.map(({ text }, index) => (
                            <HeaderItem
                                key={index}
                                id={index}
                                text={text}
                                index={index}
                                centered
                                sortable={false}
                                draggable={false}
                                resizable={false}
                                hasOptions={false}
                                sortableColumns={false}
                                resizableColumns={false}
                                draggableColumns={false}
                                {...rest}
                                stickyColumns={[]}
                                colsInfo={innerColWidth(index)}
                                lastIndexOf={groups.length - (index + 1)}
                            />
                        ))
                    )}
                {templateRenderer(
                    orders.map(({ id }, index) => {
                        const hide = findColumn(id)?.hide;
                        if (hide) return null;
                        return (
                            <HeaderItem
                                key={id}
                                id={id}
                                index={index}
                                {...findColumn(id)}
                                moveItem={moveItem}
                                colsInfo={colsInfo}
                                lastIndexOf={orders.length - (index + 1)}
                                {...rest}
                            />
                        );
                    })
                )}
            </div>
        );
    }
);

Header.defaultProps = {
    columns: [],
    withLeftCorners: []
};

export default memo(Header, isEqual);
