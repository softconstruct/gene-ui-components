import React, { FC, PropsWithChildren } from "react";
import classNames from "classnames";

interface IPopoverBodyProps extends PropsWithChildren {
    /**
     * By default the PopoverBody has <code>--guit-ref-spacing-large</code> padding.
     *
     */
    withPadding?: boolean;
}

const PopoverBody: FC<IPopoverBodyProps> = ({ children, withPadding = true }) => {
    return (
        <div className={classNames("popover__body", { popover__body_withPadding: withPadding })}>
            <div className="popover__content">{children} </div>
        </div>
    );
};

export default PopoverBody;
