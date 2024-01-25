import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from '../../atoms/Icon';

// Styles
import './index.scss';

const appearances = ['default', 'minimal'];

function Panel(props) {
    const {
        appearance,
        disabled,
        opened,
        title,
        children,
        onClick,
        expandIcon,
        showIcon,
        className,
        rightAction,
        ...restProps
    } = props;

    return (
        <div
            {...restProps}
            className={classnames('accordion-holder', className, `a-${appearance}`, {
                disabled,
                active: opened
            })}
        >
            <ul className="accordion-head" onClick={onClick}>
                {showIcon && (
                    <li>
                        {expandIcon ? (
                            expandIcon(opened, props)
                        ) : (
                            <Icon type="bc-icon-arrow-down" className="accordion-head-arrow" />
                        )}
                    </li>
                )}
                <li className="ellipsis-text">{title}</li>
                <li className="line" />
                <li>{rightAction}</li>
            </ul>
            {opened && <div className="accordion-body">{children}</div>}
        </div>
    );
}

Panel.propTypes = {
    /**
     * Same as "Collapse" appearance. Note that you must not specify this prop in Panel itself
     */
    appearance: PropTypes.oneOf(appearances),
    /**
     * Disabled state of Panel. Note it will set css "pointer-events" to "none" when set to "true"
     */
    disabled: PropTypes.bool,
    /**
     * Panel is opened when set to "true". Note that you must not specify this prop in Panel itself
     */
    opened: PropTypes.bool,
    /**
     * Use this prop to specify Panel's title. Any valid React node
     */
    title: PropTypes.node,
    /**
     * Use this prop to specify Panel's content. Any valid React node
     */
    children: PropTypes.node,
    /**
     * Fires an event on Panel click((event: Event) => void)
     */
    onClick: PropTypes.func,
    /**
     * Same as Collapse. Note that you must not specify this prop in Panel itself
     */
    expandIcon: PropTypes.func,
    /**
     * Hides the Panel icon when set to "false"
     */
    showIcon: PropTypes.bool,
    /**
     * Additional className
     */
    className: PropTypes.string,
    /**
     * Right action bar. Any valid React node
     */
    rightAction: PropTypes.node
};

Panel.defaultProps = {
    disabled: false,
    showIcon: true
};

export default Panel;
