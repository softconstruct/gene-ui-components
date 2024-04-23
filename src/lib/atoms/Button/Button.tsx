import React, { FC, HTMLAttributes, ReactNode, forwardRef } from 'react';
import classnames from 'classnames';

// Components
import Icon from '../Icon';

// Styles
import './Button.scss';

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
    /**
     * Any valid React node
     */
    children: ReactNode | string;
    /**
     * The way how the Button should be displayed <br/>
     * Possible values: `default | outline | minimal | grayscale | clean`
     */
    appearance?: 'default' | 'outline' | 'minimal' | 'grayscale' | 'clean';
    /**
     * Button size <br/>
     * Possible values: `default | medium | big`
     */
    size?: 'default' | 'medium' | 'big';
    /**
     * How to display inscription in relation to it's parent in Button <br/>
     * Possible values: `default | content-size | full-width`
     */
    flexibility: 'default' | 'content-size' | 'full-width';
    /**
     * Button color <br/>
     * Possible values: `primary | confirm | danger | default`
     */
    color?: 'primary' | 'confirm' | 'danger' | 'default';
    /**
     * Button children direction either from the start, or from the end <br/>
     * Possible values `start | end`
     */
    itemsDirection?: 'start' | 'end';
    /**
     * Button corner radius <br/>
     * Possible values `round | smooth`
     */
    cornerRadius?: 'round' | 'smooth';
    /**
     * The property will add an "Icon" as Button child. The valid values can be found in "Icon" atom
     */
    icon?: ReactNode | string;
    /**
     * Button disabled state
     */
    disabled?: boolean;
    /**
     * Button active state
     */
    active?: boolean;
    /**
     * Adding shadow to button
     */
    withShadow?: boolean;
    /**
     * Button additional className
     */
    className?: string;
    /**
     * Button text transforms to spinner
     */
    loading?: boolean;
    /**
     * aria-label for button.
     */
    ariaLabel?: string;
}

const Button: FC<IButtonProps> = forwardRef<HTMLButtonElement, IButtonProps>(
    (
        {
            children,
            appearance = 'default',
            size = 'default',
            flexibility = 'default',
            color = 'primary',
            cornerRadius = 'round',
            itemsDirection = 'start',
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
                {/*@ts-ignore*/}
                {icon && (loading ? <Icon type="bc-icon-loader" /> : <Icon type={icon} />)}
                {!noChildren &&
                    (!icon && loading ? (
                        <>
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

export default Button;
