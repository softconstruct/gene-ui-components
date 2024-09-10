import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { breakPoints } from 'configs';
import { getPartsByWindowSize } from './utils';

function Col(props) {
    const { __count, __gutter, __padding, __parentWidth, children, size, className, style = {}, ...rest } = props;

    const styles = {
        padding: `${__padding / 20}rem ${__gutter / 20}rem`,
        ...style
    };

    const fit = size || rest[getPartsByWindowSize(__parentWidth, breakPoints)];
    styles.width = `${(fit / __count) * 100}%`;

    return (
        <div className={classnames('grid-child', className)} style={styles} {...rest}>
            {children}
        </div>
    );
}

Col.propTypes = {
    /**
     * Component will calculate width based on this props
     */
    __parentWidth: PropTypes.number,
    /**
     * The space between elements vertically
     */
    __padding: PropTypes.number,
    /**
     * The space between elements horizontally
     */
    __gutter: PropTypes.number,
    /**
     * Defines the number of grids the component is going to use
     */
    __count: PropTypes.number,
    /**
     * The CSS class name of the element.
     */
    className: PropTypes.string,
    /**
     * Custom stylings
     */
    style: PropTypes.object,
    /**
     * Defines the size of grids the component is going to use.
     */
    xs: PropTypes.number,
    /**
     * Defines the size of grids the component is going to use.
     */
    md: PropTypes.number,
    /**
     * Defines the size of grids the component is going to use.
     */
    lg: PropTypes.number,
    /**
     * Defines the size of grids the component is going to use.
     */
    xl: PropTypes.number,
    /**
     * Defines the size of grids the component is going to use.
     */
    xxl: PropTypes.number,
    /**
     *  Custom size for element
     */
    size: PropTypes.number,
    /**
     *  Any valid react node
     */
    children: PropTypes.node
};

Col.defaultProps = {
    __parentWidth: 0,
    __padding: 20,
    __gutter: 20,
    __count: 12,
    xs: 1,
    md: 1,
    lg: 1,
    xl: 1,
    xxl: 1
};

export default Col;
