import React, { FC, useRef } from 'react';
import classnames from 'classnames';

//Hooks
import { useEllipsisDetection } from '../../../index';

//Components
import { Icon, Tooltip } from '../../../index';

// Styles
import './HelperText.scss';

interface IHelperTextProps {
    /**
     * Defines the size of the helper text.<br>
     * Possible values: `medium | small`.
     */
    size?: 'medium' | 'small';
    /**
     * Specifies the type of the helper text. <br>
     * Possible values: `rest | danger | warning`.
     * `rest` for default information, `danger` for error messages, or `warning` for cautions.
     */
    type?: 'rest' | 'danger' | 'warning';
    /**
     * The actual text content to be displayed as helper text.
     * This provides guidance or additional information related to the input field.
     */
    text: string;
    /**
     * Optional. Icon to be displayed alongside the helper text.
     * If not provided, a default icon will be used based on the `type` prop.
     */
    icon?: string;
    /**
     * Determines whether the helper text is disabled.
     * If `true`, the helper text will appear dimmed and non-interactive.
     */
    isDisabled?: boolean;
    /**
     * Indicates whether the component is in a loading state.
     * When `true`, a loading skeleton is displayed instead of the actual helper text.
     */
    isLoading?: boolean;
}

/**
 * The Helper Text provides users with additional information or guidance related to a specific input field in a form. This text helps users understand the expected format, requirements, or purpose of the input, thereby improving form completion accuracy and user confidence.
 */
const HelperText: FC<IHelperTextProps> = ({ size = 'medium', type = 'rest', text, icon, isDisabled, isLoading }) => {
    const textRef = useRef(null);
    const isTruncated = useEllipsisDetection(textRef);

    //temp solution , need to change after icons release
    const iconMock =
        type === 'danger' ? (
            <Icon type={'bc-icon-info-48'} />
        ) : type === 'warning' ? (
            <Icon type={'bc-icon-strong-opinion-36'} />
        ) : (
            <Icon type={icon || 'bc-icon-blank'} />
        );

    return (
        <div
            className={classnames(`helperText helperText_type_${type} helperText_size_${size}`, {
                helperText_disabled: isDisabled
            })}
        >
            {isLoading ? (
                'skeleton'
            ) : (
                <>
                    <div className="helperText__icon">{iconMock}</div>
                    <Tooltip text={text} isVisible={isTruncated}>
                        <p className="helperText__text ellipsis-text" ref={textRef}>
                            {text}
                        </p>
                    </Tooltip>
                </>
            )}
        </div>
    );
};

export { IHelperTextProps, HelperText as default };
