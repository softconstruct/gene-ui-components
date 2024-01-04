import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { tagConfig } from 'configs';

import './index.scss';

function Tag({
    label,
    name,
    cornerRadius,
    size,
    color,
    appearance,
    flexibility,
    selected,
    className,
    cursor,
    icons,
    ...restProps
}) {
    return (
        <ul className={classnames('static-title-holder', className, `f-${flexibility}`)} {...restProps}>
            {label && <li className="st-t">{label}</li>}
            <li className="st-c">
                <div
                    className={classnames(
                        'tag-c',
                        `cr-${cornerRadius}`,
                        `a-${appearance}`,
                        `f-${flexibility}`,
                        `s-${size}`,
                        {
                            active: selected,
                            'pointer-events-none': !icons
                        }
                    )}
                    style={{ '--hero': color, cursor }}
                >
                    {icons || null}
                    <div className="tag-cp tag-cc ellipsis-text">{name}</div>
                    <div className="tag-backdrop" />
                </div>
            </li>
        </ul>
    );
}

Tag.propTypes = {
    /**
     * Label for 'Tag'.
     */
    label: PropTypes.string,
    /**
     * Cursor type for 'Tag'.
     */
    cursor: PropTypes.string,
    /**
     * Name for 'Tag'.
     */
    name: PropTypes.string.isRequired,
    /**
     * Border type of corners
     */
    cornerRadius: PropTypes.oneOf(tagConfig.cornerRadius),
    /**
     * Chooses how to show 'Tag'
     */
    flexibility: PropTypes.oneOf(tagConfig.flexibility),
    /**
     * Switches between different sizes of 'Tag'.
     */
    size: PropTypes.oneOf(tagConfig.size),
    /**
     * Color/theming for 'Tag'.
     */
    color: PropTypes.string,
    /**
     * Switches between different views of 'Tag'.
     */
    appearance: PropTypes.oneOf(tagConfig.appearance),
    /**
     * Selected state
     */
    selected: PropTypes.bool,
    /**
     * External/Additional className
     */
    className: PropTypes.string,
    /**
     * Showing icons
     */
    icons: PropTypes.node
};

Tag.defaultProps = {
    cornerRadius: tagConfig.cornerRadius[0],
    flexibility: tagConfig.flexibility[0],
    size: tagConfig.size[1],
    appearance: tagConfig.appearance[0],
    selected: false,
    cursor: 'pointer'
};

export default Tag;
