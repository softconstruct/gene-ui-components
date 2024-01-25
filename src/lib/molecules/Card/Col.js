import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// Helpers
import { guid, oneIsRequired } from 'utils';

// Components
import SkeletonLoader from '../../atoms/SkeletonLoader';
import KeyValue from '../../atoms/KeyValue';

// Styles
import './index.scss';

function Col({ col, row, index, ...restProps }) {
    const guidRef = useRef(null);
    const mounted = useRef(null);

    const { getter, formatter, colRenderer, dataKey, text } = col;

    const getterValue = getter ? getter(row, index) : row.data[dataKey];
    const formattedValue = formatter ? formatter(getterValue, row, index) : getterValue;

    const isValuePromise = formattedValue instanceof Promise;

    const [promiseValue, setPromiseValue] = useState(() => {
        if (isValuePromise) {
            guidRef.current = guid();
            return guidRef.current;
        }
    });

    useEffect(() => {
        mounted.current = true;

        isValuePromise && formattedValue.then((result) => mounted.current && setPromiseValue(result));

        return () => {
            mounted.current = false;
        };
    }, [formattedValue, isValuePromise, mounted.current]);

    const value = isValuePromise ? promiseValue : formattedValue;

    const colNode = colRenderer ? colRenderer(value, index, row) : value;

    return (
        <KeyValue
            {...restProps}
            key={dataKey}
            label={text}
            appearance="vertical"
            value={
                <SkeletonLoader height={20} isBusy={guidRef.current && promiseValue === guidRef.current}>
                    {colNode || null}
                </SkeletonLoader>
            }
            className="card-list-col"
        />
    );
}

Col.propTypes = {
    /**
     * sortFn: Custom sort function for columns.((prev: PropTypes.rows[item], next: PropTypes.rows[item], rows: PropTypes.rows, dataKey: string) => {
     *   if (prev is less than next by some ordering criterion) {
     *      return -1;
     *   }
     *    if (prev is greater than next by the ordering criterion) {
     *      return 1;
     *    }
     *    prev is equal to next
     *   return 0;
     *  }
     * })
     *
     * text: Text value for columns
     *
     * render: Function to render custom text.((column: PropTypes.columns[item], index: number, isEditActive: boolean) =>  return any)
     *
     * current column's data key
     *
     * colRenderer: Render custom component on certain column of each row. ((value: string || number, index: number, row: PropTypes.rows[item], isEditActive: boolean) => {
     *  return <div>Hello World</div>})
     *
     * getter: Function to define custom text. ((row: PropTypes.rows[item], index: number, isEditActive: boolean)) => {
     *  return some string
     * })
     *
     * formatter: Function tp format displaying text. ((middleText: string, row: PropTypes.rows[item], index: number, isEditActive: boolean) => {
     *  return some string
     * })
     *
     */
    col: PropTypes.shape({
        sortFn: PropTypes.func,
        ...oneIsRequired({
            text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            render: PropTypes.func
        }),
        dataKey: PropTypes.string,
        colRenderer: PropTypes.func,
        getter: PropTypes.func,
        formatter: PropTypes.func
    }).isRequired,
    /**
     * data: rows column's data
     * className: additional className for row element
     * render: Render custom component on (row: PropTypes.rows[item] index: number) => {
     *  return <div>Hello World</div>})
     */
    row: PropTypes.shape({
        data: PropTypes.object,
        className: PropTypes.string,
        render: PropTypes.func
    }),
    /**
     * Index of row
     */
    index: PropTypes.number
};

export default React.memo(Col);
