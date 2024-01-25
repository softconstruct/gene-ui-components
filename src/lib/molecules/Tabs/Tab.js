import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from '../../atoms/Icon';

function Tab(props) {
    const { title, icon, active, onClose, disabled, activeKey, closeTitleText, defaultActiveKey, ...restProps } = props;

    const ref = useRef(null);

    const isCloseable = props.hasOwnProperty('onClose') && typeof onClose === 'function';

    useEffect(() => {
        if (active && activeKey && defaultActiveKey !== activeKey && (defaultActiveKey || defaultActiveKey === 0)) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                inline: 'nearest',
                block: 'start'
            });
        }
    }, [active, activeKey, defaultActiveKey]);

    return (
        <li
            ref={ref}
            className={classnames({
                active,
                disabled
            })}
            {...restProps}
        >
            {icon && <Icon type={icon} className="tab-icon" />}
            <div className="ellipsis-text">{title}</div>
            {isCloseable && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="tab-close-button"
                    title={closeTitleText}
                >
                    <Icon type="bc-icon-close" />
                </button>
            )}
        </li>
    );
}

Tab.propTypes = {
    /**
     * Title for 'Tab'.
     */
    title: PropTypes.node,
    /**
     * Active/Passive state of 'Tab'
     */
    active: PropTypes.bool,
    /**
     * Disabled state of 'Tab'
     */
    disabled: PropTypes.bool,
    /**
     * Icon of 'Tab'
     */
    icon: PropTypes.string,
    /**
     * Content padding for specific 'Tab'
     */
    contentPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Prop for specifying which tab is active
     */
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Prop for default active tab
     */
    defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Shows close button and triggers function onClick
     */
    onClose: PropTypes.func,
    /**
     * Shows title hovering the close button
     */
    closeTitleText: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

Tab.defaultProps = {
    disabled: false
};

export default Tab;
