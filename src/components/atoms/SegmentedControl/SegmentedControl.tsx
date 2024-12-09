import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./SegmentedControl.scss";

interface ISegmentedControlProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill SegmentedControl component props interface
}

const SegmentedControl: FC<ISegmentedControlProps> = ({ className }) => {
    return <div className={classNames("segmentedControl", className)}>SegmentedControl</div>;
};

export { ISegmentedControlProps, SegmentedControl as default };
