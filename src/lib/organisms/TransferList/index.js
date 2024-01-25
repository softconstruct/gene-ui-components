import React, { useMemo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import classnames from 'classnames';

// Helpers
import { noop } from 'utils';
import { useDidMount } from 'hooks';
import {
    addOrRemove,
    unionIndexes,
    moveElement,
    reorderElement,
    multiMoveElement,
    selectedInitialState
} from './utils';
import { DEFAULT_TRANSLATE_MESSAGE, DEFAULT_DATA_ERROR_MESSAGE } from './constants';

// Local components
import TransferListContainer from './Container';

// Styles
import './index.scss';

function TransferList({ onChange, className, isEditable, defaultData, translateMessages, ...props }) {
    if (!(defaultData && Object.keys(defaultData).length)) {
        console.error(DEFAULT_DATA_ERROR_MESSAGE);
        return null;
    }

    const [isDragActive, setIsDragActive] = useState(false);
    const [containers, setContainers] = useState(defaultData);
    const [selectedElements, setSelectedElements] = useState(selectedInitialState(defaultData));

    useEffect(() => {
        setContainers(defaultData);
        setSelectedElements(selectedInitialState(defaultData));
    }, [defaultData, isEditable]);

    const messages = useMemo(
        () => ({
            ...DEFAULT_TRANSLATE_MESSAGE,
            ...translateMessages
        }),
        [translateMessages]
    );

    const containersEntries = useMemo(() => Object.entries(containers), [containers]);
    const selectedElementsLength = useMemo(
        () =>
            selectedElements &&
            Object.values(selectedElements).reduce((length, data) => {
                length += data.length;
                return length;
            }, 0),
        [selectedElements]
    );

    useDidMount(() => {
        onChange(containers);
    }, [onChange, containers]);

    function handleDragStart() {
        setIsDragActive(true);
    }

    function handleDragEnd({ destination, source }) {
        if (destination && source) {
            if (selectedElementsLength) {
                setContainers((containers) =>
                    multiMoveElement({
                        containers,
                        destination,
                        selectedElements: {
                            ...selectedElements,
                            [source.droppableId]: unionIndexes([...selectedElements[source.droppableId], source.index])
                        }
                    })
                );
            } else if (destination.droppableId === source.droppableId) {
                setContainers((prev) => ({
                    ...prev,
                    [source.droppableId]: reorderElement(prev[source.droppableId], source.index, destination.index)
                }));
            } else {
                setContainers((prev) => moveElement(prev, source, destination));
            }
            setSelectedElements(selectedInitialState(containers));
        }
        setIsDragActive(false);
    }

    const handleElementSelect = useCallback((source, index) => {
        setSelectedElements((prev) => ({
            ...prev,
            [source]: addOrRemove(prev[source], index)
        }));
    }, []);

    const handleSelectAllElements = useCallback(
        (containerId, isUnselect) => {
            let indexes = [];
            if (!isUnselect) {
                indexes = containers[containerId]
                    .map(({ disabled }, index) => !disabled && index)
                    .filter((index) => typeof index === 'number');
            }
            setSelectedElements((prev) => ({
                ...prev,
                [containerId]: indexes
            }));
        },
        [containers]
    );

    const transmissionButtons = useCallback(
        (index) => {
            const prev = containersEntries[index]?.[0];
            const next = containersEntries[index + 1]?.[0];

            if (prev && next) {
                return {
                    send: {
                        id: next,
                        disabled: !selectedElements[prev].length,
                        title: `${messages.moveTo} ${messages.titles[next]}`
                    },
                    receive: {
                        id: prev,
                        disabled: !selectedElements[next].length,
                        title: `${messages.moveTo} ${messages.titles[prev]}`
                    }
                };
            }
        },
        [messages, containersEntries, selectedElements]
    );

    const handleTransmit = useCallback(
        (ofContainer, toConteiner) => {
            setContainers((prev) =>
                multiMoveElement({
                    containers: prev,
                    selectedElements: {
                        [ofContainer]: selectedElements[ofContainer]
                    },
                    destination: { index: 0, droppableId: toConteiner }
                })
            );
            setSelectedElements((prev) => ({
                ...prev,
                [toConteiner]: prev[toConteiner].map((i) => i + prev[ofContainer].length),
                [ofContainer]: []
            }));
        },
        [selectedElements]
    );

    return (
        <div className={classnames('bc-transfer-list', className)}>
            <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                {containersEntries.map(([id, data], index) => (
                    <TransferListContainer
                        key={id}
                        data={data}
                        containerId={id}
                        messages={messages}
                        isEditable={isEditable}
                        onTransmit={handleTransmit}
                        isDragActive={isDragActive}
                        onElementSelect={handleElementSelect}
                        selectedElements={selectedElements[id]}
                        onSelectAllElements={handleSelectAllElements}
                        selectedElementsLength={selectedElementsLength}
                        transmissionButtons={transmissionButtons(index)}
                    />
                ))}
            </DragDropContext>
        </div>
    );
}

TransferList.propTypes = {
    /**
     * DefaultData there should be objects with different keys names, inside which there should be container data
     * { taskts: [], toDo: [{ id: 1, name: "Element 1", disabled: false }] }
     */
    defaultData: PropTypes.object.isRequired,
    /**
     * onChange listen to the change in the container and return you the new object
     */
    onChange: PropTypes.func,
    /**
     * Using translateMessages prop you can add/change the text title of the containers, count subtitle, empty Text, etc.
     */
    translateMessages: PropTypes.shape({
        titles: PropTypes.object,
        countTitle: PropTypes.object,
        dropHere: PropTypes.string,
        empty: PropTypes.string
    }),
    /**
     * CSS classname to add on the outer container.
     */
    className: PropTypes.string,
    /**
     * When do you send: false
     * Hide Select All buttons / items checkboxes / disabled all drag and drop functionality
     */
    isEditable: PropTypes.bool
};

TransferList.defaultProps = {
    onChange: noop
};

export default TransferList;
