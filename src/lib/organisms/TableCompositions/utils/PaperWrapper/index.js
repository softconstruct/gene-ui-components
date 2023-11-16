import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Paper from '../../../../atoms/Paper';

function PaperWrapper({ className, shadow, cornerRadius, paperDirection, children, ...restProps }) {
    return (
        <Paper
            shadow={shadow}
            paperDirection={paperDirection}
            cornerRadius={cornerRadius}
            className={classnames(className)}
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
    shadow: PropTypes.bool
};

PaperWrapper.defaultProps = {
    shadow: true,
    cornerRadius: 'full-radius',
    paperDirection: 'column'
};

export default PaperWrapper;
