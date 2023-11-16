import React from 'react';
import PropTypes from 'prop-types';

function TextLink({ children, ...props }) {
    return <span {...props}>{children}</span>;
}

TextLink.propTypes = {
    /**
     * Any valid React node
     */
    children: PropTypes.string.isRequired,
    /**
     * Additional className
     */
    className: PropTypes.string
};

export default TextLink;
