import React, { HTMLAttributes, ReactNode, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Icon from '../Icon';

// Styles
import './index.scss';
const ButtonConfig = {
    appearance: ['default', 'outline', 'minimal', 'grayscale', 'clean'],
    size: ['default', 'medium', 'big'],
    color: ['primary', 'confirm', 'danger', 'default'],
    flexibility: ['default', 'content-size', 'full-width'],
    itemsDirection: ['start', 'end'],
    cornerRadius: ['round', 'smooth']
} as const;
export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
    /**
     * Any valid React node
     */
    children: ReactNode | string;
    /**
     * The way how the Button should be displayed
     */
    appearance: (typeof ButtonConfig.appearance)[number];
    /**
     * Button size
     */
    size: (typeof ButtonConfig.size)[number];
    /**
     * How to display inscription in relation to it's parent in Button
     */
    flexibility: (typeof ButtonConfig.flexibility)[number];
    /**
     * Button color
     */
    color: (typeof ButtonConfig.color)[number] | string;
    /**
     * Button children direction either from the start, or from the end
     */
    itemsDirection: (typeof ButtonConfig.itemsDirection)[number];
    /**
     * Button corner radius
     */
    cornerRadius: (typeof ButtonConfig.cornerRadius)[number];
    /**
     * The property will add an "Icon" as Button child. The valid values can be found in "Icon" atom
     */
    icon: ReactNode;
    /**
     * Button disabled state
     */
    disabled: boolean;
    /**
     * Button active state
     */
    active: boolean;
    /**
     * Adding shadow to button
     */
    withShadow: boolean;
    /**
     * Button additianl className
     */
    className: string;
    /**
     * Button text transforms to spinner
     */
    loading: boolean;
    /**
     * aria-label for button.
     */
    ariaLabel: string;
}

const Button = forwardRef<HTMLButtonElement, Partial<IButtonProps>>(
    (
        {
            children,
            appearance = ButtonConfig.appearance[0],
            size = ButtonConfig.size[0],
            flexibility = ButtonConfig.flexibility[0],
            color = ButtonConfig.color[0],
            cornerRadius = ButtonConfig.cornerRadius[0],
            itemsDirection = ButtonConfig.itemsDirection[0],
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
        console.log(cornerRadius);

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
                {' '}
                {/*@ts-ignore*/}
                {icon && (loading ? <Icon type="bc-icon-loader" /> : <Icon type={icon} />)}
                {!noChildren &&
                    (!icon && loading ? (
                        <>
                            {' '}
                            {/*@ts-ignore*/}
                            <Icon type="bc-icon-loader" />
                            <span>{children}</span>
                        </>
                    ) : (
                        <span className="ellipsis-text">{children}</span>
                    ))}
                {loading && noChildren && (
                    <div className="btn-loader-holder">
                        {/*@ts-ignore*/}
                        <Icon type="bc-icon-loader" />
                    </div>
                )}
            </button>
        );
    }
);

Button.propTypes = {};
Button.defaultProps = {};

Button.displayName = 'Button';

export default Button;
