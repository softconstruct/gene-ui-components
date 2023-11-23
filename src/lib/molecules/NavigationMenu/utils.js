const getTitle = (id, data) => {
    if (data) {
        const matchedDatum = data.find((datum) => datum.id === id);

        return matchedDatum && matchedDatum.title
            ? matchedDatum.title
            : data.map((datum) => getTitle(id, datum.data)).filter(Boolean)[0];
    }
};

export const getTitlesArray = (ids, data) => ids.map((id) => getTitle(id, data)).filter(Boolean);

export const navigationOptionsToMenuMenu = (navigationOptions, optionId) =>
    navigationOptions.map(({ data, ...rest }) => ({
            ...rest,
            active: optionId?.toString() === rest.id.toString(),
            ...(data ? { children: navigationOptionsToMenuMenu(data, optionId) } : {})
        }));

export const indexStackFromItems = (stack, items, selectedItemId) => {
    if (!items?.length) {
        return [];
    }

    for (const itemIndex in items) {
        const item = items[itemIndex];
        if (item.id === selectedItemId) {
            return stack;
        }

        if (item.children) {
            const currentIndexStack = indexStackFromItems([...stack, Number(itemIndex)], item.children, selectedItemId);
            if (currentIndexStack.length) {
                return currentIndexStack;
            }
        }
    }
    return [];
};
