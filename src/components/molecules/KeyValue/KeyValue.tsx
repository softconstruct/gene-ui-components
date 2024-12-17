import React, { FC } from "react";
import classNames from "classnames";

import { IconProps } from "@geneui/icons";

// Components
import Pill, { IPillProps } from "../../atoms/Pill";
import Info, { IInfoProps } from "../../atoms/Info";

// Styles
import "./KeyValue.scss";

interface IKeyValueProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Icon before title in the key
     */
    KeyIcon?: FC<IconProps>;
    /**
     * Key title
     */
    title: string;
    /**
     * Info icon after title in the key
     * Possible values: <br/>
     * Icon - `{
     * infoText?: string;
     * disabled?: boolean;
     * appearance?: default" | "brand" | "inverse";
     * className?: string;
     * }` Info component's props
     */
    iconInfo?: IInfoProps;
    /**
     * Value
     * Possible values: <br/>
     * Pill - `{
     * text?: string;
     * iconAlignment?: "before" | "after";
     * isFill?: boolean;
     * size?: "smallNudge" | "small" | "medium";
     * Icon?: React.FC<IconProps>; (Icon component)
     * withDot?: boolean;
     * color?: "informative" | "neutral" | "error" | "success" | "warning" | "purple" | "lagoon" | "magenta" | "slate" | "inverse";
     * className?: string;
     * }` Pill component's props
     * <br/><br/>
     * Icon - Icon component
     * <br/><br/>
     * Text - string
     */
    value: IPillProps | FC<IconProps> | string;
    /**
     * Key - value direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
    /**
     * Size
     * Possible values: `large | medium | small`;
     */
    size?: "large" | "medium" | "small";
}

const infoSize: { [key: string]: IInfoProps["size"] } = {
    large: "small",
    medium: "smallNudge",
    small: "XSmall"
};

const iconSize: { [key: string]: IconProps["size"] } = {
    large: 24,
    medium: 20,
    small: 16
};

const pillSize: { [key: string]: IPillProps["size"] } = {
    large: "medium",
    medium: "small",
    small: "smallNudge"
};

const valueComponent = (value: IKeyValueProps["value"], size: IKeyValueProps["size"] = "medium") => {
    if ((value as IPillProps)?.text) {
        return <Pill {...(value as IPillProps)} size={pillSize[size]} />;
    }

    if (typeof value === "string") {
        return <span className="keyValue__value">{value}</span>;
    }

    const Icon = value as FC<IconProps>;

    return <Icon size={iconSize[size]} />;
};

/**
 * Key Value components present data in a key-value format, typically used to display information obtained from other components. A common use case is setting up a Key Value component to show detailed information from a selected table row.
 */
const KeyValue: FC<IKeyValueProps> = ({
    KeyIcon,
    title,
    iconInfo,
    value,
    className,
    direction = "vertical",
    size = "medium"
}) => {
    return (
        <div className={classNames(`keyValue keyValue_${direction} keyValue_${size}`, className)}>
            <div
                className={classNames(
                    `keyValue__content ${typeof value === "string" ? "keyValue__content_align_top" : "keyValue__content_align_center"}`
                )}
            >
                {KeyIcon && <KeyIcon size={iconSize[size]} className="keyValue__icon" />}
                <span className="keyValue__title">{title}</span>
                {iconInfo && <Info {...iconInfo} size={infoSize[size]} />}
            </div>
            {valueComponent(value, size)}
        </div>
    );
};

export { IKeyValueProps, KeyValue as default };
