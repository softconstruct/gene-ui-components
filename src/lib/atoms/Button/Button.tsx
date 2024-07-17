import React, { forwardRef } from 'react';

// Styles
import './Button.scss';
import { Icon } from '../../../index';

interface IButtonProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * Button initiates an action or event. Use buttons for key actions like submitting a form, saving changes, or advancing to the next step.
 */
const Button = forwardRef<unknown, IButtonProps>(({ size }: IButtonProps, ref) => {
    return (
        <div className="buttonTestHolder">
            <button type="button" className="button button_size_large button_color_primary button_type_fill">
                <Icon className="button__icon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                <span className="button__text">Button</span>
            </button>
            <button type="button" className="button button_size_large button_color_primary button_type_outline">
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
            </button>
        </div>
    );
});

export { IButtonProps, Button as default };
