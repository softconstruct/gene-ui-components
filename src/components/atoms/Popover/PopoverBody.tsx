import React, { FC, PropsWithChildren } from "react";
import classNames from "classnames";

// Components
import Scrollbar from "@components/atoms/Scrollbar";

interface IPopoverBodyProps extends PropsWithChildren {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * By default the PopoverBody has <code>--guit-ref-spacing-large</code> padding.
     */
    withPadding?: boolean;
    /**
     * By default, the withScrollbar is <code>true</code>. Set withScrollbar <code>false</code> to return only children.
     */
    withScrollbar?: boolean;
}

const PopoverBody: FC<IPopoverBodyProps> = ({ children, withPadding = true, className, withScrollbar = true }) => {
    return (
        <div className={classNames("popover__body", { popover__body_withPadding: withPadding }, className)}>
            <div className="popover__content navigation__content">
                {withScrollbar ? <Scrollbar>{children}</Scrollbar> : children}
            </div>
        </div>
    );
};

export default PopoverBody;
