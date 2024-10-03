import React, { FC, useRef } from 'react';
import { InfoOutline } from '@geneui/icons';
import classnames from 'classnames';

// Components
import Tooltip from '../../molecules/Tooltip';

// Hooks
import { useEllipsisDetection } from '../../../hooks';

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
    labelText: string;
    /**
     * Indicates whether the label represents a required field.
     * When set to `true`, a visual indicator (asterisk) will be added to denote that the field is required.
     */
    required?: boolean;
    /**
     * Additional informational text displayed alongside the label.
     * When provided, an info icon will be displayed next to the label,
     * which can be hovered over to reveal the additional context or instructions via a tooltip.
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
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

const iconSizes = {
    small: 16,
    medium: 20
} as const;

/**
 * Labels identify a component or group of components. Use them with elements such as checkboxes and input fields to guide users in providing specific information, or with plain text to organize information.
 */

const Label: FC<ILabelProps> = ({
    htmlFor,
    size = 'medium',
    labelText,
    disabled,
    required,
    infoText,
    isLoading,
    className
}) => {
    const labelRef = useRef<HTMLLabelElement | null>(null);

    const isTruncated: boolean = useEllipsisDetection(labelRef);

    return (
        <div className={classnames(`label`, className)}>
            {isLoading ? (
                'skeleton'
            ) : (
                <>
                    <Tooltip text={labelText} isVisible={isTruncated}>
                        <>
                            <label
                                ref={labelRef}
                                htmlFor={htmlFor}
                                className={classnames('ellipsis-text', `label__text label__text_size_${size}`, {
                                    label__text_disabled: disabled
                                })}
                            >
                                {labelText}
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
                            <InfoOutline
                                className={classnames(`label__icon`, {
                                    label__icon_disabled: disabled
                                })}
                                size={iconSizes[size]}
                            />
                        </Tooltip>
                    )}
                </>
            )}
        </div>
    );
};

export { ILabelProps, Label as default };
