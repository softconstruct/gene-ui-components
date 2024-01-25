import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Styles
import './index.scss';

const labels = {
    headingExtraLarge: 'h1',
    headingLarge: 'h1',
    headingBig: 'h2',
    heading: 'h3',
    bodyBig: 'h4',
    body: 'h5',
    bodySmall: 'h6',
    content: 'p'
};

function Label({ children, className, size, font, ...restProps }) {
    return React.createElement(
        labels[size],
        {
            className: classnames('label', className, font, {
                large: size === 'headingExtraLarge'
            }),
            ...restProps
        },
        children
    );
}

Label.propTypes = {
    /**
     * Any valid React node.
     */
    children: PropTypes.string.isRequired,
    /**
     * Label sizing
     */
    size: PropTypes.oneOf([
        'headingExtraLarge',
        'headingLarge',
        'headingBig',
        'heading',
        'bodyBig',
        'body',
        'bodySmall',
        'content'
    ]),
    /**
     * Label font to be used
     */
    font: PropTypes.oneOf(['regular', 'semiBold', 'bold']),
    /**
     * Addional className
     */
    className: PropTypes.string
};

Label.defaultProps = {
    size: 'content',
    font: 'regular'
};

export default Label;
