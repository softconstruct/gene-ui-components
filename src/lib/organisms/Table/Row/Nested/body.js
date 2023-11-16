import React, { memo } from 'react';
import isEqual from 'react-fast-compare';

const Body = ({ rows, columns, isEditActive }) =>
    rows.length &&
    rows.map((row, index) =>
        row.render ? (
            row.render(row, index, columns.dataKey)
        ) : (
            <div className="nt-row" key={index}>
                {columns.map((column, index) => (
                    <div key={index} className="nt-cell">
                        {typeof row.data[column.dataKey] === 'function'
                            ? row.data[column.dataKey](isEditActive, index, column.dataKey)
                            : row.data[column.dataKey]}
                    </div>
                ))}
            </div>
        )
    );

export default memo(Body, isEqual);
