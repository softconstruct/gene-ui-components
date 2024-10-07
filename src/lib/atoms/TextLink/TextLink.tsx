import React, { FC } from 'react';

// Styles
import './TextLink.scss';
import classNames from 'classnames';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: 16 | 20 | 24 | 28 | 32 | 48;
    color?: string;
}

interface ITextLinkProps {
    /**
     * fill the description
     */
    text: string;
    /**
     * fill the description
     */
    href?: string;
    /**
     * fill the description
     */
    iconBefore?: boolean;
    /**
     * fill the description.
     */
    rel?: 'none' | 'nofollow';
    /**
     * fill the description.<br>
     * Default is <code> self </code> <br>
     * Possible values: <code> self | blank  </code>
     */
    target?: 'self' | 'blank';
    /**
     * fill the description.
     */
    underline?: boolean;
    /**
     * fill the description. <br/>
     * Possible values: <code>primary | secondary | inverse </code>
     */
    appearance?: 'primary' | 'secondary' | 'inverse';
    /**
     * fill the description.
     */
    disabled?: boolean;
    /**
     * fill the description
     */
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    /**
     * Indicates whether the component is in a loading state. When set to true a skeleton indicator will be shown instead of the component.
     */
    isLoading?: boolean;
    /**
     * fill the description.
     */
    Icon?: React.FC<IconProps>; //todo need to change to interface IconProps after Icon new version release
}

/**
 * A link is styled text that navigates users to another location, either within the current experience or to a different app or website.
 */
const TextLink: FC<ITextLinkProps> = ({
    text = 'LinkText',
    href,
    iconBefore,
    rel,
    target = 'self',
    underline,
    appearance = 'primary',
    disabled,
    onClick,
    isLoading,
    Icon
}) => (
    <>
        {isLoading ? (
            <span>skeleton</span>
        ) : (
            <a
                target={`_${target}`}
                rel={rel}
                className={classNames(`textLink textLink_color_${appearance}`, {
                    textLink_underline: underline,
                    textLink_disabled: disabled,
                    textLink_iconBefore: iconBefore
                })}
                href={href}
                onClick={onClick}
            >
                <span className="textLink__text">{text}</span>
                {Icon && (
                    <span className="textLink__icon">
                        {' '}
                        <Icon size={20} />
                    </span>
                )}
            </a>
        )}
    </>
);

export { ITextLinkProps, TextLink as default };
