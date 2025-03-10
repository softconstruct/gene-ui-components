import React, { FC } from "react";

interface IProps {
    children: string;
}
const ActionIItem: FC<IProps> = ({ children }) => {
    return <span>{children}</span>;
};

export default ActionIItem;
