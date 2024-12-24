import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Timeline.scss";

interface ITimelineProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill Timeline component props interface
}

/**
 * Timeline component is used to display a sequence of events in chronological order. It provides a clear visual representation of a series of activities, milestones, or steps, helping users understand the progression and flow of events over time.
 */
const Timeline: FC<ITimelineProps> = ({ className }) => {
    return <div className={classNames("timeline", className)}>Timeline</div>;
};

export { ITimelineProps, Timeline as default };
