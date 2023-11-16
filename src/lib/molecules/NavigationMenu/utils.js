const getTitle = (id, data) => {
    if (data) {
        const matchedDatum = data.find((datum) => datum.id === id);

        return matchedDatum && matchedDatum.title
            ? matchedDatum.title
            : data.map((datum) => getTitle(id, datum.data)).filter(Boolean)[0];
    }
};

export const getTitlesArray = (ids, data) => ids.map((id) => getTitle(id, data)).filter(Boolean);

export const navigationOptionsToMenuMenu = (navigationOptions) =>
    navigationOptions.map(({ data, ...rest }) => ({
        ...rest,
        ...(data ? { children: navigationOptionsToMenuMenu(data) } : {})
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
