import React, { FC, ReactElement } from "react";
import classNames from "classnames";

// Components
import { IKeyProps } from "./Key";
import { IValueProps } from "./Value";
import { IPillProps } from "../../atoms/Pill";

// Styles
import "./KeyValue.scss";

interface IKeyValueProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Key - value direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
    /**
     * Size
     * Possible values: `large | medium`;
     */
    size?: "large" | "medium";
    children: [ReactElement<IKeyProps>, ReactElement<IValueProps>];
}

const pillSize: { [key: string]: IPillProps["size"] } = {
    large: "medium",
    medium: "small",
    small: "smallNudge"
};

export const elementWithType = (
    element: ReactElement,
    type: string,
    keyValueSize: IKeyValueProps["size"] = "large"
) => {
    const typeCastedElement = element as unknown as { type: { name: string } };
    const size = typeCastedElement.type.name === "Pill" ? pillSize[keyValueSize] : keyValueSize;
    return (element as unknown as { type: { name: string } })?.type?.name === type
        ? { ...element, props: { ...element.props, size } }
        : null;
};

/**
 * Key Value components present data in a key-value format, typically used to display information obtained from other components. A common use case is setting up a Key Value component to show detailed information from a selected table row.
 */
const KeyValue: FC<IKeyValueProps> = ({
    className,
    direction = "vertical",
    size = "large",
    children: [key, value]
}) => {
    return (
        <div className={classNames(`keyValue keyValue_${direction} keyValue_${size}`, className)}>
            {elementWithType(key, "Key", size)}
            {elementWithType(value, "Value", size)}
        </div>
    );
};

export { IKeyValueProps, KeyValue as default };
