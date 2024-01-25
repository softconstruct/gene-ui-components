import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { noop } from 'utils';
import { useThrottle } from 'hooks';
import { WithHeader, WithTitle, PaperWrapper } from '../utils';
import { useSortConfigs, sortHandler } from '../../Table/utils';

// Components
import Button from '../../../atoms/Button';
import Divider from '../../../atoms/Divider';
import Tooltip from '../../../molecules/Tooltip';

// Local components
import Export from '../Export';
import PaginationTable from '../Pagination';
function ComboTable({
    rows,
    name,
    onEdit,
    columns,
    sortType,
    columnKey,
    className,
    withSearch,
    paperProps,
    isEditable,
    withExport,
    sortedColumn,
    titleActions,
    onSortChange,
    checkAllText,
    isSaveActive,
    editActiveOutside,
    onSaveChanges,
    headerActions,
    editButtonText,
    onRefreshClick,
    sortableColumns,
    defaultSortType,
    editApprovalText,
    showRefreshButton,
    editRejectionText,
    leftHeaderActions,
    hideSearchDropdown,
    getDataForExport,
    exportButtonText,
    exportedFileName,
    defaultSortedColumn,
    exportOptions,
    exportButtonTooltipText,
    csvIconTooltipText,
    xlsIconTooltipText,
    refreshButtonTooltipText,
    ...tableProps
}) {
    const isSortControlled = 'handleColumnSorting' in tableProps;
    const { handleColumnSorting } = tableProps;

    const [sortObject, setSortObject] = useState({
        id: defaultSortedColumn || null,
        type: defaultSortType || null,
        index: null
    });
    const [isEditActive, setIsEditActive] = useState(false);
    const [searchParams, setSearchParams] = useState(() => ({
        query: '',
        dataKeys: columns.map((column) => column.dataKey)
    }));
    const onEditClick = useCallback(
        (e) => {
            setIsEditActive((value) => !value);
            onEdit && onEdit(e);
        },
        [onEdit]
    );

    useEffect(() => {
        editActiveOutside && setIsEditActive(editActiveOutside);
        return () => undefined;
    }, [editActiveOutside]);

    const onControlChanges = useCallback(
        (saveChanges) => {
            setIsEditActive(false);
            onSaveChanges(saveChanges);
        },
        [onSaveChanges]
    );

    const handleSearch = useCallback(({ query, dataKeys }) => {
        setSearchParams({ query, dataKeys });
    }, []);

    const changeSortColumn = useCallback(
        (nextSortObject) => {
            sortHandler(nextSortObject, setSortObject, onSortChange, sortableColumns, sortObject);
        },
        [onSortChange, sortableColumns, sortObject]
    );

    const changeSortColumnThrottled = useThrottle(isSortControlled ? handleColumnSorting : changeSortColumn, 200);

    const sortConfig = useSortConfigs(sortObject, columns, rows, columnKey);
    const [type, dataKey, sortFn] = isSortControlled ? [sortType, sortedColumn] : sortConfig;

    const sortedRows = useMemo(
        () => (!isSortControlled ? (type === null ? rows : [...rows].sort(sortFn)) : rows),
        [rows, type, sortFn, isSortControlled]
    );

    const filteredRows = useMemo(() => {
        const { dataKeys, query } = searchParams;
        if (!query) return sortedRows;

        const lowerCaseQuery = query.toLocaleLowerCase();

        return sortedRows.filter(({ data }) =>
            dataKeys.some((key) => {
                const value = data[key];

                if (!value && value !== 0) return false;

                if (typeof value === 'number') return value.toString().includes(lowerCaseQuery);
                if (typeof value === 'string') return value.toLocaleLowerCase().includes(lowerCaseQuery);

                return false;
            })
        );
    }, [searchParams, sortedRows]);

    const editActions = useMemo(
        () =>
            isEditable && (
                <div className="edit-save-button-holder">
                    {isEditActive ? (
                        <>
                            <Button
                                appearance="minimal"
                                color="default"
                                onClick={() => onControlChanges(false)}
                                size="big"
                            >
                                {editRejectionText}
                            </Button>
                            <Button disabled={!isSaveActive} onClick={() => onControlChanges(true)} size="big">
                                {editApprovalText}
                            </Button>
                        </>
                    ) : (
                        <Button
                            icon="bc-icon-edit"
                            appearance="minimal"
                            disabled={!filteredRows.length}
                            onClick={onEditClick}
                            size="big"
                        >
                            {editButtonText}
                        </Button>
                    )}
                </div>
            ),
        [
            isEditable,
            isEditActive,
            editRejectionText,
            isSaveActive,
            editApprovalText,
            filteredRows.length,
            onEditClick,
            editButtonText,
            onControlChanges
        ]
    );

    const withHeaderActions = useMemo(
        () =>
            editActions || headerActions ? (
                <>
                    {editActions}
                    {headerActions}
                </>
            ) : null,
        [editActions, headerActions]
    );

    const exportedItems = useMemo(() => (withExport ? rows.map((item) => item.data) : []), [rows, withExport]);

    return (
        <PaperWrapper
            className={classnames({ 'table-loader-container': tableProps.loading }, className)}
            {...paperProps}
        >
            <WithTitle
                name={name}
                actions={
                    <>
                        {titleActions}
                        {withExport && (
                            <>
                                <Export
                                    fileName={exportedFileName || name}
                                    tableColumns={columns}
                                    isDisable={!exportedItems.length}
                                    options={exportOptions}
                                    exportButtonText={exportButtonText}
                                    exportButtonTooltipText={exportButtonTooltipText}
                                    csvIconTooltipText={csvIconTooltipText}
                                    xlsIconTooltipText={xlsIconTooltipText}
                                    getDataForExport={getDataForExport || (() => Promise.resolve(exportedItems))}
                                />
                                <Divider size={24} />
                            </>
                        )}
                        {showRefreshButton && (
                            <Tooltip title={refreshButtonTooltipText}>
                                <Button icon="bc-icon-reset" appearance="minimal" size="big" onClick={onRefreshClick} />
                            </Tooltip>
                        )}
                    </>
                }
            >
                <WithHeader
                    withSearch={withSearch}
                    hideSearchDropdown={hideSearchDropdown}
                    handleSearch={handleSearch}
                    dropDownData={columns}
                    checkAllText={checkAllText}
                    leftHeaderActions={leftHeaderActions}
                    actions={withHeaderActions}
                >
                    <PaginationTable
                        {...tableProps}
                        isEditActive={isEditActive}
                        columns={columns}
                        searchQuery={searchParams.query}
                        rows={filteredRows}
                        handleColumnSorting={changeSortColumnThrottled}
                        sortableColumns={sortableColumns}
                        sortType={type}
                        sortedColumn={dataKey}
                        columnKey={columnKey}
                    />
                </WithHeader>
            </WithTitle>
        </PaperWrapper>
    );
}

