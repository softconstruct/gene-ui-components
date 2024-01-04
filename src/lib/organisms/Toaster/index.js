import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { guid } from 'utils';
import Portal from '../../atoms/Portal';
import Notification from '../../molecules/Notification';
import Alert, { alertTypes } from '../../molecules/Alert';

import './index.scss';

const toasterPositions = ['top', 'bottom', 'center', 'left-top', 'left-bottom', 'right-top', 'right-bottom'];

function Toaster({ defaultDuration, toasterPosition, notificationPosition }) {
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const removeItem = useCallback((key, id) => {
        const setState = key === 'messages' ? setMessages : setNotifications;
        setState((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const runRenderTask = useCallback(
        (key, duration, option) => {
            const timerId = setTimeout(() => {
                removeItem(key, option.id);
            }, duration || defaultDuration);

            const setState = key === 'messages' ? setMessages : setNotifications;

            setState((prev) => [
                ...prev,
                {
                    ...option,
                    onClose: (e) => {
                        removeItem(key, option.id);
                        clearTimeout(timerId);
                        option.onClose && option.onClose(e);
                    }
                }
            ]);
        },
        [defaultDuration, removeItem]
    );

    useEffect(() => {
        Toaster.notify = (options) => {
            const { duration, ...rest } = options;
            const notification = { ...rest, id: guid() };

            runRenderTask('notifications', duration, notification);
        };

        alertTypes.forEach((type) => {
            Toaster[type] = (options) => {
                const { duration, ...rest } = options;
                const message = {
                    ...rest,
                    type,
                    id: guid()
                };

                runRenderTask('messages', duration, message);
            };
        });
    }, [runRenderTask]);

    const createPortal = (Comp, options, className, position) => (
        <Portal isOpen={!!options.length} className={classnames(className, position)}>
            {options.map((option) => {
                const { Component, id, ...rest } = option;
                return React.isValidElement(Component) ? <Component key={id} {...rest} /> : <Comp key={id} {...rest} />;
            })}
        </Portal>
    );

    return (
        <>
            {createPortal(Alert, messages, 'toaster-holder', toasterPosition)}
            {createPortal(Notification, notifications, 'toaster-holder', notificationPosition)}
        </>
    );
}

Toaster.propTypes = {
    /**
     * Determines how long should component be displayed
     */
    defaultDuration: PropTypes.number,
    /**
     * Determines toaster position on window,
     * On of ['top', 'bottom', 'center', 'left-top', 'left-bottom', 'right-top', 'right-bottom']
     */
    toasterPosition: PropTypes.string,
    /**
     * Determines notification position on window,
     * On of ['top', 'bottom', 'center', 'left-top', 'left-bottom', 'right-top', 'right-bottom']
     */
    notificationPosition: PropTypes.string
};

Toaster.defaultProps = {
    defaultDuration: 4000,
    toasterPosition: 'right-top',
    notificationPosition: 'right-top'
};

export { toasterPositions };

export default Toaster;
