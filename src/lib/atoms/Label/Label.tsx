import React, { FC, HTMLAttributes, useRef } from 'react';
import classnames from 'classnames';
// @ts-ignore
import { useEllipsisDetection } from 'hooks';

// Components
import { Tooltip, Icon } from '../../../index';

// Styles
import './Label.scss';

interface ILabelProps {
    /**
     * The `htmlFor` prop is associated with the `id` of the input element.
     * If `Label` component is used with a form element this prop is required.
     */
    htmlFor?: string;
    /**
     * Label size.<br/>
     * Possible values: `medium | small`
     */
    size?: 'medium' | 'small';
    /**
     * The text content of the `label`.
     * This is the main text displayed within the `label`.
     */
    children: string;
    /**
     * Indicates whether the `label` is for a `required` field.
     * When set to `true`, a visual indicator (asterisk) will be added to denote that the field is required.
     */
    required?: boolean;
    /**
     * Additional informational text displayed alongside the label.
     * This property can be used to provide extra context or instructions for the input field.
     */
    infoText?: string;
    /**
     * Indicates whether the `label` should be displayed as `disabled`.
     * When set to `true`, the `label` will be styled to appear `disabled`, which can indicate that the associated input field is not editable.
     */
    disabled?: boolean;
    /**
     * Indicates whether the `label` is in a loading state.
     * When set to `true` a `skeleton` indicator will be shown instead of the `label` text.
     */
    isLoading?: boolean;
    /**
     * Custom `class` name(s) for the `label`.
     * This allows for additional styling and customization of the `label` component.
     */
    className?: string;
}

/**
 * Labels identify a component or group of components. Use them with elements such as checkboxes and input fields to guide users in providing specific information, or with plain text to organize information.
 */

const Label: FC<ILabelProps> = ({
    htmlFor,
    size = 'medium',
    children,
    disabled,
    required,
    infoText,
    isLoading,
    className,
    ...restProps
}) => {
    const labelRef = useRef<HTMLLabelElement | null>(null);

    const isTruncated: boolean = useEllipsisDetection(labelRef);

    return (
        <div {...restProps} className={`label ${className || ''}`}>
            {isLoading ? (
                'skeleton'
            ) : (
                <>
                    <Tooltip text={children} isVisible={isTruncated}>
                        <>
                            <label
                                ref={labelRef}
                                htmlFor={htmlFor}
                                className={classnames('ellipsis-text', `label__text label__text_size_${size}`, {
                                    label__text_disabled: disabled
                                })}
                            >
                                {children}
                            </label>
                            {required && (
                                <span
                                    className={classnames(`label__text label__text_size_${size}`, {
                                        label__text_disabled: disabled
                                    })}
                                >
                                    *
                                </span>
                            )}
                        </>
                    </Tooltip>
                    {infoText && (
                        <Tooltip text={infoText}>
                            <Icon
                                className={classnames('label__icon', { label__icon_disabled: disabled })}
                                type={'bc-icon-info'}
                                disabled={disabled}
                            />
                        </Tooltip>
                    )}
                </>
            )}
        </div>
    );
};

export { ILabelProps, Label as default };
