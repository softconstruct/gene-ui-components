import React, { FC } from 'react';

import { WarningOutline, InfoOutline, ErrorAlertOutline, IconProps } from '@geneui/icons';

// Hooks
import { useStateControlled } from '../../../hooks';

// Styles
import './Banner.scss';

interface IBannerProps {
    /**
     * Text of the banner
     */
    text: string;
    /**
     * Type of banner <br/>
     * Possible values: `informational | warning | error`
     */
    type?: 'informational' | 'warning' | 'error';
    /**
     * Determines is component works with their internal state or the state should be controlled from parent component
     */
    visible?: boolean;
    /**
     * Callback which calls when close button is pressed, in case of controlled mode the hide function should be controlled from parent using this function
     */
    onClose?: () => void;
}

const typeIcons: Record<Exclude<IBannerProps['type'], undefined>, React.FC<IconProps>> = {
    error: ErrorAlertOutline,
    warning: WarningOutline,
    informational: InfoOutline
} as const;

/**
 * Banner component is a prominent, horizontally-oriented message box designed to capture the user's attention and convey important information across the top of a page. It is used for announcements, alerts, promotions, or updates that need to be immediately visible to users.
 */
const Banner: FC<IBannerProps> = ({ type = 'informational', text, visible, onClose }) => {
    const [isOpen, setIsOpen] = useStateControlled(visible, true);

    const close = () => {
        setIsOpen(false);
        onClose?.();
    };

    if (!isOpen) {
        return null;
    }

    const Icon = typeIcons[type];

    return (
        <div className={`banner banner_state_${type}`}>
            <div className="banner__content">
                <Icon className="banner__icon" />
                <p className="banner__text">{text}</p>
            </div>
            <div className="banner__actions"></div>
        </div>
    );
};

export { IBannerProps, Banner as default };
