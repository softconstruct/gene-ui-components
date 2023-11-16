import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from '../Icon';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

const Button = forwardRef(
    (
        {
            children,
            appearance,
            size,
            flexibility,
            color,
            itemsDirection,
            cornerRadius,
            icon,
            active,
            className,
            withShadow,
            loading,
            ariaLabel,
            ...restProps
        },
        ref
    ) => {
        const noChildren = !children && children !== 0;

        return (
            <button
                className={classnames(
                    'btn',
                    className,
                    `a-${appearance}`,
                    `s-${size}`,
                    `f-${flexibility}`,
                    `c-${color}`,
                    `id-${itemsDirection}`,
                    `cr-${cornerRadius}`,
                    {
                        active,
                        'c-icon': !!icon && noChildren,
                        'with-shadow': withShadow,
                        'loading-padding': !noChildren && !icon && loading
                    }
                )}
                ref={ref}
                {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
                {...restProps}
            >
                {icon && (loading ? <Icon type="bc-icon-loader" /> : <Icon type={icon} />)}
                {!noChildren &&
                    (!icon && loading ? (
                        <>
                            <Icon type="bc-icon-loader" />
                            <span>{children}</span>
                        </>
                    ) : (
                        <span className="ellipsis-text">{children}</span>
                    ))}
                {loading && noChildren && (
                    <div className="btn-loader-holder">
                        <Icon type="bc-icon-loader" />
                    </div>
                )}
            </button>
        );
    }
);

const ButtonConfig = {
    appearance: ['default', 'outline', 'minimal', 'grayscale', 'clean'],
    size: ['default', 'medium', 'big'],
    color: ['primary', 'confirm', 'danger', 'default'],
    flexibility: ['default', 'content-size', 'full-width'],
    itemsDirection: ['start', 'end'],
    cornerRadius: ['round', 'smooth']
};

Button.propTypes = {
    /**
     * Any valid React node
     */
    children: PropTypes.node,
    /**
     * The way how the Button should be displayed
     */
    appearance: PropTypes.oneOf(ButtonConfig.appearance),
    /**
     * Button size
     */
    size: PropTypes.oneOf(ButtonConfig.size),
    /**
     * How to display inscription in relation to it's parent in Button
     */
    flexibility: PropTypes.oneOf(ButtonConfig.flexibility),
    /**
     * Button color
     */
    color: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(ButtonConfig.color)]),
    /**
     * Button children direction either from the start, or from the end
     */
    itemsDirection: PropTypes.oneOf(ButtonConfig.itemsDirection),
    /**
     * Button corner radius
     */
    cornerRadius: PropTypes.oneOf(ButtonConfig.cornerRadius),
    /**
     * The property will add an "Icon" as Button child. The valid values can be found in "Icon" atom
     */
    icon: PropTypes.string,
    /**
     * Button disabled state
     */
    disabled: PropTypes.bool,
    /**
     * Button active state
     */
    active: PropTypes.bool,
    /**
     * Adding shadow to button
     */
    withShadow: PropTypes.bool,
    /**
     * Button additianl className
     */
    className: PropTypes.string,
    /**
     * Button text transforms to spinner
     */
    loading: PropTypes.bool,
    /**
     * aria-label for button.
     */
    ariaLabel: PropTypes.string
};

Button.defaultProps = {
    appearance: ButtonConfig.appearance[0],
    size: ButtonConfig.size[0],
    flexibility: ButtonConfig.flexibility[0],
    color: ButtonConfig.color[0],
    itemsDirection: ButtonConfig.itemsDirection[0],
    cornerRadius: ButtonConfig.cornerRadius[0]
};

Button.displayName = 'Button';

export default Button;
