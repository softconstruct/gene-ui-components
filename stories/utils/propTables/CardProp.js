import React from 'react';
import PropTypes from 'prop-types';

const CardProp = (props) => <div></div>;

CardProp.propTypes = {
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
            text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            render: PropTypes.func,
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
    renderRowNestedChildren: PropTypes.func
};

CardProp.defaultProps = {
    rowActionBar: () => {},
    getPopupProps: () => {},
    onRowClick: () => {},
    viewCardText: 'View Card',
    expandText: 'Expand',
    cancelText: 'Cancel',
    expandedText: 'Expanded',
    expandedCloseText: 'Close'
};

export default CardProp;
