import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';

// Helpers
import { noop } from 'utils';

// Local components
import RowContent from './RowContent';

// Styles
import './index.scss';

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    // padding: grid * 2,
    margin: `0 0 1.5rem 0`,

    // change background colour if dragging
    // background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

function Row(props) {
    const {
        label,
        id,
        isChecked,
        isVisible,
        isPermanent,
        positionIndex,
        parentId,
        childrenList,
        isOpen,
        isDraggable,
        isSelectable,
        onRowSelectHandler,
        ...restProps
    } = props;

    const [isOpened, setIsOpened] = useState(isOpen);

    const hasChildren = useMemo(() => childrenList.length > 0, [childrenList]);

    const onRowToggleHandler = useCallback(() => {
        setIsOpened(!isOpened);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpened]);

    useEffect(() => {
        setIsOpened(isOpen);
    }, [isOpen]);

    const onRowSelectHandlerWrapper = (checked) => {
        onRowSelectHandler(props, checked);
    };

    return (
        isVisible && (
            <Draggable draggableId={id} index={positionIndex} isDragDisabled={!isDraggable || isOpened}>
                {(provided, snapshot) => (
                    <div
                        className="gene-actionable-list-row"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot?.isDragging, provided?.draggableProps.style)}
                    >
                        <RowContent
                            hasChildren={hasChildren}
                            label={label}
                            isChecked={isChecked}
                            isPermanent={isPermanent}
                            isOpened={isOpened}
                            onArrowBtnClick={onRowToggleHandler}
                            onCheckboxClick={onRowSelectHandlerWrapper}
                            isDraggable={isDraggable}
                            isSelectable={isSelectable}
                            {...restProps}
                        />

                        {isOpened && (
                            <Droppable droppableId={`droppable_cnt_${id}`} type={`droppable_cnt_${id}`}>
                                {(provided, snapshot, rubric) => (
                                    <div
                                        className="gene-actionable-list-row-children"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {childrenList.map((row, index) => (
                                            <Row
                                                {...row}
                                                key={row.id}
                                                isDraggable={isDraggable}
                                                isSelectable={isSelectable}
                                                onRowSelectHandler={onRowSelectHandler}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )}
                    </div>
                )}
            </Draggable>
        )
    );
}

Row.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    isChecked: PropTypes.oneOf([true, false, null]),
    isVisible: PropTypes.bool,
    isPermanent: PropTypes.bool,
    positionIndex: PropTypes.number,
    parentId: PropTypes.string,
    childrenList: PropTypes.array,
    isOpen: PropTypes.bool,
    isDraggable: PropTypes.bool,
    isSelectable: PropTypes.bool,
    onRowSelectHandler: PropTypes.func
};

Row.defaultProps = {
    isChecked: false,
    isVisible: true,
    isPermanent: false,
    childrenList: [],
    isOpen: false,
    tooltipInfo: '',
    onRowSelectHandler: noop
};

Row.displayName = 'Row';

export default Row;
