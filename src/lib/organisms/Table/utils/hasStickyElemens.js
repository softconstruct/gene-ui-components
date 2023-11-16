const hasStickyElements = (columnsObject) => {
    const keys = Object.keys(columnsObject);
    const stickyLeftExist = keys.some((column) => columnsObject[column].isStickyLeft);
    const stickyRightExist = keys.some((column) => columnsObject[column].isStickyRight);

    return {
        stickyLeftExist,
        stickyRightExist
    };
};

export default hasStickyElements;
