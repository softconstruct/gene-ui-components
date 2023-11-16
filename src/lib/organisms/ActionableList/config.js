// @TODO think about internalization give possibilities to
// pass tooltip texts via props refactor code duplications
export const searchMethods = {
    like: {
        value: 'like',
        tooltipText:
            'Your typed text will be applied to the last level of the data and will use the "like search" algorithm.'
    },
    startsWith: {
        value: 'startsWith',
        tooltipText:
            'Your typed text will be applied to the last level of the data and will use the "starts with search" algorithm.'
    },
    endsWith: {
        value: 'endsWith',
        tooltipText:
            'Your typed text will be applied to the last level of the data and will use the "ends with search" algorithm.'
    }
};

export const searchFunctions = {
    [searchMethods.like.value]: (label, searchKey) => `${label}`.toLowerCase().includes(searchKey.toLowerCase()),
    [searchMethods.startsWith.value]: (label, searchKey) => label.toLowerCase().startsWith(searchKey.toLowerCase()),
    [searchMethods.endsWith.value]: (label, searchKey) => label.toLowerCase().endsWith(searchKey.toLowerCase())
};
