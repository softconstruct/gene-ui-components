import React, { FC, PropsWithChildren } from "react";
import classNames from "classnames";

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
}

const PopoverBody: FC<IPopoverBodyProps> = ({ children, withPadding = true, className }) => {
    return (
        <div className={classNames("popover__body", { popover__body_withPadding: withPadding }, className)}>
            <div className="popover__content">{children} </div>
        </div>
    );
};

export default PopoverBody;
