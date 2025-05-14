import React, { FC, PropsWithChildren } from "react";

const PopoverFooterActions: FC<PropsWithChildren> = ({ children }) => {
    return <div className="popover__footer_buttons">{children}</div>;
};
export default PopoverFooterActions;
