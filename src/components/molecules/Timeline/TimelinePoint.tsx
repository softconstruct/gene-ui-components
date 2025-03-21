import React, { FC, useContext, useRef } from "react";
import classNames from "classnames";

import { CircleFilled, Clock } from "@geneui/icons";

import Divider from "@components/atoms/Divider";
import Tooltip from "@components/molecules/Tooltip";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

import useEllipsisDetection from "@hooks/useEllipsisDetection";

// Styles
import "./Timeline.scss";

import { TimelineContext } from "./Timeline";

interface ITimelinePointProps {
    /**
     * The title of the timeline item.
     */
    title: string;
    /**
     * A detailed description or context for the timeline item.
     */
    description: string;
    /**
     * The current status of the timeline item.
     * Possible values:
     * - 'default': The default state.
     * - 'active': The item is currently active or being processed.
     * - 'success': The item has completed successfully.
     * - 'error': The item encountered an error.
     * - 'pending': The item is waiting to be processed.
     */
    status: "default" | "active" | "success" | "error" | "pending";
}

/**
 * Timeline component is used to display a sequence of events in chronological order. It provides a clear visual representation of a series of activities, milestones, or steps, helping users understand the progression and flow of events over time.
 */
const TimelinePoint: FC<ITimelinePointProps> = ({ title, status, description }) => {
    const { direction } = useContext(TimelineContext);
    const { breakpoint } = useContext(GeneUIDesignSystemContext);

    const titleRef = useRef<HTMLParagraphElement | null>(null);
    const descriptionRef = useRef<HTMLParagraphElement | null>(null);
    const isDescriptionTruncated: boolean = useEllipsisDetection(descriptionRef);
    const isTitleTruncated: boolean = useEllipsisDetection(titleRef);

    return (
        <div className="timeline__element">
            <div className={classNames(`timeline__status timeline__status_${status}`)}>
                {status === "pending" ? (
                    <Clock size={20} className="timeline__status_icon timeline__status_icon_pending" />
                ) : (
                    <CircleFilled size={20} className="timeline__status_icon" />
                )}
                <Divider
                    className="timeline__status_divider"
                    vertical={direction === "vertical" || breakpoint?.isMobileBreakpoint}
                />
            </div>
            <div className="timeline__content">
                <Tooltip text={title} isVisible={isTitleTruncated}>
                    <p className="timeline__title ellipsis-text" ref={titleRef}>
                        {title}
                    </p>
                </Tooltip>
                <Tooltip text={description} isVisible={isDescriptionTruncated}>
                    <p className="timeline__description" ref={descriptionRef}>
                        {description}
                    </p>
                </Tooltip>
            </div>
        </div>
    );
};

export { ITimelinePointProps, TimelinePoint as default };
