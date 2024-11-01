import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Notification.scss";
import { Close, InfoFill } from "@geneui/icons";

interface INotificationProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * Notification component encompasses various types of messages, including toast notifications and section messages, to provide feedback to users in a clear and structured manner. Notifications inform users about system events, updates, or the status of their actions, ensuring that important information is communicated effectively.
 */
const Notification: FC<INotificationProps> = ({ className }) => {
    return (
        <div
            className={classNames(
                "notification notification_type_sectionMessage notification_state_informative",
                className
            )}
        >
            <div className="notification__wrapper">
                <div className="notification__content">
                    <InfoFill className="notification__icon" />
                    <div className="notification__textGroup">
                        <p className="notification__title">Title</p>
                        <p className="notification__description">Description text goes here.</p>
                    </div>
                </div>
                <div className="notification__button">
                    <Close size={16} />
                </div>
            </div>
            <div className="notification__actions">{/* Here should be buttons */}</div>
        </div>
    );
};

export { INotificationProps, Notification as default };
