import React, { useMemo, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';

// Components
import Icon from '../../../atoms/Icon';
import Empty from '../../../atoms/Empty';
import Search from '../../../molecules/Search';
import CustomScrollbar from '../../../atoms/Scrollbar';

// Local components
import TransferListItem from './Item';
import TransferListButtons from './Buttons';
import TransferListElements from '../Element';

// Styles
import './index.scss';

function TransferListContainer({
    data,
    isEditable,
    messages,
    onTransmit,
    containerId,
    isDragActive,
    onElementSelect,
    selectedElements,
    onSelectAllElements,
    transmissionButtons,
    selectedElementsLength
}) {
    const [searchText, setSearchText] = useState('');

    const filteredData = useMemo(() => {
        const elements = [];
        data.forEach((element, index) => {
            if (element.title.toLowerCase().includes(searchText)) {
                elements.push({ ...element, index });
            }
        });
        return elements;
    }, [data, searchText]);

    const selectableElements = useMemo(() => filteredData.filter(({ disabled }) => !disabled), [filteredData]);

    const isAllSelected = useMemo(() => {
        const selectableElements = filteredData.filter(({ disabled }) => !disabled);
        const filteredSelectedElements = selectableElements.filter(({ index }) => selectedElements.includes(index));

        return (
            !!selectableElements.length &&
            selectableElements.length === filteredSelectedElements.length &&
            selectedElements.length === filteredSelectedElements.length
        );
    }, [selectedElements, filteredData]);

    const handleSelectAll = () => onSelectAllElements(containerId, isAllSelected);
    const handleElementClick = (index) => onElementSelect(containerId, index);

    const handleSearchChange = (event) => {
        setSearchText(event.target.value.toLowerCase());
    };

    return (
        <>
            <Droppable
                key={containerId}
                droppableId={containerId}
                isDropDisabled={isEditable}
                children={({ innerRef, placeholder, droppableProps }, { isDraggingOver }) => (
                    <ul
                        className={classnames('bc-transfer-container', {
                            isDraggingOver,
                            isDragActive
                        })}
                    >
                        <li className="bc-tl-head">
                            <h5>{messages && messages.titles ? messages.titles[containerId] : containerId}</h5>
                            <span>
                                {messages && messages.countTitle && messages.countTitle[containerId]} (
                                {selectedElements.length}/{data.length})
                            </span>
                        </li>
                        <li className="bc-tl-search">
                            <Search inputSize="big" disabled={!data.length} onChange={handleSearchChange} />
                        </li>
                        <li className="bc-tl-content-holder">
                            <CustomScrollbar>
                                <div ref={innerRef} {...droppableProps} className="bc-tl-content">
                                    {filteredData.length ? (
                                        <>
                                            {!isEditable && (
                                                <TransferListElements
                                                    minimalistic
                                                    label="Select All"
                                                    checked={isAllSelected}
                                                    onClick={handleSelectAll}
                                                    disabled={!selectableElements.length}
                                                    indeterminate={!isAllSelected && !!selectedElements.length}
                                                />
                                            )}
                                            {filteredData.map((element) => (
                                                <TransferListItem
                                                    key={element.id}
                                                    element={element}
                                                    readOnly={isEditable}
                                                    index={element.index}
                                                    isDragActive={isDragActive}
                                                    onClick={handleElementClick}
                                                    selectedElementsLength={selectedElementsLength}
                                                    selected={selectedElements.includes(element.index)}
                                                    multiSelectText={messages.multiSelectText}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        <div className="bc-tl-placeholder pointer-events-none">
                                            {isDraggingOver ? (
                                                <div className="bc-tl-drop-here">
                                                    <Icon type="bc-icon-drag-here" />
                                                    <p>{messages.dropHere}</p>
                                                </div>
                                            ) : (
                                                <Empty
                                                    size="medium"
                                                    type="data"
                                                    appearance="greyscale"
                                                    title={messages.empty}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {placeholder}
                            </CustomScrollbar>
                        </li>
                    </ul>
                )}
            />
            {transmissionButtons && (
                <TransferListButtons readOnly={isEditable} onTransmit={onTransmit} {...transmissionButtons} />
            )}
        </>
    );
}

export default TransferListContainer;
