import React, { FC, useEffect, useState } from "react";
import classNames from "classnames";

import Text from "@components/atoms/Text";

interface ITimeProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The time zone to display the time in.
     * If not provided, it will use the local time zone of the user's device.
     * example: "America/New_York", "Europe/London"
     */
    timeZone?: string;
    /**
     * The format of the time to display.
     * Possible values: "24h" or "12h"
     * Default is "24h"
     */
    format?: "24h" | "12h";
}

const Time: FC<ITimeProps> = ({ timeZone, format = "24 h", className }) => {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: format === "12h",
                timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
            });

            const formattedTime = formatter.format(now);
            setTime(formattedTime);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [timeZone, format]);

    return (
        <div className={classNames("globalHeader__time", className)}>
            <Text as="span" variant="labelMediumSemibold">
                {format === "12h" ? time.slice(0, -2) : time}
            </Text>
            {format === "12h" && (
                <Text as="span" variant="labelMediumSemibold">
                    {time.slice(-2)}
                </Text>
            )}
        </div>
    );
};

export { ITimeProps, Time as default };
