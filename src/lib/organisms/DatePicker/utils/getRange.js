function getRange(rangeStart, rangeEnd, selected) {
    return !rangeStart || rangeEnd
        ? [selected, null]
        : selected.isBefore(rangeStart)
        ? [selected, rangeStart]
        : [rangeStart, selected];
}

export default getRange;
