import React, { FC, ReactNode } from 'react';

// Styles
import './TextLink.scss';
import classNames from 'classnames';

import { Link } from 'lucide-react';

interface ITextLinkProps {
    /**
     * fill the description
     */
    text: string;
    /**
     * Specifies a link URL.
     */
    href?: string;
    /**
     * rovides hints for SEO.
     */
    rel?: 'none' | 'nofollow';
    /**
     * When underline is supplied, we override the underline style internally managed by the component.
     */
    underline?: boolean;
    /**
     * Indicates the browsing context where an href will be opened:
     * Possible values: <code>self | blank</code>
     */
    target?: 'self' | 'blank';
    /**
     * TextLink color <br/>
     * Possible values: <code>primary | secondary | inverse </code>
     */
    appearance?: 'primary' | 'secondary' | 'inverse';
    /**
     * Indicates whether the button is disabled, preventing user interaction. When true, the button appears dimmed and cannot be clicked.
     */
    disabled?: boolean;
    /**
     * Icon which we visible in the component.
     */
    Icon?: ReactNode;
    /**
     * Callback invoked when the user clicks (press and release) on ButtonLink with the mouse or keyboard.
     */
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    /**
     * Callback triggered when the element gains focus.
     */
    onFocus?: (e: React.FocusEvent<HTMLAnchorElement>) => void;

    /**
     * show skeleton
     */
    skeleton?: boolean;
}

/**
 * A link is styled text that navigates users to another location, either within the current experience or to a different app or website.
 */
const TextLink: FC<ITextLinkProps> = ({
    text = 'LinkText',
    rel,
    target,
    underline,
    href,
    appearance,
    disabled,
    onFocus,
    onClick,
    Icon = <Link />
}) => (
    <a
        target={`_${target}`}
        rel={rel}
        className={classNames(`textLink textLink_color_${appearance}`, {
            textLink_underline: underline,
            textLink_disabled: disabled
        })}
        href={href}
        onFocus={onFocus}
        onClick={onClick}
    >
        <span className="textLink__text">{text}</span>
        <span className="textLink__icon">{Icon && Icon}</span>
    </a>
);

export { ITextLinkProps, TextLink as default };
