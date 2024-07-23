import React, { forwardRef } from 'react';

// Styles
import './Button.scss';
import { Icon } from '../../../index';

interface IButtonProps {
    /**
     * size description
     */
    name?: string;
    size?: 'large' | 'medium' | 'small';
    fullWidth?: boolean;
    disabled?: boolean;
    type?: 'fill' | 'outline' | 'text';
    color?: 'primary' | 'secondary' | 'danger' | 'success' | 'inverse' | 'transparent';
    text?: string;
    icon?: string;
    accessibilityLabel?: string;
}

/**
 * Button initiates an action or event. Use buttons for key actions like submitting a form, saving changes, or advancing to the next step.
 */
const Button = forwardRef<HTMLDivElement, IButtonProps>(
    (
        {
            color = 'primary',
            disabled,
            fullWidth,
            name,
            size = 'medium',
            type = 'fill',
            text,
            accessibilityLabel
        }: IButtonProps,
        ref
    ) => {
        return (
            <div className="buttonTestHolder" ref={ref} aria-label={accessibilityLabel}>
                {/* Add following classes for button
                    button_icon_before
                    button_icon_after
                    button_icon_only
                */}
                <button
                    name={name}
                    type="button"
                    className={`button button_size_${size} button_color_${color} button_type_${type}`}
                    disabled={disabled}
                >
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={disabled} isFilled={true} />
                    <span className="button__text">{text}</span>
                </button>
                {/* <button type="button" className="button button_size_large button_color_primary button_type_outline">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_primary button_type_text">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>

                <button type="button" className="button button_size_large button_color_secondary button_type_fill">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_secondary button_type_outline">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_secondary button_type_text">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>

                <button type="button" className="button button_size_large button_color_danger button_type_fill">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_danger button_type_outline">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_danger button_type_text">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>

                <button type="button" className="button button_size_large button_color_success button_type_fill">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_success button_type_outline">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_success button_type_text">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>

                <button type="button" className="button button_size_large button_color_inverse button_type_fill">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_inverse button_type_outline">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>
                <button type="button" className="button button_size_large button_color_inverse button_type_text">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button>

                <button type="button" className="button button_size_large button_color_transparent button_type_fill">
                    <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                    <span className="button__text">Button</span>
                </button> */}
            </div>
        );
    }
);

export { IButtonProps, Button as default };
