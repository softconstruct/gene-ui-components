import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { oneIsRequired, noop, stopEvent } from 'utils';
import { useBodyScroll } from 'hooks';

// Components
import Button from '../../atoms/Button';
import MobilePopUp from '../MobilePopup';

// Local components
import CardMenu from './Menu';
import Col from './Col';

// Styles
import './index.scss';

function Card({
    renderRowNestedChildren,
    isCustomScrollElement,
    viewCardText,
    expandText,
    cancelText,
    expandedCloseText,
    hideMore,
    expandedText,
    rowActionBar,
    columnLimit,
    columnKey,
    getPopupProps,
    virtualizedList,
    isEditMode,
    rowHeightCache,
    expandDisabled,
    rowExtraClick,
    rowExtraClickNeeded,
    rowExtraClickMenuTitle,
    getExpandIconDisableState,
    onRowClick,
    className,
    columns,
    shadow,
    border,
    index,
    row,
    closeWithOutsideClick,
    ...restProps
}) {
    const bodyScroll = useBodyScroll();
    const nestedElementPopupRef = useRef(null);

    const [openDetailed, setOpenDetailed] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const goToDetailed = useCallback(() => setOpenDetailed(true), []);
    const handleExpand = useCallback(() => setExpanded(true), []);

    const handleCardClick = useCallback((e) => onRowClick(e, index), [index, onRowClick]);

    const menuOptions = rowActionBar(row, index) || [];
    const propsForPopup = getPopupProps(row, index) || {};

    const customNestedElement = renderRowNestedChildren && renderRowNestedChildren(row, index, nestedElementPopupRef);

    const extraClickNeeded =
        typeof rowExtraClickNeeded === 'function' ? rowExtraClickNeeded(row, index) : rowExtraClickNeeded;

    const onExtraClick = useCallback(
        (e) => {
            stopEvent(e);
            extraClickNeeded && rowExtraClick && rowExtraClick(e, row.data, index, row);
        },
        [index, row, rowExtraClick, extraClickNeeded]
    );

    const isExpandIconDisabled = useMemo(
        () => (getExpandIconDisableState ? getExpandIconDisableState(row, index) : expandDisabled),
        [getExpandIconDisableState, expandDisabled, index, row]
    );

    useEffect(() => {
        if (virtualizedList) {
            rowHeightCache.clear(index);
            virtualizedList.recomputeRowHeights(index);
        }
    }, [virtualizedList, columns.length, isEditMode]);

    useEffect(() => {
        openDetailed || (isCustomScrollElement && !expanded) ? bodyScroll.lock() : bodyScroll.unlock();

        return () => bodyScroll.unlock();
    }, [openDetailed, isCustomScrollElement, expanded]);

    const handleCloseDetails = useCallback(
        (_, isBackdrop) => {
            isBackdrop ? closeWithOutsideClick && setOpenDetailed(false) : setOpenDetailed(false);
        },
        [closeWithOutsideClick]
    );

    const handleCloseExpand = useCallback(
        (_, isBackdrop) => {
            isBackdrop ? closeWithOutsideClick && setExpanded(false) : setExpanded(false);
        },
        [closeWithOutsideClick]
    );

    return (
        <div className={classnames('card-holder with-button', className)} onClick={handleCardClick} {...restProps}>
            <div className="card-container">
                {!hideMore && (
                    <div className="card-more-button-holder">
                        <CardMenu
                            menuOptions={[
                                {
                                    title: viewCardText,
                                    onClick: goToDetailed,
                                    icon: 'bc-icon-report',
                                    color: 'hero',
                                    border: menuOptions && !customNestedElement ? 'bottom' : 'none'
                                },
                                customNestedElement && {
                                    title: expandText,
                                    disabled: isExpandIconDisabled,
                                    onClick: handleExpand,
                                    icon: 'bc-icon-expand',
                                    color: 'hero',
                                    border: menuOptions.length && !extraClickNeeded ? 'bottom' : 'none'
                                },
                                extraClickNeeded && {
                                    title: rowExtraClickMenuTitle,
                                    onClick: onExtraClick,
                                    icon: 'bc-icon-expand',
                                    color: 'hero',
                                    border: menuOptions.length ? 'bottom' : 'none'
                                },
                                ...menuOptions
                            ]}
                        />
                    </div>
                )}
                <div
                    className={classnames('card-c-holder', {
                        shadow,
                        border
                    })}
                >
                    {columns.slice(0, columnLimit).map((col) => (
                        <Col key={col[columnKey]} col={col} index={index} row={row} />
                    ))}
                </div>
            </div>
            <MobilePopUp
                isOpened={openDetailed}
                leftActionClick={handleCloseDetails}
                onBackdropClick={handleCloseDetails}
                {...propsForPopup}
            >
                <div className="quick-view-holder">
                    {columns.map((col) => (
                        <Col key={col[columnKey]} col={col} index={index} row={row} />
                    ))}
                </div>
                {customNestedElement && (
                    <div className="expand-card-holder">
                        <Button
                            icon="bc-icon-expand"
                            flexibility="full-width"
                            onClick={() => setExpanded(true)}
                            disabled={isExpandIconDisabled}
                        >
                            {expandText}
                        </Button>
                    </div>
                )}
            </MobilePopUp>
            {customNestedElement && (
                <MobilePopUp
                    isOpened={expanded}
                    title={expandedText}
                    ref={nestedElementPopupRef}
                    leftAction={{ text: expandedCloseText }}
                    onBackdropClick={handleCloseExpand}
                    leftActionClick={handleCloseExpand}
                >
                    {customNestedElement(row, index, nestedElementPopupRef)}
                </MobilePopUp>
            )}
        </div>
    );
}

