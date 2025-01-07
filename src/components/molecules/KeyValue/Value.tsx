import React, { FC, ReactElement } from "react";

// Content
import { IPillProps } from "../../atoms/Pill";
import { ITextLinkProps } from "../../atoms/TextLink/TextLink";
import { elementWithType } from "./KeyValue";

export interface IValueProps {
    size?: "large" | "medium";
    children: ReactElement<IPillProps | ITextLinkProps> | string;
}
const Value: FC<IValueProps> = ({ size, children }) => {
    if (typeof children === "string") {
        return <span className="keyValue__value">{children}</span>;
    }

    return (
        <>
            {elementWithType(children, "Pill", size)}
            {elementWithType(children, "TextLink", size)}
        </>
    );
};

export default Value;
