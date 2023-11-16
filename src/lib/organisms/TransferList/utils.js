import produce from 'immer';

export const reorderElement = (container, startIndex, endIndex) =>
    produce(container, (draft) => {
        const [removed] = draft.splice(startIndex, 1);
        draft.splice(endIndex, 0, removed);
    });

export const moveElement = (containers, source, destination) =>
    produce(containers, (draft) => {
        const [removed] = draft[source.droppableId].splice(source.index, 1);
        draft[destination.droppableId].splice(destination.index, 0, removed);
    });

export const multiMoveElement = ({ containers, selectedElements, destination }) =>
    produce(containers, (draft) => {
        let removed = [];
        Object.entries(selectedElements).forEach(([source, elements]) => {
            removed = [...removed, ...draft[source].filter((_, index) => elements.includes(index))];
            draft[source] = draft[source].filter((_, index) => !elements.includes(index));
        });

        draft[destination.droppableId].splice(destination.index, 0, ...removed);
    });

export const selectedInitialState = (containers) => {
    const data = {};
    Object.keys(containers).forEach((key) => {
        data[key] = [];
    });
    return data;
};

export const unionIndexes = (arr) => Array.from(new Set(arr));

export const addOrRemove = (data, value) =>
    produce(data, (draft) => {
        const index = draft.indexOf(value);

        if (index === -1) {
            draft.push(value);
        } else {
            draft.splice(index, 1);
        }
    });
