import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

// This this because in production we need to replace 'nonames.com' with host
// but in development mode we need to put 'nonames.com'
function getMainHost() {
    const parts = window.location.host.split('.');

    if (parts.length < 2) return 'nonamens.com';

    return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

const host =
    process.env.REACT_APP_ICON_URL || process.env.REACT_APP_NODE === 'production' ? getMainHost() : 'nonamens.com';

if (process.env.REACT_APP_CUSTOM_ICON_URL) {
    document.head.appendChild(document.createElement('style')).textContent = `@import url('${
        window.location.protocol
    }//${window.location.host}/core-icons/import.css?v=${Math.floor(Math.random() * 666) + 1}`;
} else {
    document.head.appendChild(
        document.createElement('style')
    ).textContent = `@import url('https://sharedassets.${host}/core-icons/import.css?v=${
        Math.floor(Math.random() * 666) + 1
    }`;
}

function Icon({ type, disabled, className, isFilled, ...restProps }) {
    return (
        <i
            {...restProps}
            className={classnames('icon', className, {
                [type]: !!type,
                disabled
            })}
        />
    );
}

Icon.propTypes = {
    /**
     * Type is the exact icon. You can find valid "type" values in the documentation example
     */
    type: PropTypes.string,
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Icon disabled state
     */
    disabled: PropTypes.bool,
    /**
     * Will fill the icon when set to "true"
     */
    isFilled: PropTypes.bool
};

Icon.defaultProps = {
    disabled: false,
    isFilled: false,
    type: ''
};

export default Icon;
