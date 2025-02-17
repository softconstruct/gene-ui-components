import React, { FC, PropsWithChildren } from "react";

const PopoverFooterActions: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="popover__footer_buttons">
            <div className="popover__footer_buttons">{children}</div>
        </div>
    );
};
export default PopoverFooterActions;
