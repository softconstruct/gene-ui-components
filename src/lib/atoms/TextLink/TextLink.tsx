import React, { FC, ReactNode } from 'react';

// Styles
import './TextLink.scss';
import classNames from 'classnames';

import { Link } from 'lucide-react';

interface ITextLinkProps {
    /**
     * Specifies a link URL.
     */
    href?: string;
    /**
     * Link is a wrapper around components (or children), most commonly text, so that they become hyperlinks.
     */
    children: ReactNode;
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
}

/**
 * A link is styled text that navigates users to another location, either within the current experience or to a different app or website.
 */
const TextLink: FC<ITextLinkProps> = ({
    rel,
    target,
    underline,
    children = 'LinkText',
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
        {Icon && Icon}
        <span className="textLink__text">{children}</span>
    </a>
);

export { ITextLinkProps, TextLink as default };
