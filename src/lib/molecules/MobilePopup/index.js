import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { noop } from 'utils';
import Icon from '../../atoms/Icon';
import Portal from '../../atoms/Portal';

import ActionMenu from './Menu';
import './index.scss';

const MobilePopUp = forwardRef(
    (
        {
            onBackdropClick,
            rightActionClick,
            leftActionClick,
            portalContainer,
            rightAction,
            leftAction,
            className,
            isOpened,
            children,
            title,
            ...restProps
        },
        ref
    ) => {
        const generateAction = (action, onClick) => {
            if (action) {
                if (React.isValidElement(action)) {
                    return action;
                }
                return (
                    <ActionMenu action={action}>
                        <button className="mp-action" onClick={onClick}>
                            {action.iconType && <Icon type={action.iconType} />}
                            {action.text && <p className="ellipsis-text">{action.text}</p>}
                        </button>
                    </ActionMenu>
                );
            }
        };

        const handleBackdropClick = useCallback(
            (event) => {
                onBackdropClick(event, true);
            },
            [onBackdropClick]
        );

        return (
            <Portal isOpen={isOpened} container={portalContainer}>
                <div {...restProps} className={classnames('m-popup-holder', className)}>
                    <div className="m-popup-backdrop" onClick={handleBackdropClick} />
                    <div className="m-popup-c">
                        <ul className="m-popup-head">
                            <li>{generateAction(leftAction, leftActionClick)}</li>
                            <li>
                                <div className="ellipsis-text">{title}</div>
                            </li>
                            <li>{generateAction(rightAction, rightActionClick)}</li>
                        </ul>
                        <div className="m-popup-content" ref={ref}>
                            {children}
                        </div>
                    </div>
                </div>
            </Portal>
        );
    }
);

MobilePopUp.propTypes = {
    /**
     * Fires event when user clicks on right action button
     * (event: SyntheticEvent) => void
     */
    rightActionClick: PropTypes.func,
    /**
     * Fires event when user clicks on left action button
     * (event: SyntheticEvent) => void
     */
    leftActionClick: PropTypes.func,
    /**
     * Container for portal
     */
    portalContainer: PropTypes.any,
    /**
     * Props for right action
     *  iconType: String
     *  text: String
     *  menuOptions: Option atom's props
     */
    rightAction: PropTypes.oneOfType([
        PropTypes.any,
        PropTypes.shape({
            iconType: PropTypes.string,
            text: PropTypes.string,
            menuOptions: PropTypes.arrayOf(PropTypes.object)
        })
    ]),
    /**
     * Props for left action
     *  iconType: String
     *  text: String
     *  menuOptions: Option atom's props
     */
    leftAction: PropTypes.oneOfType([
        PropTypes.any,
        PropTypes.shape({
            iconType: PropTypes.string,
            text: PropTypes.string,
            menuOptions: PropTypes.arrayOf(PropTypes.object)
        })
    ]),
    /**
     * Additional classname
     */
    className: PropTypes.string,
    /**
     * Displays popup if [true]
     */
    isOpened: PropTypes.bool,
    /**
     * Valid React elements for popup body
     */
    children: PropTypes.node,
    /**
     * Custom title for popup
     */
    title: PropTypes.string,
    /*
     * Backdrop click event handler
     */
    onBackdropClick: PropTypes.func
};

MobilePopUp.defaultProps = {
    onBackdropClick: noop,
    leftActionClick: noop,
    rightActionClick: noop
};

export default MobilePopUp;
