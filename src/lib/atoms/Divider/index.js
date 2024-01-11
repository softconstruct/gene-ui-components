import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.scss';

function Divider({ type, className, size, withSpace, ...restProps }) {
    const modifiedSize = useMemo(() => (typeof size === 'number' ? `${size / 10}rem` : size), [size]);

    const styles = useMemo(
        () => (type === 'vertical' ? { height: modifiedSize } : { width: modifiedSize }),
        [modifiedSize, type]
    );

    return (
        <div
            className={classnames('divider', `type-${type}`, { 'divider-withNoSpace': !withSpace }, className)}
            style={styles}
            {...restProps}
        />
    );
}

Divider.propTypes = {
    /**
     * Divider direction
     */
    type: PropTypes.oneOf(['horizontal', 'vertical']),
    /**
     * Divider additional className
     */
    className: PropTypes.string,
    /**
     * Divider size will be applied to height(when "type" is set to "vertical") or to width(when "type" is set to "horizontal")
     */
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * withSpace by default true. If you want to remove the divider`s spacing, switch to false
     */
    withSpace: PropTypes.bool
};

Divider.defaultProps = {
    type: 'vertical',
    withSpace: true
};
Divider.displayName = 'Divider';
export default Divider;
