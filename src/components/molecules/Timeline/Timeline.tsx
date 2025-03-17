import React, { createContext, FC, ReactNode, useContext, useMemo } from "react";
import classNames from "classnames";

import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./Timeline.scss";

interface ITimelineContextProps {
    /**
     * Steps direction <br/>
     * Possible values: `vertical | horizontal`
     */
    direction?: "vertical" | "horizontal";
}

interface ITimelinesProps extends ITimelineContextProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Positions at which the timeline contents will be displayed compared to the Line <br>
     * Possible values: `after | before | top | bottom | alternate`
     */
    position?: "after" | "before" | "alternate";
    /**
     * Provide `<Timeline/>` components to be rendered in the `<Timelines/>`
     */
    children: ReactNode;
}

export const TimelineContext = createContext<ITimelineContextProps>({} as ITimelineContextProps);

/**
 * Timeline component is used to display a sequence of events in chronological order. It provides a clear visual representation of a series of activities, milestones, or steps, helping users understand the progression and flow of events over time.
 */
const Timelines: FC<ITimelinesProps> = ({ direction = "vertical", position = "after", className, children }) => {
    const {
        breakpoint: { isMobileBreakpoint }
    } = useContext(GeneUIDesignSystemContext);

    const memoizedTimelineContextValue = useMemo(
        () => ({
            direction
        }),
        [direction]
    );

    return (
        <TimelineContext.Provider value={memoizedTimelineContextValue as ITimelineContextProps}>
            <div
                className={classNames(
                    `timeline timeline_direction_${isMobileBreakpoint ? "vertical" : direction} timeline_position_${position}`,
                    className
                )}
            >
                {children}
            </div>
        </TimelineContext.Provider>
    );
};

export { ITimelinesProps, Timelines as default };
