import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { moduleTitleConfig } from 'configs';
import { noop } from 'utils';

// Components
import Icon from '../Icon';
import Tooltip from '../../molecules/Tooltip';

// Styles
import './index.scss';

function IconWithTooltip({ toolTip, children }) {
    return toolTip ? <Tooltip title={toolTip}>{children}</Tooltip> : children;
}

function ModuleTitle({
    size,
    title,
    color,
    hideBeforeBorder,
    position,
    children,
    className,
    description,
    cornerRadius,
    headerBorder,
    titleIcon,
    titleIconTooltip,
    onTitleIconClick,
    ...restProps
}) {
    return (
        <ul
            className={classnames('module-header', `cr-${cornerRadius}`, `p-${position}`, `s-${size}`, className, {
                headerBorder
            })}
            {...restProps}
        >
            <li className="left-content" style={{ '--hero': color || '' }}>
                <div className="left-inner">
                    {description ? (
                        <div className="module-description-title">
                            <div className="m-description ellipsis-text">{description}</div>
                            <div className="m-title ellipsis-text">{title}</div>
                        </div>
                    ) : (
                        title && (
                            <div
                                className={classnames('ellipsis-text', {
                                    'module-title-without-border': hideBeforeBorder,
                                    'module-title': !hideBeforeBorder
                                })}
                                title={typeof title === 'string' ? title : ''}
                            >
                                {title}
                            </div>
                        )
                    )}
                </div>
                {titleIcon && (
                    <IconWithTooltip toolTip={titleIconTooltip}>
                        <div className="left-inner-icon">
                            <Icon type={titleIcon} onClick={onTitleIconClick} />
                        </div>
                    </IconWithTooltip>
                )}
            </li>
            <li className="right-content">{children}</li>
        </ul>
    );
}

ModuleTitle.propTypes = {
    /**
     * Title property. Any valid React node.
     */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * Additonal description. Any valid React node
     */
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * ModuleTitle sizing
     */
    size: PropTypes.oneOf(moduleTitleConfig.size),
    /**
     * Addional className
     */
    className: PropTypes.string,
    /**
     * Hide border after title
     */
    hideBeforeBorder: PropTypes.bool,
    /**
     * Hide header main border
     */
    headerBorder: PropTypes.bool,
    /**
     * ModuleTitle positioning
     */
    position: PropTypes.oneOf(moduleTitleConfig.position),
    /**
     * ModuleTitle corner radius
     */
    cornerRadius: PropTypes.oneOf(moduleTitleConfig.cornerRadius),
    /**
     * Module title content can be passed as child. Any valid React node.
     */
    children: PropTypes.node,
    /**
     * Use this prop to override ModuleTitle's underline color. Will not work when "descroiption" prop is specified
     */
    color: PropTypes.string,
    /**
     * Will add an "Icon" atom to the left side of ModuleTitle. Valid values are the same as "type" prop for "Icon" atom
     */
    titleIcon: PropTypes.string,
    /**
     * Tooltip for icon
     */
    titleIconTooltip: PropTypes.string,
    /**
     * Title Icon onClick event
     */
    onTitleIconClick: PropTypes.func
};

ModuleTitle.defaultProps = {
    onTitleIconClick: noop,
    headerBorder: true,
    size: moduleTitleConfig.size[2],
    position: moduleTitleConfig.position[0],
    cornerRadius: moduleTitleConfig.cornerRadius[0]
};

export default ModuleTitle;
