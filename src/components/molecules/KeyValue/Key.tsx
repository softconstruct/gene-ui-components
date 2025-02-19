import React, { FC, useContext } from "react";

import Info, { IInfoProps } from "@components/atoms/Info";

import { KeyValueContext } from "./KeyValue";

const infoSize: { [key: string]: IInfoProps["size"] } = {
    large: "small",
    medium: "smallNudge"
};

interface IKeyProps {
    infoText?: string;
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
