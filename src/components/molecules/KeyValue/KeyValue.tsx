import React, { FC } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Styles
import "./KeyValue.scss";

// Components
import Pill, { IPillProps } from "../../atoms/Pill";

interface IKeyValueProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    IconBefore?: FC<IconProps>;
    keyText: string;
    IconAfter?: FC<IconProps>;
    value: IPillProps | FC<IconProps> | string;
    direction?: "vertical" | "horizontal";
    size?: "large" | "medium" | "small";
}

const valueComponent = (value: IKeyValueProps["value"]) => {
    if ((value as IPillProps)?.text) {
        return <Pill {...(value as IPillProps)} />;
    }

    if (typeof value === "string") {
        return <span>{value}</span>;
    }

    const Icon = value as FC<IconProps>;

    return <Icon />;
};

/**
 * Key Value components present data in a key-value format, typically used to display information obtained from other components. A common use case is setting up a Key Value component to show detailed information from a selected table row.
 */
const KeyValue: FC<IKeyValueProps> = ({
    IconBefore,
    keyText,
    IconAfter,
    value,
    className,
    direction = "vertical",
    size = "medium"
}) => {
    return (
        <div className={classNames("keyValue", className, direction, size)}>
            <div>
                {IconBefore && <IconBefore />}
                <span>{keyText}</span>
                {IconAfter && <IconAfter />}
            </div>
            {valueComponent(value)}
        </div>
    );
};

export { IKeyValueProps, KeyValue as default };
