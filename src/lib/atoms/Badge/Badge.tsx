import React, { FC } from 'react';

// Styles
import './Badge.scss';

interface IBadgeProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * Numeric Badge component is a small, circular indicator that displays numerical information, often used to highlight counts or statuses. It is typically positioned adjacent to icons or labels, providing users with a quick visual cue about the number of notifications, messages, or items requiring attention.
 */
const Badge: FC<IBadgeProps> = ({ size }) => {
    return <div className="badge">Badge</div>;
};

export { IBadgeProps, Badge as default };