ComboTable.propTypes = {
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
     * Enables export dropdown on the top right corner of the table
     */
    withExport: PropTypes.bool,
    /**
     * Disable Save button if false
     */
    isSaveActive: PropTypes.bool,
    /**
     * Enable Edit mode from outside
     */
    editActiveOutside: PropTypes.bool,
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
     * Initial sort state
     */
    defaultSortType: PropTypes.oneOf(['asc', 'desc']),
    /**
     * Initially sorted column
     */
    defaultSortedColumn: PropTypes.string,
    /**
     * Exporting file name
     */
    exportedFileName: PropTypes.string,
    /**
     * Text for refresh button tooltip
     */
    refreshButtonTooltipText: PropTypes.string,
    /**
     * Customize pagination selectors' label text
     * (currentValue: Number, totalCount: Number) => void
     */
    fabricateSelectorLabel: PropTypes.func,
    /**
     * getDataForExport: (type: string) => array || object
     * with the help of these functions you can modify the exported data in two ways
     * first sending objects array, keys which coincide with the key in the columns
     * return [{...}, {...}, ...]
     * or you can send the object in  columns, data and name if you want
     * (but don't forget, there's still exportedFileName, so if you add name to exportedFileName will be useless and will not be used)
     * return { columns: [{...}, ...], data: [{...}, ...], name: 'file name' }
     */
    getDataForExport: PropTypes.func,
    ...PaginationTable.propTypes
};

ComboTable.defaultProps = {
    onSaveChanges: noop,
    editButtonText: 'Edit',
    editApprovalText: 'Save',
    editRejectionText: 'Cancel',
    onRefreshClick: noop,
    showRefreshButton: false,
    isSaveActive: true,
    onSortChange: noop,
    columnKey: 'dataKey',
    defaultSortType: null,
    defaultSortedColumn: null,
    refreshButtonTooltipText: 'Refresh'
};

export default ComboTable;
