import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from '../../atoms/Icon';
import Tooltip from '../Tooltip';

// Styles
import './index.scss';

const statusIconTypes = ['dot', 'play', 'stop', 'circle', 'circle-outline'];

const statusEnums = {
    dot: 'bc-icon-dot',
    play: 'bc-icon-status-play',
    stop: 'bc-icon-status-stop',
    circle: 'bc-icon-status-circle',
    'circle-outline': 'bc-icon-status-circle-outline'
};

function Status({ label, color, title, onClick, iconType, hoverTitle, className, tooltipText, ...restProps }) {
    const Content = (
        <ul className="static-title-holder" {...restProps}>
            {label && <li className="st-t">{label}</li>}
            <li className="st-c">
                <div
                    className={classnames('status-holder', `c-${color}`, className, {
                        clickable: !!hoverTitle,
                        'cursor-pointer': !!onClick
                    })}
                    onClick={onClick}
                    style={{ '--hero': color }}
                >
                    <div className="status-icon">
                        <Icon type={statusEnums[iconType]} />
                    </div>
                    {title && (
                        <p>
                            {hoverTitle && <span className="hover-text">{hoverTitle}</span>}
                            <span>{title}</span>
                        </p>
                    )}
                </div>
            </li>
        </ul>
    );

    return tooltipText ? (
        <Tooltip position="auto" title={tooltipText}>
            {Content}
        </Tooltip>
    ) : (
        Content
    );
}

Status.propTypes = {
    /**
     * Label for 'Status'.
     */
    label: PropTypes.string,
    /**
     * Title for 'Status'.
     */
    title: PropTypes.string,
    /**
     * Fires an event on 'Status' change((event: Event) => void).
     */
    onClick: PropTypes.func,
    /**
     * External/Additional className that can be added to 'Status' component.
     */
    className: PropTypes.string,
    /**
     * Title for hovered state 'Status'.
     */
    hoverTitle: PropTypes.string,
    /**
     * Text for tooltip.
     */
    tooltipText: PropTypes.string,
    /**
     * External color className
     */
    color: PropTypes.string,
    /**
     * Various types for icon
     */
    iconType: PropTypes.oneOf(statusIconTypes)
};

export { statusIconTypes };

export default Status;
