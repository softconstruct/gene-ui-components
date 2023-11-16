export const getOffsetValuesAndSubscriptions = (
    state,
    index,
    updatedState,
    offsetLeft = 0,
    offSetRight = 0,
    subscribe,
    container,
    eventName
) => {
    const offset = Object.keys(updatedState)
        .map(Number)
        .reduce(
            (offsetCalc, item) => {
                if (index > item) {
                    offsetCalc.left += updatedState[item].target.clientWidth;
                } else if (index < item) {
                    offsetCalc.right += updatedState[item].target.clientWidth;
                }
                return offsetCalc;
            },
            {
                left: offsetLeft,
                right: offSetRight
            }
        );

    const subscriptions = subscribe(
        container,
        {
            left: updatedState[index].left,
            right: updatedState[index].right
        },
        eventName,
        { index, offset }
    );

    return {
        ...state,
        [index]: {
            ...updatedState[index],
            offset,
            subscriptions
        }
    };
};

export default getOffsetValuesAndSubscriptions;
