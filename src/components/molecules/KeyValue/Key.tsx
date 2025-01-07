import React, { FC } from "react";

// Content
import Info, { IInfoProps } from "../../atoms/Info";

const infoSize: { [key: string]: IInfoProps["size"] } = {
    large: "small",
    medium: "smallNudge",
    small: "XSmall"
};

export interface IKeyProps {
    infoText?: string;
    children: string;
    size?: "large" | "medium";
}
const Key: FC<IKeyProps> = ({ infoText, children, size = "large" }) => (
    <div className="keyValue__content">
        <span className="keyValue__title">{children}</span>
        {infoText && <Info className="keyValue__icon" infoText={infoText} size={infoSize[size]} />}
    </div>
);

export default Key;
