// @TODO review code from start to end and check logic mental model
import React, { forwardRef, useState, useImperativeHandle, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';

// Helpers
import { noop } from 'utils';
import { searchMethods, searchFunctions } from './config';

// Components
import Icon from '../../atoms/Icon';
import Empty from '../../atoms/Empty';
import BusyLoader from '../../atoms/BusyLoader';
import Scrollbar from '../../atoms/Scrollbar';
import Checkbox from '../../molecules/Checkbox';
import ExtendedInput from '../../molecules/ExtendedInput';
import Tooltip from '../../molecules/Tooltip';

// Local components
import Row from './Row';

// Styles
import './index.scss';

// @TODO move helper function to separated file and check code to avoid code duplications
const isNodeLeaf = (node = {}) => !node.hasOwnProperty('childrenList');
const isNodeVisible = ({ isVisible } = {}) => (isVisible !== undefined ? isVisible : true);

const mapDataListToInternalModel = (list = [], parentId = null) =>
    list.map((row, index) => {
        if (parentId !== null) {
            row.parentId = parentId;
            row.id = `${parentId}_${index}`;
        } else {
            row.id = `${index}`;
        }

        if (!isNodeLeaf(row)) {
            row.childNodesCount = row?.childrenList.length;
            row.selectedChildNodesCount = row?.childrenList.filter(({ isChecked }) => isChecked).length;
            mapDataListToInternalModel(row?.childrenList, row.id);
        }

        return row;
    });

const reorder = (list, path, startIndex, endIndex) => {
    if (path.length > 0) {
        const index = path.shift();
        return reorder(list[index]?.childrenList ?? list, path, startIndex, endIndex);
    }
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result.map((row, index) => {
        row.positionIndex = index;
        return row;
    });
};

const replaceList = (list, levelId, value) =>
    list.map((row) => {
        const isRowMatched = row.id === levelId.substring(0, levelId.length - 2);

        if (isRowMatched) {
            row.childrenList = value;
        }

        if (row?.childrenList?.length > 0 && !isRowMatched) {
            replaceList(row?.childrenList, levelId, value);
        }

        return row;
    });

const highlightTextBySearchKey = (text = '', searchKey = '', searchMethod) => {
    const result = text.replaceAll('<span className="highlight">', '').replaceAll('</span>', '');
    const index =
        searchMethod === searchMethods.endsWith.value ? result.lastIndexOf(searchKey) : result.indexOf(searchKey);

    return (
        <>
            {result.substring(0, index)}
            <span className="highlight">{result.substring(index, index + searchKey.length)}</span>
            {result.substring(index + searchKey.length)}
        </>
    );
};

// '0'
// '0_0'
// '0_0_0_1'
const walkToNode = (list, nodeIds, forceCloseAllRows = false, searchKey, withSearchHighlighting, searchMethod) =>
    list.map((row) => {
        let isRowMatched = false;

        for (let i = 0; i < nodeIds.length; i++) {
            const _row = nodeIds[i];
            isRowMatched = row.id === _row.id.substring(0, row.id.length);
            if (isRowMatched) break;
        }

        row.isVisible = isRowMatched;

        if (isRowMatched) {
            if (!isNodeLeaf(row)) {
                row.isOpen = !!forceCloseAllRows;
                walkToNode(
                    row.childrenList,
                    nodeIds,
                    forceCloseAllRows,
                    searchKey,
                    withSearchHighlighting,
                    searchMethod
                );
            } else if (withSearchHighlighting) {
                row.highlightedLabel = highlightTextBySearchKey(row.label, searchKey, searchMethod);
            }
        }

        return row;
    });

const findLeafNodes = (list, leafNodes = []) => {
    list.forEach((row) => {
        if (isNodeLeaf(row)) {
            leafNodes.push(row);
        } else {
            findLeafNodes(row.childrenList, leafNodes);
        }
    });

    return leafNodes;
};

const applySearchFilter = (list = [], searchKey, method) =>
    list.filter(({ label }) => searchFunctions[method](label, searchKey));

const searchHandler = (list, searchKey, method, withSearchHighlighting) => {
    const leafNodes = findLeafNodes(list);
    const matchedNodes = searchKey.trim() !== '' ? applySearchFilter(leafNodes, searchKey, method) : leafNodes;

    return {
        searchResult: walkToNode(list, matchedNodes, searchKey !== '', searchKey, withSearchHighlighting, method),
        matchedNodesCount: matchedNodes.length,
        isSearchEmpty: matchedNodes.length === 0
    };
};

// @TODO fix bugs in selection logic
const markAllNodes = (list = [], checked = false, selectedRow = null) =>
    list.map((row) => {
        if (!row.isPermanent && isNodeVisible(row)) {
            if (!isNodeLeaf(row)) {
                if (selectedRow !== null) {
                    selectedRow.selectedChildNodesCount = checked ? selectedRow.childNodesCount : 0;
                }

                row.selectedChildNodesCount = checked ? row.childNodesCount : 0;
                markAllNodes(row.childrenList, checked, row);
            }
        }

        return row;
    });

const d = (list = [], id, checked) => {
    const value = checked ? 1 : -1;

    return list.map((row) => {
        if (id.startsWith(row.id)) {
            if (!isNodeLeaf(row)) {
                row.selectedChildNodesCount +=
                    row.selectedChildNodesCount + value <= row.childNodesCount &&
                    row.selectedChildNodesCount - value >= row.childNodesCount
                        ? value
                        : 0;

                let parentRowCheckedStatus = false;

                if (row.selectedChildNodesCount > 0) {
                    parentRowCheckedStatus = null;

                    if (row.selectedChildNodesCount === row.childNodesCount) {
                        parentRowCheckedStatus = true;
                    }
                }

                row.isChecked = parentRowCheckedStatus;

                d(row.childrenList, id, checked);
            } else {
                row.isChecked = checked;
            }
        }

        return row;
    });
};

const selectHandler = (list, selectedRow, checked) =>
    list.map((row) => {
        const { id, isPermanent } = row;
        const isRowMatched = id === selectedRow.id;

        if (!isNodeLeaf(row)) {
            if (isRowMatched && !isPermanent && isNodeVisible(row)) {
                markAllNodes(row?.childrenList, checked, row);
            } else {
                selectHandler(row?.childrenList, selectedRow, checked);
            }
        }

        return row;
    });

const ActionableList = forwardRef(
    (
        {
            onChange,
            data,
            isLoading,
            withSortable,
            withSelection,
            withSearch,
            withSearchHighlighting,
            readOnly,
            searchPlaceholderText,
            emptyDataText,
            emptySearchText,
            titleText,
            selectionText,
            filteredNodesText,
            totalNodesText,
            loadingText,
            selectAllLabelText,
            searchMethod
        },
        ref
    ) => {
        const [searchInput, setSearchInput] = useState('');
        const searchInputTimeoutRef = useRef(null);
        const [dataList, setDataList] = useState([]);

        const leafNodes = useMemo(() => findLeafNodes(dataList), [dataList]);
        const [leafNodesCount, setLeafNodesCount] = useState('');
        const [selectedLeafNodesCount, setSelectedLeafNodesCount] = useState('');

        const hasDataList = useMemo(() => dataList.length > 0, [dataList]);

        const [isAllSelected, setIsAllSelected] = useState(false);

        const [isSearchEmpty, setIsSearchEmpty] = useState(null);

        // Provide reset search functional to parent component
        useImperativeHandle(ref, () => ({
            resetSearch() {
                setSearchInput('');
            }
        }));

        const searchInputHandler = ({ target }) => {
            setSearchInput(target?.value);
        };

        const onDragEnd = (result) => {
            // Dropped outside of the list
            if (!result.destination) {
                return;
            }
            // Discover the depth of dragged row
            const draggableIds = result.draggableId.split('_');
            const path = [...draggableIds];
            path.pop();

            setDataList((previousBlockItems) => {
                const reorderedList = reorder(previousBlockItems, path, result.source.index, result.destination.index);

                if (draggableIds.length === 1) {
                    const _data = mapDataListToInternalModel(reorderedList);
                    onChange(_data);
                    return _data;
                }
                const _data = mapDataListToInternalModel(
                    replaceList(previousBlockItems, result.draggableId, reorderedList)
                );
                onChange(_data);
                return _data;
            });
        };

        useEffect(() => {
            const _data = JSON.parse(JSON.stringify(data));
            setDataList(mapDataListToInternalModel(_data));
        }, [data]);

        useEffect(() => {
            if (hasDataList && leafNodesCount === '') {
                setLeafNodesCount(leafNodes.length);
            }

            setSelectedLeafNodesCount(
                leafNodes.filter(({ isChecked }) => (isChecked !== undefined ? isChecked : false)).length
            );
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [hasDataList, leafNodes]);

        useEffect(() => {
            if (!hasDataList) return;
            // debounce typing
            // filter array by label recursively via following search method
            // recursively find and open any parent row if exist set isOpen to true
            // set filtered values to dataList

            clearTimeout(searchInputTimeoutRef.current);

            searchInputTimeoutRef.current = setTimeout(() => {
                const { searchResult, isSearchEmpty, matchedNodesCount } = searchHandler(
                    dataList,
                    searchInput,
                    searchMethod,
                    withSearchHighlighting
                );
                setDataList(searchResult);
                setLeafNodesCount(matchedNodesCount);
                setIsSearchEmpty(isSearchEmpty);
            }, 500);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchInput]);

        const cleanup = () => () => {
            clearTimeout(searchInputTimeoutRef.current);
        };

        useEffect(() => cleanup, []);

        // create selection logic

        const handleCheckboxChange = (e) => {
            const { checked } = e.currentTarget ? e.currentTarget : e.current;
            const _data = markAllNodes(dataList, checked);
            setDataList(_data);
            // onChange(_data);
            setIsAllSelected(checked);
        };

        const onRowSelectHandler = (row, checked) => {
            const _data = selectHandler(dataList, row, checked);
            const a = d(_data, row.id, checked);
            // console.log('🚀 ~ file: TimePicker.tsx ~ line 366 ~ onRowSelectHandler ~ row.id', row.id);

            setDataList(a);
            onChange(a);
        };

        useEffect(() => {
            setIsAllSelected((prev) => {
                let value = false;

                if (prev !== true && selectedLeafNodesCount > 0) {
                    value = null;

                    if (leafNodes.length === selectedLeafNodesCount) {
                        value = true;
                    }
                }

                return value;
            });
        }, [leafNodes, selectedLeafNodesCount]);

        return (
            <div className="gene-actionable-list">
                <BusyLoader isBusy={isLoading} loadingText={loadingText}>
                    {hasDataList ? (
                        <>
                            <div className="gene-actionable-list-header">
                                <div className="gene-actionable-list-header-title">
                                    <h5>{titleText}</h5>
                                    <span>
                                        {withSelection && `${selectionText} ${selectedLeafNodesCount} | `}
                                        {withSearch && `${filteredNodesText} ${leafNodesCount} | `}
                                        {`${totalNodesText} ${leafNodes.length}`}
                                    </span>
                                </div>
                                {withSearch && (
                                    <div className="gene-actionable-list-header-search-box">
                                        <ExtendedInput
                                            placeholder={searchPlaceholderText}
                                            onChange={searchInputHandler}
                                            value={searchInput}
                                            icon="bc-icon-search"
                                        />
                                        <Tooltip position="left" text={searchMethods[searchMethod].tooltipText}>
                                            <Icon type="bc-icon-info" />
                                        </Tooltip>
                                    </div>
                                )}
                                {withSelection && leafNodesCount > 1 && (
                                    <Checkbox
                                        className="gene-actionable-list-header-mark-all"
                                        label={selectAllLabelText}
                                        checked={isAllSelected}
                                        onChange={handleCheckboxChange}
                                        indeterminate={isAllSelected === null}
                                    />
                                )}
                            </div>

                            <Scrollbar>
                                <div className="gene-actionable-list-body">
                                    {isSearchEmpty ? (
                                        <Empty appearance="greyscale" type="search" title={emptySearchText} />
                                    ) : (
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <Droppable droppableId="droppable_cnt" type="droppable_cnt">
                                                {(provided, snapshot, rubric) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                                        {dataList.map((row, index) => (
                                                            <Row
                                                                {...row}
                                                                key={row.id}
                                                                isDraggable={withSortable}
                                                                isSelectable={withSelection}
                                                                onRowSelectHandler={onRowSelectHandler}
                                                            />
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    )}
                                </div>
                            </Scrollbar>
                        </>
                    ) : (
                        <Empty appearance="greyscale" type="data" title={emptyDataText} />
                    )}
                </BusyLoader>
            </div>
        );
    }
);

// @TODO add comments for props
ActionableList.propTypes = {
    /**
     * Execute an callback on Reorder event with already reordered data
     */
    onChange: PropTypes.func, // @TODO map and remove component props for list objects and return cloned list back
    /**
     * Data list of objects. This list is dynamic and has listener inside of the component you can change the data list and its objects runtime
     */
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            id: PropTypes.string,
            isChecked: PropTypes.bool,
            isVisible: PropTypes.bool,
            isPermanent: PropTypes.bool,
            positionIndex: PropTypes.number,
            parentId: PropTypes.string,
            childrenList: PropTypes.array,
            isOpen: PropTypes.bool
        })
    ),
    /**
     * Represent loader state in case of true will be shown spinner and loading text
     */
    isLoading: PropTypes.bool,
    /**
     * Turn on search logic and show search input element on the top of component
     */
    withSearch: PropTypes.bool,
    /**
     * Turn on search highlighting function
     */
    withSearchHighlighting: PropTypes.bool,
    /**
     * Not supported yet will provided on next version
     */
    withSelection: PropTypes.bool,
    /**
     * Turn on drag and drop reordering function on multilevel scopes
     */
    withSortable: PropTypes.bool,
    /**
     * Not supported yet will provided on next version
     */
    readOnly: PropTypes.bool,
    /**
     * Placeholder text for search input to cover localization support
     */
    searchPlaceholderText: PropTypes.string,
    /**
     * Empty data text to cover localization support
     */
    emptyDataText: PropTypes.string,
    /**
     * Empty search result text to cover localization support
     */
    emptySearchText: PropTypes.string,
    /**
     * Title text to cover localization support
     */
    titleText: PropTypes.string,
    /**
     * Not supported yet will provided on next version
     */
    selectionText: PropTypes.string,
    /**
     * Filtered nodes count text to cover localization support
     */
    filteredNodesText: PropTypes.string,
    /**
     * Total leaf nodes count text to cover localization support
     */
    totalNodesText: PropTypes.string,
    /**
     * Text for loading state to cover localization support
     */
    loadingText: PropTypes.string,
    /**
     * Not supported yet will provided on next version
     */
    selectAllLabelText: PropTypes.string,
    /**
     * Search method can be one of [startsWith, endsWith, like]
     */
    searchMethod: PropTypes.oneOf(Object.keys(searchMethods))
};

ActionableList.defaultProps = {
    onChange: noop,
    data: [],
    isLoading: false,
    withSearch: false,
    withSearchHighlighting: false,
    withSelection: false,
    withSortable: false,
    readOnly: true,
    searchPlaceholderText: 'Search',
    emptyDataText: 'No data to display',
    emptySearchText: 'No data found',
    titleText: 'Actionable list',
    selectionText: 'Selected',
    filteredNodesText: 'Filtered',
    totalNodesText: 'Total',
    loadingText: 'Loading data',
    selectAllLabelText: 'Select all filtered items',
    searchMethod: searchMethods.like.value
};

ActionableList.displayName = 'ActionableList';

export default ActionableList;
