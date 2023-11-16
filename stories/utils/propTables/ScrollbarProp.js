import React from 'react';
import PropTypes from 'prop-types';

const CustomScrollbarProp = (props) => <div></div>;

CustomScrollbarProp.propTypes = {
    /**
     * Any valid React node
     */
    children: PropTypes.node.isRequired,
    /**
     * Enable auto-height mode. When true container grows with content.
     */
    autoHeight: PropTypes.bool,
    /**
     * Set a minimum height for auto-height mode.
     */
    autoHeightMin: PropTypes.number,
    /**
     * Set a maximum height for auto-height mode
     */
    autoHeightMax: PropTypes.number
};

export default CustomScrollbarProp;
