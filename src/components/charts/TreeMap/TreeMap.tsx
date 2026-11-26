import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./TreeMap.scss";

interface ITreeMapProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill TreeMap component props interface
}

const TreeMap: FC<ITreeMapProps> = ({ className }) => {
    return <div className={classNames("treeMap", className)}>TreeMap</div>;
};

export { ITreeMapProps, TreeMap as default };
