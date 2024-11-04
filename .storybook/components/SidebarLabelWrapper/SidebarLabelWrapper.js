import React, { useMemo } from "react";
import experimental from "../../assets/experimental.svg";
import deprecated from "../../assets/deprecated.svg";
import "./index.css";

const cmpStages = {
    "-e": {
        src: experimental,
        alt: "The component is experimental"
    },
    "-d": {
        src: deprecated,
        alt: "The component is deprecated"
    }
};

const SidebarLabelWrapper = ({ item }) => {
    const stage = useMemo(() => (item.id[item.id.length - 2] === "-" ? item.name.slice(-2) : null), []);
    const name = useMemo(() => (stage ? item.name.replace(stage, "") : item.name), []);

    return (
        <div className="sidebarLabel">
            <span className="sidebarLabel__name">{name}</span>
            {stage && (
                <img
                    className="sidebarLabel__icon"
                    src={cmpStages[stage].src}
                    alt={cmpStages[stage].alt}
                    title={cmpStages[stage].alt}
                />
            )}
        </div>
    );
};

export default SidebarLabelWrapper;
