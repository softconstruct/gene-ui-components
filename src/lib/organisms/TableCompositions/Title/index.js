import React from 'react';
import PropTypes from 'prop-types';

import Table from '../../Table';
import { WithTitle } from '../utils';

function TableTitle({ name, titleActions, ...tableProps }) {
    return (
        <WithTitle name={name} actions={titleActions}>
            <Table {...tableProps} />
        </WithTitle>
    );
}

TableTitle.propTypes = {
    /**
     * Any valid react node
     */
    titleActions: PropTypes.node,
    /**
     * Value for title
     */
    name: PropTypes.string.isRequired,
    /**
     * Callback for refresh icon click
     */
    onRefreshClick: PropTypes.func
};

export default TableTitle;
