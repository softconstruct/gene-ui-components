import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.scss';
import Icon from '../Icon';
import { noop } from '../../../utils';

function LinkButton({
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
}) {
    const onClickHandler = useCallback((e) => onClick(e), [href]);
    const onMouseDownHandler = useCallback((e) => onMouseDown(e), [href]);

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
}

LinkButton.propTypes = {
    /**
     * Href for <code>\<a\></code> tag if you don't pass instead of <code>\<a\></code> tag will be <code>\<button\></code> tag .
     */
    href: PropTypes.string,
    /**
     * Fires event when user click on LinkButton.
     * <br>
     * <code>(event: Event) => void </code>
     */
    onClick: PropTypes.func,
    /**
     * Fires event when the element has been pressed.
     * <br>
     * <code>(event: Event) => void</code>
     */
    onMouseDown: PropTypes.func,
    /**
     * The LinkButton additional className.
     */
    className: PropTypes.string,
    /**
     * Any valid React node.
     */
    children: PropTypes.node,
    /**
     * Icon to render before the LinkButton. Should be an icon component's type.
     */
    iconBefore: PropTypes.string,
    /**
     * Icon to render after the LinkButton. Should be an icon component's type.
     */
    iconAfter: PropTypes.string,
    /**
     * Makes the LinkButton disabled.
     */
    isDisabled: PropTypes.bool,
    /**
     * aria-label for button or LinkButton.
     */
    ariaLabel: PropTypes.string
};

LinkButton.defaultProps = {
    children: 'LinkButton example',
    isDisabled: false,
    onMouseDown: noop
};

LinkButton.displayName = 'LinkButton';

export default LinkButton;
