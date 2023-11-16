import React from 'react';

import Header from './header';
import Body from './body';

import './index.scss';

function Nested({ rows, columns, isEditActive, ...restProps }) {
    return (
        <div className="nested-table" {...restProps}>
            <Header columns={columns} />
            <Body rows={rows} columns={columns} isEditActive={isEditActive} />
        </div>
    );
}

Nested.defaultProps = {
    columns: [],
    rows: []
};

export default Nested;
