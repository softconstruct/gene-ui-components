import React, { cloneElement, forwardRef, JSX, KeyboardEvent, MouseEvent } from 'react';

// Styles
import './Button.scss';
import classNames from 'classnames';
import { Download } from 'lucide-react';

interface IButtonProps {
    /**
     * Specifies the name of the button, which can be useful for form submission to identify which button was clicked.
     */
    name?: string;
    /**
     * Loader size <br/>
     * Possible values: <code>large | medium | small</code>
     */
    size?: 'large' | 'medium' | 'small';
    /**
     * If set to true, the button will stretch to occupy the full width of its container.
     */
    fullWidth?: boolean;
    /**
     * Indicates whether the button is disabled, preventing user interaction. When true, the button appears dimmed and cannot be clicked.
     */
    disabled?: boolean;
    /**
     * Loader type <br/>
     * Possible values: <code>fill | outline | text </code>
     */
    type?: 'fill' | 'outline' | 'text';
    /**
     * Loader color <br/>
     * Possible values: <code>primary | secondary | danger | success | inverse | transparent</code>
     */
    appearance?: 'primary' | 'secondary' | 'danger' | 'success' | 'inverse' | 'transparent';
    /**
     * The text to be displayed on the button.
     */
    text?: string;
    /**
     * Icon which we visible in the button.
     */
    Icon?: JSX.Element;
    /**
     * A callback function that is called when the button is clicked. It receives an argument containing the event object, which can be a mouse or keyboard event.
     */
    onClick?: (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
    /**
     * Show icon after text
     */
    isIconAfter?: boolean;

    isLoading?: boolean;
}

/**
 * Button initiates an action or event. Use buttons for key actions like submitting a form, saving changes, or advancing to the next step.
 */
const Button = forwardRef<HTMLButtonElement, IButtonProps>(
    (
        {
            appearance = 'primary',
            disabled,
            fullWidth,
            name,
            size = 'medium',
            type = 'fill',
            text,
            Icon = <Download />,
            onClick,
            isIconAfter
        }: IButtonProps,
        ref
    ) => {
        {
        }
        return (
            <button
                ref={ref}
                name={name}
                type="button"
                onClick={onClick}
                className={classNames(`button button_size_${size} button_color_${appearance} button_type_${type}`, {
                    button_full_width: fullWidth,
                    button_icon_before: !isIconAfter,
                    button_icon_after: isIconAfter,
                    button_icon_only: !text
                })}
                disabled={disabled}
            >
                {Icon &&
                    cloneElement(Icon, {
                        className: 'button__icon'
                    })}

                {text && <span className="button__text ellipsis-text">{text}</span>}
            </button>
        );
    }
);

export { IButtonProps, Button as default };
