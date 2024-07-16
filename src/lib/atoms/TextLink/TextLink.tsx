import React, { FC } from 'react';

// Styles
import './TextLink.scss';

interface ITextLinkProps {
    /**
     * type description
     */
    type?: unknown;
}

/**
 * A link is styled text that navigates users to another location, either within the current experience or to a different app or website.
 */
const TextLink: FC<ITextLinkProps> = ({ type }) => {
    return <div className="textLink">TextLink</div>;
};

export { ITextLinkProps, TextLink as default };
