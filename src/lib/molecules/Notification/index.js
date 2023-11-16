import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { useDeviceType } from 'hooks';
import { screenTypes } from 'configs';

import Icon from '../../atoms/Icon';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

const notificationTypes = ['default', 'clean'];

function Notification({
    type,
    onClose,
    closable,
    content,
    title,
    heading,
    className,
    screenType,
    additionalHeading,
    notificationIcon,
    onContentClick,
    description,
    additionalDescription,
    ...restProps
}) {
    const { isMobile } = useDeviceType(screenType);

    return (
        <ul
            onClick={onContentClick}
            className={classnames('notifier-block', className, `type-${type}`, {
                'mobile-view': isMobile
            })}
            {...restProps}
        >
            {type && <li className={classnames('notifier-icon', notificationIcon)} />}
            <li className="notifier-content">
                <div className="notifier-title">{title}</div>
                {content || (
                    <div className="notifier-c-t">
                        {heading && (
                            <ul>
                                <li>
                                    <span>{heading}</span>
                                </li>
                                <li>{description}</li>
                            </ul>
                        )}
                        {additionalHeading && (
                            <ul>
                                <li>
                                    <span>{additionalHeading}</span>
                                </li>
                                <li>{additionalDescription}</li>
                            </ul>
                        )}
                    </div>
                )}
            </li>
            {closable && (
                <li className="notifier-action" onClick={onClose}>
                    <Icon type="bc-icon-close" />
                </li>
            )}
        </ul>
    );
}

Notification.propTypes = {
    /**
     * Type of the Notification component.
     */
    type: PropTypes.oneOf(notificationTypes),
    /**
     * If true displays close button
     */
    closable: PropTypes.bool,
    /**
     * CSS class name for element
     */
    className: PropTypes.string,
    /**
     * Fires event when user clicks on close button
     * (event: Event) => void
     */
    onClose: PropTypes.func,
    /**
     * Custom content form notification
     */
    content: PropTypes.element,
    /**
     * Fires when user click on notification modal
     * (event: Event) => void
     */
    onContentClick: PropTypes.func,
    /**
     * Heading text for notification modal
     */
    heading: PropTypes.string,
    /**
     * Descriptions text fro notification
     */
    description: PropTypes.string,
    /**
     * Controls screen type
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Additional heading text for notification
     */
    additionalHeading: PropTypes.string,
    /**
     * Notification icon
     */
    notificationIcon: PropTypes.string.isRequired,
    /**
     * Additional info for notification
     */
    additionalDescription: PropTypes.string,
    /**
     * Title for notification
     */
    title: PropTypes.string.isRequired
};

Notification.defaultProps = {
    type: notificationTypes[0],
    closable: false
};

export { notificationTypes };

export default Notification;
