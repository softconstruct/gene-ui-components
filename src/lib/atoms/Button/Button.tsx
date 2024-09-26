import React, { cloneElement, forwardRef, JSX, KeyboardEvent, MouseEvent } from 'react';
import classNames from 'classnames';
import { Globe } from '@geneui/icons';

// Styles
import './Button.scss';
import Loader from '../Loader';

interface IButtonProps {
    /**
     * Specifies the name of the `button`, which can be useful for form submission to identify which button was clicked.
     */
    name?: string;
    /**
     * Button size <br/>
     * Possible values: `large | medium | small`
     */
    size?: 'large' | 'medium' | 'small';
    /**
     * If set to `true`, the `button` will stretch to occupy the full width of its container.
     */
    fullWidth?: boolean;
    /**
     * Indicates whether the `button` is `disabled`, preventing user interaction. When `true`, the `button` appears dimmed and can not be clicked.
     */
    disabled?: boolean;
    /**
     * Button type <br/>
     * Possible values: `fill | outline | text`
     */
    type?: 'fill' | 'outline' | 'text';
    /**
     * Button visual style <br/>
     * Possible values: `primary | secondary | danger | success | inverse | transparent`
     */
    appearance?: 'primary' | 'secondary' | 'danger' | 'success' | 'inverse' | 'transparent';
    /**
     * The text to be displayed on the `button`.
     */
    text?: string;
    /**
     * Button icon <br/>
     * The `Icon` prop accepts a JSX element that will be displayed alongside the divider
     */
    Icon?: JSX.Element;
    /**
     * A callback function that is called when the `button` is clicked. It receives an argument containing the event object, which can be a mouse or keyboard event.
     */
    onClick?: (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
    /**
     * Button icon position
     * If the `isIconAfter` is set as `true` the `Icon` will be shown after the `text` otherwise before the `text`.
     */
    isIconAfter?: boolean;
    /**
     * The prop responsible for showing the loading spinner if passed `true`. The default value is `false`
     */
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
            Icon = <Globe />,
            onClick,
            isIconAfter
        }: IButtonProps,
        ref
    ) => {
        const iconClassName = Icon.props?.className || '';

        return (
            <button
                ref={ref}
                name={name}
                type="button"
                onClick={onClick}
                className={classNames(
                    `button button_size_${size} button_color_${appearance} button_type_${type} button_loading`,
                    {
                        button_full_width: fullWidth,
                        button_icon_before: !isIconAfter,
                        button_icon_after: isIconAfter,
                        button_icon_only: !text
                    }
                )}
                disabled={disabled}
            >
                <Loader className={'button__loader'} size="smallNudge" />

                {Icon &&
                    cloneElement(Icon, {
                        className: `${iconClassName} button__icon`
                    })}

                {text && <span className="button__text ellipsis-text">{text}</span>}
            </button>
        );
    }
);

export { IButtonProps, Button as default };
