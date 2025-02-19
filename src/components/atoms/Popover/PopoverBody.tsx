import React, { FC, PropsWithChildren } from "react";

const PopoverBody: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="popover__body">
            <div className="popover__content">{children} </div>
        </div>
    );
};

export default PopoverBody;
