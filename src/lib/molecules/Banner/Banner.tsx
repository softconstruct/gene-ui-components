import React, { FC, useState } from 'react';
import classNames from 'classnames';

import { WarningOutline, InfoOutline, ErrorAlertOutline } from '@geneui/icons';

// Styles
import './Banner.scss';

interface IBannerProps {
    /**
     * Title of the banner
     */
    title: string;
    /**
     * Type of banner <br/>
     * Possible values: `informational | warning | error`
     */
    type?: 'informational' | 'warning' | 'error';
    /**
     * If pass `isVisible` property then component will become controlled, otherwise it is uncontrolled <br/>
     * If `isVisible=true` then it will be shown, and to hide it you will need to pass `isVisible=false` <br/>
     * If don't pass `isVisible` at all component will be shown until close button is pressed
     */
    isVisible?: Boolean;
    /**
     * Callback which calls when close button is pressed
     */
    onClose?: () => void;
}

const getIconComponent = (type: IBannerProps['title']) => {
    switch (type) {
        case 'error':
            return ErrorAlertOutline;
        case 'warning':
            return WarningOutline;
        default:
            return InfoOutline;
    }
};

/**
 * Banner component is a prominent, horizontally-oriented message box designed to capture the user's attention and convey important information across the top of a page. It is used for announcements, alerts, promotions, or updates that need to be immediately visible to users.
 */
const Banner: FC<IBannerProps> = ({ type = 'informational', title, isVisible, onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isUncontrolled = isVisible === undefined;

    const close = () => {
        if (isUncontrolled) {
            setIsOpen(false);
        }
        onClose?.();
    };

    if (isVisible === false || !isOpen) {
        return null;
    }

    const Icon = getIconComponent(type);

    return (
        <div
            className={classNames({
                'banner banner_state_informative': type === 'informational',
                'banner banner_state_warning': type === 'warning',
                'banner banner_state_error': type === 'error'
            })}
        >
            {/* there are following states banner_state_informative // banner_state_warning // banner_state_error */}
            <div className="banner__content">
                <Icon className="banner__icon" />
                <p className="banner__text">{title}</p>
            </div>
            <div className="banner__actions"></div>
        </div>
    );
};

export { IBannerProps, Banner as default };
