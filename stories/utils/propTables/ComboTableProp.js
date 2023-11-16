import React from 'react';
import PropTypes from 'prop-types';
import PaginationTable from '../../../src/lib/organisms/TableCompositions/Pagination';

const ComboTableProp = (props) => <div></div>;

ComboTableProp.propTypes = {
    /*
     * Fires event when edit button is clicked,
     * (event: Event) => void
     */
    onEdit: PropTypes.func,
    /**
     * Fires event when clicked on `Save` or `Cancel` buttons
     * (save: Boolean) => void
     */
    onSaveChanges: PropTypes.func,
    /**
     * Enables searchbar with dropdown on top left corner under the title of the table
     */
    withSearch: PropTypes.bool,
    /**
     * Any valid React node,
     * Displays on the right corner of the table's title
     */
    titleActions: PropTypes.node,
    /**
     * Any valid React node,
     * Displays on the right top corner above table's title
     */
    headerActions: PropTypes.node,
    /**
     * Displays refresh button and handles click event,
     * (event: Event) => void
     */
    onRefreshClick: PropTypes.func,
    /**
     * Custom text for edit button
     */
    editButtonText: PropTypes.string,
    /**
     * Table's name
     */
    name: PropTypes.node.isRequired,
    /**
     * Custom text for approving button in edit mode
     */
    editApprovalText: PropTypes.string,
    /**
     * Custom text for rejecting button in edit mode
     */
    editRejectionText: PropTypes.string,
    /**
     * additional className which will apply to table loader container
     */
    className: PropTypes.string,
    /**
     * Hides dropdown on search if true
     */
    hideSearchDropdown: PropTypes.bool,
    /**
     * Displays refresh button on top right corner
     */
    showRefreshButton: PropTypes.bool,
    /**
     * Page number that must be opened by default
     */
    defaultOpenedPage: PropTypes.number,
    /**
     * Rows total count
     */
    rowsCount: PropTypes.number,
    /**
     * Data for selector dropdown
     */
    selectorData: PropTypes.array,
    /**
     * Define pagination will be shown or no.
     */
    withPagination: PropTypes.bool,
    /**
     * Define page selector will be shown or no.
     */
    withPageSelector: PropTypes.bool,
    /**
     * Default value for selector dropdown
     */
    selectorDefaultValue: PropTypes.number,
    /**
     * Value for selector dropdown
     */
    selectorValue: PropTypes.number
};

ComboTableProp.defaultProps = {
    onSaveChanges: () => {},
    editButtonText: 'Edit',
    editApprovalText: 'Save',
    editRejectionText: 'Cancel',
    onRefreshClick: () => {},
    showRefreshButton: false,
    withPageSelector: false,
    withPagination: true,
    rows: [],
    defaultOpenedPage: 1,
    onPaginationChange: () => {},
    selectorData: [],
    onSelectorChange: () => {}
};

export default ComboTableProp;
