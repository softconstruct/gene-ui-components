import React from 'react';
import PropTypes from 'prop-types';

import Paper from '../../../../atoms/Paper';

function PaperWrapper({ paperDirection, cornerRadius, className, children, shadow, ...restProps }) {
    return (
        <Paper
            shadow={shadow}
            paperDirection={paperDirection}
            cornerRadius={cornerRadius}
            className={className}
            {...restProps}
        >
            {children}
        </Paper>
    );
}

PaperWrapper.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    cornerRadius: PropTypes.string,
    shadow: PropTypes.bool,
    ...Paper.propTypes
};

PaperWrapper.defaultProps = {
    shadow: false,
    cornerRadius: 'full-radius',
    paperDirection: 'column'
};

export default PaperWrapper;