Card.propTypes = {
    /**
     * Close card details and expanded popups with outside click
     */
    closeWithOutsideClick: PropTypes.bool,
    /**
     * Has component shadow or no
     */
    shadow: PropTypes.bool,
    /**
     * Has component border or no
     */
    border: PropTypes.bool,
    /**
     * Index of row
     */
    index: PropTypes.number,
    /**
     * Additional classname
     */
    className: PropTypes.string,
    /**
     * data: rows column's data
     * className: additional className for row element
     * render: Render custom component on (row: PropTypes.rows[item] index: number) => {
     *  return <div>Hello World</div>})
     */
    row: PropTypes.shape({
        data: PropTypes.object,
        className: PropTypes.string,
        render: PropTypes.func
    }),
    /**
     * sortFn: Custom sort function for columns.((prev: PropTypes.rows[item], next: PropTypes.rows[item], rows: PropTypes.rows, dataKey: string) => {
     *   if (prev is less than next by some ordering criterion) {
     *      return -1;
     *   }
     *    if (prev is greater than next by the ordering criterion) {
     *      return 1;
     *    }
     *    prev is equal to next
     *   return 0;
     *  }
     * })
     *
     * text: Text value for columns
     *
     * render: Function to render custom text.((column: PropTypes.columns[item], index: number, isEditActive: boolean) =>  return any)
     *
     * sortable: Allows sorting if true
     *
     * resizable: Allows resizing if true
     *
     * current column's data key
     *
     * draggable: Allows dragging if true
     *
     * colRenderer: Render custom component on certain column of each row. ((value: string || number, index: number, row: PropTypes.rows[item], isEditActive: boolean) => {
     *  return <div>Hello World</div>})
     *
     * getter: Function to define custom text. ((row: PropTypes.rows[item], index: number, isEditActive: boolean)) => {
     *  return some string
     * })
     *
     * formatter: Function tp format displaying text. ((middleText: string, row: PropTypes.rows[item], index: number, isEditActive: boolean) => {
     *  return some string
     * })
     *
     */
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            sortFn: PropTypes.func,
            ...oneIsRequired({
                text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
                render: PropTypes.func
            }),
            sortable: PropTypes.bool,
            resizable: PropTypes.bool,
            dataKey: PropTypes.string,
            draggable: PropTypes.bool,
            colRenderer: PropTypes.func,
            getter: PropTypes.func,
            formatter: PropTypes.func,
            hide: PropTypes.bool
        })
    ).isRequired,
    /**
     * Number of columns that will be shown
     */
    columnLimit: PropTypes.number,
    /**
     * Function which will return Array of objects as row's action bar on the right corner of the row. ((row: PropTypes.rows[item] ,index: number) => [])
     */
    rowActionBar: PropTypes.func,
    /**
     * Function which will return props for mobile popup. ((row: PropTypes.rows[item] ,index: number) => {})
     */
    getPopupProps: PropTypes.func,
    /**
     * Fires event when clicked on row
     * (event: SyntheticEvent, index: number) => void
     */
    onRowClick: PropTypes.func,
    /**
     * Text for View Card
     */
    viewCardText: PropTypes.string,
    /**
     * Text for Expand
     */
    expandText: PropTypes.string,
    /**
     * Text for Cancel
     */
    cancelText: PropTypes.string,
    /**
     * Text for Expanded popup close button
     */
    expandedCloseText: PropTypes.string,
    /**
     * Text for Expanded popup title
     */
    expandedText: PropTypes.string,
    /**
     * Function which should return null or another
     * Function which will return valid node
     */
    renderRowNestedChildren: PropTypes.func,
    /**
     * Extra click function for rows. ((e: event object, data: object, index: number, row: PropTypes.rows[item]) => custom logic)
     */
    rowExtraClick: PropTypes.func,
    /**
     * Expand button disabled state
     */
    expandDisabled: PropTypes.bool,
    /**
     * Is card in edit mode
     */
    isEditMode: PropTypes.bool,
    /**
     * Hide show more button
     */
    hideMore: PropTypes.bool,
    /**
     * Function for determining which rows should have extra click. ((e: event object, data: object, index: number, row: PropTypes.rows[item]) => return true or false)
     */
    rowExtraClickNeeded: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    /**
     * Title for rowExtraClick menu item
     */
    rowExtraClickMenuTitle: PropTypes.string
};

Card.defaultProps = {
    rowActionBar: noop,
    getPopupProps: noop,
    onRowClick: noop,
    rowExtraClickNeeded: noop,
    viewCardText: 'View Card',
    expandText: 'Expand',
    cancelText: 'Cancel',
    expandedText: 'Expanded',
    expandedCloseText: 'Close'
};

export default React.memo(Card);
