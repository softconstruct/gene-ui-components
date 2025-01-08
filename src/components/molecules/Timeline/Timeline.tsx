import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./Timeline.scss";
import { Dot } from "@geneui/icons";
import Divider from "../../atoms/Divider";
import Loader from "../../atoms/Loader";

interface ITimelineProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Timeline title
     */
    title?: string;
    /**
     * Timeline description <br/>
     * Possible values: <br/>
     * Text - string
     */
    description?: string;
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
    // fill Timeline component props interface
}

/**
 * Timeline component is used to display a sequence of events in chronological order. It provides a clear visual representation of a series of activities, milestones, or steps, helping users understand the progression and flow of events over time.
 */
const Timeline: FC<ITimelineProps> = ({
    title,
    description,
    direction = "vertical",
    position = "after",
    className
}) => {
    return (
        <div
            className={classNames(`timeline timeline_direction_${direction} timeline_position_${position}`, className)}
        >
            <div className="timeline__element">
                {/* todo: use "timeline__status_*" classname for each status */}
                <div className="timeline__status timeline__status_defailt">
                    {/* todo: use "Dot" component for status state */}
                    <Dot size={20} className="timeline__status_icon" />
                    <Divider className="timeline__status_divider" vertical={direction === "vertical"} />
                </div>
                <div className="timeline__content">
                    <p className="timeline__title">{title}</p>
                    <p className="timeline__description">{description}</p>
                </div>
            </div>

            <div className="timeline__element">
                {/* todo: use "timeline__status_*" classname for each status */}
                <div className="timeline__status timeline__status_success">
                    {/* todo: use "Dot" component for status state */}
                    <Dot size={20} className="timeline__status_icon" />
                    <Divider className="timeline__status_divider" vertical={direction === "vertical"} />
                </div>
                <div className="timeline__content">
                    <p className="timeline__title">{title}</p>
                    <p className="timeline__description">{description}</p>
                </div>
            </div>

            <div className="timeline__element">
                {/* todo: use "timeline__status_*" classname for each status */}
                <div className="timeline__status timeline__status_active">
                    {/* todo: use "Dot" component for status state */}
                    <Dot size={20} className="timeline__status_icon" />
                    <Divider className="timeline__status_divider" vertical={direction === "vertical"} />
                </div>
                <div className="timeline__content">
                    <p className="timeline__title">{title}</p>
                    <p className="timeline__description">{description}</p>
                </div>
            </div>

            <div className="timeline__element">
                {/* todo: use "timeline__status_*" classname for each status */}
                <div className="timeline__status timeline__status_error">
                    {/* todo: use "Dot" component for status state */}
                    <Dot size={20} className="timeline__status_icon" />
                    <Divider className="timeline__status_divider" vertical={direction === "vertical"} />
                </div>
                <div className="timeline__content">
                    <p className="timeline__title">{title}</p>
                    <p className="timeline__description">{description}</p>
                </div>
            </div>

            <div className="timeline__element">
                {/* todo: use "timeline__status_loading" classname for loading state */}
                <div className="timeline__status timeline__status_loading">
                    {/* todo: use "Loader" component for loading state */}
                    <Loader size="smallNudge" className="btimeline__loader" />
                    <Divider className="timeline__status_divider" vertical={direction === "vertical"} />
                </div>
                <div className="timeline__content">
                    <p className="timeline__title">{title}</p>
                    <p className="timeline__description">{description}</p>
                </div>
            </div>
        </div>
    );
};

export { ITimelineProps, Timeline as default };
