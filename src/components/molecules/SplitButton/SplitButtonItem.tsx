import React, { FC } from "react";

interface ISplitButtonItemProps {
    children: string;
}

const SplitButtonItem: FC<ISplitButtonItemProps> = ({ children }) => {
    return <span>{children}</span>;
};

export { ISplitButtonItemProps, SplitButtonItem as default };
