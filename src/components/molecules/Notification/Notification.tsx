import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Notification.scss";

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
    return <div className={classNames("notification", className)}>Notification</div>;
};

export { INotificationProps, Notification as default };
