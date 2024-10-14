import React, { FC, forwardRef, MouseEvent } from 'react';
import classNames from 'classnames';
import { IconProps } from '@geneui/icons';

// Styles
import './Button.scss';
import Loader from '../Loader';

interface IButtonProps {
    /**
     * Specifies the name of the `button`, which can be useful for form submission to identify which button was clicked.
     */
    name?: string;
    /**
     * Size <br>
     * Possible values: `large | medium | small`
     */
    size?: 'large' | 'medium' | 'small';
    /**
     * If `true`, the `button` will stretch to occupy the full width of its container.
     */
    fullWidth?: boolean;
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * Affect form styling point of view. <br>
     * Possible values: `fill | outline | text`
     */
    type?: 'fill' | 'outline' | 'text';
    /**
     * Indicates the action meaning. <br>
     * Possible values: `primary | secondary | danger | success | inverse | transparent`
     */
    appearance?: 'primary' | 'secondary' | 'danger' | 'success' | 'inverse' | 'transparent';
    /**
     * The text will shown as content of the `button`.
     */
    text?: string;
    /**
     * The `Icon` prop accepts a React Functional Component that will be displayed alongside the button text.
     */
    Icon?: FC<IconProps>;
    /**
     * A callback function that is called when the `button` is clicked or entered. <br>
     * It receives an argument containing the event object, which can be a mouse or keyboard event.
     */
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Icon position <br>
     * If the prop is `true` the `Icon` will be shown after the `text` otherwise before the `text`.
     */
    iconAfter?: boolean;
    /**
     * The prop responsible for showing the loading spinner if passed `true`. The default value is `false`
     */
    isLoading?: boolean;
    /**
     * Additional className
     */
    className?: string;
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
            Icon,
            onClick,
            className = '',
            iconAfter,
            isLoading
        }: IButtonProps,
        ref
    ) => {
        const loadingTypes = {
            primary: 'inverse',
            secondary: 'neutral',
            danger: 'neutral',
            success: 'neutral',
            transparent: 'inverse'
        };

        return (
            <button
                ref={ref}
                name={name}
                type="button"
                onClick={onClick}
                className={classNames(
                    `button button_size_${size} button_color_${appearance} button_type_${type} ${className}`,
                    {
                        button_fullWidth: fullWidth,
                        button_icon_before: !iconAfter,
                        button_icon_after: iconAfter,
                        button_icon_only: !text,
                        button_loading: isLoading
                    }
                )}
                disabled={disabled}
            >
                {isLoading && (
                    <Loader size="smallNudge" className="button__loader" appearance={loadingTypes[appearance]} />
                )}

                {Icon && (
                    <span className="button__icon">
                        <Icon size={16} />
                    </span>
                )}

                {text && <span className="button__text ellipsis-text">{text}</span>}
            </button>
        );
    }
);

export { IButtonProps, Button as default };
