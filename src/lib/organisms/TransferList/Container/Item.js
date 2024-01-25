import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

// Local components
import TransferListElement from '../Element';

function TransferListItem({
    index,
    element,
    onClick,
    selected,
    readOnly,
    isDragActive,
    multiSelectText,
    selectedElementsLength
}) {
    const isDisabled = readOnly || element.disabled;
    const handleClick = (event) => !isDisabled && onClick(index, event);

    return (
        <Draggable isDragDisabled={isDisabled} draggableId={element.id} index={index}>
            {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
                <div
                    ref={innerRef}
                    {...draggableProps}
                    {...dragHandleProps}
                    onClick={handleClick}
                    className="bc-tl-item"
                >
                    <TransferListElement
                        label={
                            isDragging && selectedElementsLength > 1
                                ? `${selectedElementsLength} ${multiSelectText}`
                                : element.title
                        }
                        checked={selected}
                        readOnly={readOnly}
                        dragged={isDragging}
                        disabled={element.disabled || (selected && isDragActive && !isDragging)}
                    />
                </div>
            )}
        </Draggable>
    );
}

export default TransferListItem;
