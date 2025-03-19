import React, { FC, PropsWithChildren } from "react";

const PopoverFooter: FC<PropsWithChildren> = ({ children }) => {
    return <div className="popover__footer">{children}</div>;
};

export default PopoverFooter;
