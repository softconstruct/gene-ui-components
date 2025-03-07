import React, { forwardRef, PropsWithChildren } from "react";
import classNames from "classnames";

interface IPopoverBodyProps extends PropsWithChildren {
    /**
     * By default the PopoverBody has <code>--guit-ref-spacing-large</code> padding.
     *
     */
    withPadding?: boolean;
}

const PopoverBody = forwardRef<HTMLDivElement, IPopoverBodyProps>(
    ({ children, withPadding = true }: IPopoverBodyProps, ref) => {
        return (
            <div className={classNames("popover__body", { popover__body_withPadding: withPadding })} ref={ref}>
                <div className="popover__content">{children} </div>
            </div>
        );
    }
);

export default PopoverBody;
