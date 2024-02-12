import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as classNames from 'classnames';
import { callAfterDelay } from 'utils';
import useHover from '../../../hooks/useHover';
import { Icon, Tooltip } from '../../../index';

import './copy.scss';

interface ICopyProps {
    /**
     * Size of the icon: 'small', 'medium', 'big',
     */
    size?: 'small' | 'medium' | 'big';
    /**
     * Additional CSS class name(s) to apply to the icon for styling
     */
    className?: string;
    /**
     * Reference to the content you want to copy
     */
    contentRef?: React.RefObject<HTMLElement>;
    /**
     * Determines whether the copy icon is displayed only on hover.
     */
    displayOnHover?: boolean;
    /**
     * Tooltip text to display when the copy action is available.
     */
    copyTooltipText?: string;
    /**
     * Tooltip text to display when the copy action has been performed.
     */
    copiedTooltipText?: string;
    /**
     * The value to copy. If specified, this will be copied instead of the content referenced by contentRef.
     */
    value?: string;
    /**
     * Determines the visibility state of the copy icon. If true, the icon is visible regardless of hover or controlled visibility.
     */
    isVisible?: boolean;
}

const Copy: React.FC<ICopyProps> = ({
    size,
    value,
    isVisible,
    className,
    contentRef,
    displayOnHover,
    copyTooltipText,
    copiedTooltipText
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isControlledVisibility, setIsControlledVisibility] = useState(false);
    const isHovered: boolean = contentRef ? useHover(contentRef) : false;

    useEffect(() => setIsControlledVisibility(isVisible !== undefined), [isVisible]);

    const copyContent = useCallback(() => {
        if ((value || contentRef?.current) && !isCopied) {
            const content = contentRef?.current?.innerText || value;

            navigator.clipboard
                .writeText(content)
                .then(() => {
                    setIsCopied(true);
                    callAfterDelay(() => {
                        setIsCopied(false);
                    }, 2000);
                })
                .catch((error) => console.error('Failed to copy:', error));
        }
    }, [contentRef, isCopied, value]);

    return (
        <Tooltip title={isCopied ? copiedTooltipText : copyTooltipText} isVisible={true}>
            <div
                className={classNames('copy', className, {
                    copy__displayOnHover: displayOnHover && !value,
                    'copy__displayOnHover-show': isHovered && !value && !isControlledVisibility,
                    'copy-pointerNon': isCopied,
                    'copy-controlVisibility': isControlledVisibility,
                    ...(isControlledVisibility ? { 'copy-isVisible': isVisible } : {})
                })}
                onClick={copyContent}
            >
                <Icon
                    className={classNames('copy__icon', `copy__icon-${size}`)}
                    type={isCopied ? 'bc-icon-checkbox-checked' : 'bc-icon-copy-mirror'}
                />
            </div>
        </Tooltip>
    );
};

Copy.defaultProps = {
    size: 'medium',
    displayOnHover: false,
    copyTooltipText: 'Copy',
    copiedTooltipText: 'Copied!'
};

Copy.displayName = 'Copy';

export { ICopyProps, Copy as default };
