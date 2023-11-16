const sortHandler = (nextSortObject, setSortObject, onSortChange, sortableColumns, currentSortState) => {
    const { id, column, dataKey, index } = nextSortObject;
    const isSortable = typeof column.sortable === 'boolean' ? column.sortable : sortableColumns;
    const { id: currId, type: currType } = currentSortState;

    const type = id !== currId || !currType ? 'asc' : currType === 'asc' ? 'desc' : null;

    if (isSortable) {
        setSortObject({
            id,
            type,
            index
        });
        onSortChange(isSortable, id, index, dataKey, column, type);
    }
};

export default sortHandler;
