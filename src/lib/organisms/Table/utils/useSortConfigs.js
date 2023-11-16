import { useMemo, useCallback } from 'react';

const getValue = (value, formatter) => (formatter ? formatter(value) : value);

const useSortConfigs = (sortConfigs, columns, rows, columnKey) => {
    const { type, id } = sortConfigs;
    const isSortExists = type !== null;
    const column = columns.find((col) => col[columnKey] === id) || {};
    const dataKey = isSortExists ? column.dataKey : null;

    const defaultSortFn = useCallback((prev, next, dataKey, type, formatter, removeSymbol) => {
        const first = getValue(prev.data[dataKey], formatter);
        const second = getValue(next.data[dataKey], formatter);

        const firstValue = removeSymbol ? parseFloat(first.replace(/[^\d.-]/g, '')) : first;
        const secondValue = removeSymbol ? parseFloat(second.replace(/[^\d.-]/g, '')) : second;

        if (firstValue === null) return 1;
        if (secondValue === null) return -1;

        const firstLowerCased = typeof firstValue === 'string' ? firstValue.toLowerCase() : firstValue;
        const secondLowerCased = typeof secondValue === 'string' ? secondValue.toLowerCase() : secondValue;

        if (type === 'asc') {
            return firstLowerCased > secondLowerCased ? 1 : firstLowerCased < secondLowerCased ? -1 : 0;
        }
        if (type === 'desc') {
            return firstLowerCased < secondLowerCased ? 1 : firstLowerCased > secondLowerCased ? -1 : 0;
        }
        return 0;
    }, []);

    const sortFn = useMemo(
        () =>
            isSortExists
                ? (prev, next) => {
                      const { sortFn, formatter, removeSymbol } = column;
                      const fn = sortFn || defaultSortFn;
                      return typeof prev === 'object'
                          ? fn(prev, next, dataKey, type, formatter, removeSymbol)
                          : fn(rows[prev], rows[next], dataKey, type, formatter, removeSymbol);
                  }
                : undefined,
        [isSortExists, column, defaultSortFn, dataKey, type, rows]
    );

    return [type, column[columnKey], sortFn];
};

export default useSortConfigs;
