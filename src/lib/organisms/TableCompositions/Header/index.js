import React from 'react';
import PropTypes from 'prop-types';

import Table from '../../Table';
import { WithHeader } from '../utils';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function TableHeader({
    columns,
    withSearch,
    actions,
    handleSearch,
    checkAllText,
    leftHeaderActions,
    hideSearchDropdown,
    ...tableProps
}) {
    return (
        <WithHeader
            withSearch={withSearch}
            actions={actions}
            dropDownData={columns}
            handleSearch={handleSearch}
            checkAllText={handleSearch}
            leftHeaderActions={leftHeaderActions}
            hideSearchDropdown={hideSearchDropdown}
        >
            <Table columns={columns} {...tableProps} />
        </WithHeader>
    );
}

TableHeader.propTypes = {
    /**
     * Define is search bar will shown or no
     */
    withSearch: PropTypes.bool,
    /**
     * Any valid react node
     */
    headerActions: PropTypes.node
};

export default TableHeader;
