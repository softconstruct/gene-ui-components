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
    return (
        <div className="textLinkTestHolder">
            <a className="textLink textLink_color_primary" href="#">
                <span className="textLink__text">text link</span>
            </a>
            <a className="textLink textLink_underline textLink_color_primary" href="#">
                <span className="textLink__text">text link</span>
            </a>
            <a className="textLink textLink_disabled textLink_color_primary" href="#">
                <span className="textLink__text">text link</span>
            </a>
            <a className="textLink textLink_color_secondary" href="#">
                <span className="textLink__text">text link</span>
            </a>
            <a className="textLink textLink_underline textLink_color_secondary" href="#">
                <span className="textLink__text">text link</span>
            </a>
            <a className="textLink textLink_disabled textLink_color_secondary" href="#">
                <span className="textLink__text">text link</span>
            </a>
            <a className="textLink textLink_color_inverse" href="#">
                <span className="textLink__text">text link</span>
            </a>
            <a className="textLink textLink_underline textLink_color_inverse" href="#">
                <span className="textLink__text">text link</span>
            </a>
            <a className="textLink textLink_disabled textLink_color_inverse" href="#">
                <span className="textLink__text">text link</span>
            </a>
        </div>
    );
};

export { ITextLinkProps, TextLink as default };
