import React, { useCallback, useState, RefObject, FC, useMemo } from 'react';
import classnames from 'classnames';

// Helpers
// @ts-ignore
import { callAfterDelay } from 'utils';

// Hooks
// @ts-ignore
import { useHover } from 'hooks';

// Components
// @ts-ignore
import Icon from '../../atoms/Icon';
import Tooltip from '../../molecules/Tooltip';

// Styles
import './Copy.scss';

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
    contentRef?: RefObject<HTMLElement>;
    /**
     * Determines whether the copy icon is displayed only on hover.
     */
    showOnHover?: boolean;
    /**
     * Tooltip text to display when the copy action is available. It will be shown when the user hovers over the copy icon.
     */
    copyTooltipText?: string;
    /**
     * Tooltip text to display when the copy action has been performed. It will be shown when the user clicks on the copy icon.
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

const Copy: FC<ICopyProps> = ({
    size,
    value,
    isVisible,
    className,
    contentRef,
    showOnHover,
    copyTooltipText,
    copiedTooltipText
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const isControlledVisibility = useMemo(() => isVisible !== undefined, [isVisible]);
    const isHovered: boolean = contentRef ? useHover(contentRef) : false;

    const copyContent = useCallback(() => {
        if (isCopied) return;

        const content = contentRef?.current?.innerText || value;

        if (!content) return;

        navigator.clipboard
            .writeText(content)
            .then(() => {
                setIsCopied(true);
                callAfterDelay(() => {
                    setIsCopied(false);
                }, 2000);
            })
            .catch((error) => console.error('Failed to copy:', error));
    }, [contentRef, isCopied, value]);

    return (
        // @ts-ignore
        <Tooltip title={isCopied ? copiedTooltipText : copyTooltipText} isVisible>
            <div
                className={classnames('copy', className, {
                    copy__showOnHover: showOnHover && !value,
                    'copy__showOnHover-show': isHovered && !value && !isControlledVisibility,
                    'copy-pointerNon': isCopied,
                    'copy-controlVisibility': isControlledVisibility,
                    ...(isControlledVisibility ? { 'copy-isVisible': isVisible } : {})
                })}
                onClick={copyContent}
            >
                {/*@ts-ignore*/}
                <Icon
                    className={`copy__icon copy__icon-${size}`}
                    type={isCopied ? 'bc-icon-checkbox-checked' : 'bc-icon-copy-mirror'}
                />
            </div>
        </Tooltip>
    );
};

Copy.defaultProps = {
    size: 'medium',
    showOnHover: false,
    copyTooltipText: 'Copy',
    copiedTooltipText: 'Copied!'
};

Copy.displayName = 'Copy';

export { ICopyProps, Copy as default };
