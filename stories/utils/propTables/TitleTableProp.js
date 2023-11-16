import React from 'react';
import PropTypes from 'prop-types';

const TitleTableProp = (props) => <div></div>;

TitleTableProp.propTypes = {
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
    onRefreshClick: PropTypes.func,
    /**
     * All props from Table component
     */
    '': PropTypes.any
};

export default TitleTableProp;
