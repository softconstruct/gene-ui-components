import React from 'react';
import PropTypes from 'prop-types';

const HeaderTableProp = (props) => <div></div>;

HeaderTableProp.propTypes = {
    /**
     * Define is search bar will shown or no
     */
    withSearch: PropTypes.bool,
    /**
     * Any valid react node
     */
    headerActions: PropTypes.node,
    /**
     * All props from Table component
     */
    '': PropTypes.any
};

export default HeaderTableProp;
