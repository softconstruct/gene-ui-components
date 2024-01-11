import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { titleConfig } from 'configs';
import Icon from '../Icon';

import './index.scss';

function Title({ icon, text, actions, color, withLine, className, ...restProps }) {
    return (
        <ul className={classnames('title-holder', `c-${color}`, className)} {...restProps}>
            {icon && (
                <li>
                    <Icon type={icon} />
                </li>
            )}
            <li className="title-text">
                <div className="ellipsis-text">{text}</div>
            </li>
            <li className="line">{withLine && <i />}</li>
            {actions && <li>{actions}</li>}
        </ul>
    );
}

Title.propTypes = {
    /**
     * Display an icon. Values are the same as "Icon" atoms type prop
     */
    icon: PropTypes.string,
    /**
     * Text/Component to be displayed. Any valid React node
     */
    text: PropTypes.node.isRequired,
    /**
     * Actions to be displayed. Any valid React node
     */
    actions: PropTypes.node,
    /**
     * Title color
     */
    color: PropTypes.oneOf(titleConfig.color),
    /**
     * Displays a divider line
     */
    withLine: PropTypes.bool,
    /**
     * Additional className
     */
    className: PropTypes.string
};

Title.defaultProps = {
    color: titleConfig.color[1],
    withLine: false
};

export default Title;
