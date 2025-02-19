import React, { cloneElement, FC, ReactElement, useContext } from "react";

import { IPillProps } from "@components/atoms/Pill";

import { KeyValueContext } from "./KeyValue";

const pillSize: { [key: string]: IPillProps["size"] } = {
    large: "medium",
    medium: "small"
};

interface IValueProps {
    children: ReactElement | string;
}

const Value: FC<IValueProps> = ({ children }) => {
    const { size } = useContext(KeyValueContext);

    return (
        <>
            {typeof children === "string" ? (
                <span className="keyValue__value">{children}</span>
            ) : (
                size && cloneElement(children, { size: pillSize[size] })
            )}
        </>
    );
};

export { IValueProps, Value as default };
