export const findDeep = (data, indexStack, index = 0) =>
    index < indexStack.length ? findDeep(data[indexStack[index]].children, indexStack, index + 1) : data;
