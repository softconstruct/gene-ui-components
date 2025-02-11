import React, { Children, FC, ReactNode, cloneElement } from "react";
import classNames from "classnames";
// Styles
import "./Timeline.scss";

import { ITimelineProps } from "./TimelinePoint";

interface ITimelinesProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Timeline direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
    /**
     * Positions at which the timeline contents will be displayed compared to the Line <br>
     * Possible values: `after | before | top | bottom | alternate`
     */
    position?: "after" | "before" | "top" | "bottom" | "alternate";
    /**
     * Provide `<Timeline/>` components to be rendered in the `<Timelines/>`
     */
    children: ReactNode;
}

/**
 * Timeline component is used to display a sequence of events in chronological order. It provides a clear visual representation of a series of activities, milestones, or steps, helping users understand the progression and flow of events over time.
 */

const Timelines: FC<ITimelinesProps> = ({ direction = "vertical", position = "after", className, children }) => {
    const result = direction === "vertical" && (position === "top" || position === "bottom") ? "after" : position;
    return (
        <div className={classNames(`timeline timeline_direction_${direction} timeline_position_${result}`, className)}>
            {Children.map(children, (timeline) => {
                if (!React.isValidElement<ITimelineProps>(timeline)) return timeline;

                return cloneElement(timeline, {
                    direction,
                    ...timeline.props
                });
            })}
        </div>
    );
};

export { ITimelinesProps, Timelines as default };
