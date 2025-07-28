import React, { FC, useContext } from "react";

import Info, { IInfoProps } from "@components/atoms/Info";

import { KeyValueContext } from "./KeyValue";

const infoSize: { [key: string]: IInfoProps["size"] } = {
    large: "small",
    medium: "smallNudge"
};

interface IKeyProps {
    /**
     * Additional informational text displayed alongside the label.
     * When provided, an info icon will be displayed next to the label,
     * which can be hovered over to reveal the additional context or instructions via a tooltip.
     */
    infoText?: string;
    /**
     * Defines the children for the component.
     */
    children: string;
}

const Key: FC<IKeyProps> = ({ infoText, children }) => {
    const { size } = useContext(KeyValueContext);

    return (
        <div className="keyValue__content">
            <span className="keyValue__title">{children}</span>
            {infoText && size && <Info className="keyValue__icon" infoText={infoText} size={infoSize[size]} />}
        </div>
    );
};

export { IKeyProps, Key as default };
