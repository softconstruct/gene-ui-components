import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { screenTypes } from 'configs';
import { useDeviceType } from 'hooks';
import Icon from '../../atoms/Icon';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

const alertTypes = ['success', 'info', 'warning', 'error', 'note', 'message'];

function Alert({ type, title, onClose, message, screenType, iconProps, swapIcon, className, ...rest }) {
    const { isMobile } = useDeviceType(screenType);

    return (
        <div className={classnames('alert-holder', { 'mobile-view': isMobile }, className)} {...rest}>
            <ul className={classnames('alert-box', `type-${type}`)}>
                {(swapIcon || iconProps) && (
                    <li className="ab-bc-icon-c">
                        {/* Icon isFilled prop need to passed directly to Icon atom after it will support filled theme */}
                        {swapIcon || (
                            <Icon
                                type={`bc-icon-${type === 'warning' ? 'info' : type}${
                                    iconProps.isFilled ? '-fill' : ''
                                }`}
                            />
                        )}
                    </li>
                )}
                <li className="ab-c-c">
                    <div className="alert-box-title">{title}</div>
                    {message && <div className="alert-text">{message}</div>}
                </li>
                {!!onClose && (
                    <li className="ab-action-c" onClick={onClose}>
                        <Icon type="bc-icon-close" />
                    </li>
                )}
            </ul>
        </div>
    );
}

Alert.propTypes = {
    /**
     * Alert type is for specifying information message to be delivered. Also a corresponding "Icon" atom will be displayed
     */
    type: PropTypes.oneOf(alertTypes),
    /**
     * Main field to describe alert information. Any valid React node
     */
    title: PropTypes.node.isRequired,
    /**
     * Additional classname
     */
    className: PropTypes.string,
    /**
     * Use this field for describing information more verbose. Any valid React node
     */
    message: PropTypes.node,
    /**
     * The switch between mobile and desktop version of Alert will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside.
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * When function is passed an "Icon" atom("type": "bc-icon-close") will be displayed((event: Event) => void).
     */
    onClose: PropTypes.func,
    /**
     * Same as "Icon" atom props
     */
    iconProps: PropTypes.shape({ ...Icon.propTypes }),
    /**
     * Use this prop for replace main "Icon". Note that when the prop is specified "type" prop will not work(will be overlooked).
     */
    swapIcon: PropTypes.node
};

Alert.defaultProps = {
    type: 'info'
};

export { alertTypes };

export default Alert;
