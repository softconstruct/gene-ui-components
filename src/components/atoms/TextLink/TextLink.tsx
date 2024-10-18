import React, { FC } from 'react';
import classNames from 'classnames';

// Styles
import './TextLink.scss';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: 16 | 20 | 24 | 28 | 32 | 48;
    color?: string;
}

interface ITextLinkProps {
    /**
     * Main visible content in the link.
     */
    text: string;
    /**
     * The URL address where will be redirected a user.
     */
    href: string;
    /**
     * if `Icon` provided, it will be visible after the text by default.
     * When `true`, the icon appears before the text.
     */
    iconBefore?: boolean;
    /**
     * Specifies the relationship between the current document and the linked resource.<br>
     * Possible values: <code> none | nofollow  </code>
     */
    rel?: 'none' | 'nofollow';
    /**
     * Specifies where to open the linked document.<br>
     * Default is <code> self </code> <br>
     * Possible values: <code> self | blank  </code>
     */
    target?: 'self' | 'blank';
    /**
     * Determines whether to underline the link text.
     * When `true`, the text will be underlined.
     */
    underline?: boolean;
    /**
     * Specifies the appearance of the link. <br>
     * Possible values: <code>primary | secondary | inverse </code>
     */
    appearance?: 'primary' | 'secondary' | 'inverse';
    /**
     * When `true`, the link is disabled and not clickable.
     */
    disabled?: boolean;
    /**
     * Function that will called after user click or press enter button.
     * Receives the event as an argument.
     */
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    /**
     * Indicates whether the component is in a loading state.
     * When set to `true` a skeleton indicator will be shown instead of the component.
     */
    isLoading?: boolean;
    /**
     * An optional icon to display alongside the link text.
     */
    Icon?: React.FC<IconProps>; //todo need to change to interface IconProps after Icon new version release
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * A link is styled text that navigates users to another location, either within the current experience or to a different app or website.
 */
const TextLink: FC<ITextLinkProps> = ({
    text,
    href,
    iconBefore,
    rel,
    target = 'self',
    underline,
    appearance = 'primary',
    disabled,
    onClick,
    isLoading,
    Icon,
    className
}) => (
    <>
        {isLoading ? (
            <span>skeleton</span>
        ) : (
            <a
                target={`_${target}`}
                rel={rel}
                className={classNames(`textLink textLink_color_${appearance}`, className, {
                    textLink_underline: underline,
                    textLink_disabled: disabled
                })}
                href={href}
                onClick={onClick}
                {...(disabled && { tabIndex: -1 })}
            >
                <span className="textLink__text">
                    {Icon && iconBefore && <Icon className="textLink__icon textLink__icon_before" size={20} />}
                    {text}
                    {Icon && !iconBefore && <Icon className="textLink__icon textLink__icon_after" size={20} />}
                </span>
            </a>
        )}
    </>
);

export { ITextLinkProps, TextLink as default };
