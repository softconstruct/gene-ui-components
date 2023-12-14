import React, { useCallback, useMemo } from 'react';
import classnames from 'classnames';

import './LinkButton.scss';

// @ts-ignore
import { Icon } from 'components';
// @ts-ignore
import { noop } from 'utils';

interface ILinkButtonProps {
    /**
     * Href for <code>\<a\></code> tag if you don't pass instead of <code>\<a\></code> tag will be <code>\<button\></code> tag .
     */
    href?: string;
    /**
     * Fires event when user click on LinkButton.
     * <br>
     * <code>(event: Event) => void </code>
     */
    onClick?: (event: React.MouseEvent) => void;
    /**
     * Fires event when the element has been pressed.
     * <br>
     * <code>(event: Event) => void</code>
     */
    onMouseDown?: (event: React.MouseEvent) => void;
    /**
     * The LinkButton additional className.
     */
    className?: string;
    /**
     * Any valid React node.
     */
    children?: React.ReactNode;
    /**
     * Icon to render before the LinkButton. Should be an icon component's type.
     */
    iconBefore?: string;
    /**
     * Icon to render after the LinkButton. Should be an icon component's type.
     */
    iconAfter?: string;
    /**
     * Makes the LinkButton disabled.
     */
    isDisabled?: boolean;
    /**
     * aria-label for button or LinkButton.
     */
    ariaLabel?: string;
}

const LinkButton: React.FC<ILinkButtonProps> = ({
    href,
    onClick,
    children,
    iconAfter,
    className,
    iconBefore,
    isDisabled,
    onMouseDown,
    ariaLabel,
    ...restProps
}) => {
    const onClickHandler = useCallback((e: React.MouseEvent) => onClick?.(e), [onClick]);
    const onMouseDownHandler = useCallback((e: React.MouseEvent) => onMouseDown?.(e), [onMouseDown]);

    const attributes = useMemo(
        () => ({
            className: classnames('linkButton', { 'linkButton-disable': isDisabled }, className),
            onMouseDown: onMouseDownHandler,
            onClick: onClickHandler,
            ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
            ...restProps
        }),
        [isDisabled, className, onMouseDownHandler, onClickHandler, restProps]
    );

    const content = useMemo(
        () => (
            <>
                {iconBefore && <Icon type={iconBefore} className="linkButton__icon" />}
                {children}
                {iconAfter && <Icon type={iconAfter} className="linkButton__icon" />}
            </>
        ),
        [iconBefore, children, iconAfter]
    );

    return (
        <>
            {href ? (
                <a {...attributes} href={href}>
                    {content}
                </a>
            ) : (
                <button {...attributes} type="button">
                    {content}
                </button>
            )}
        </>
    );
};

LinkButton.defaultProps = {
    children: 'LinkButton example',
    isDisabled: false,
    onMouseDown: noop
};

LinkButton.displayName = 'LinkButton';

export { ILinkButtonProps, LinkButton as default };
