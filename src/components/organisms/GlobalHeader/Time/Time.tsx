import React, { FC, useEffect, useState } from "react";

export interface ITimeProps {
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

const Time: FC<ITimeProps> = ({ timeZone, format = "24 h" }) => {
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
        <div className="globalHeader__timeWrapper">
            <span className="globalHeader__timeDigits">{format === "12h" ? time.slice(0, -2) : time}</span>
            {format === "12h" && <span className="globalHeader__time">&nbsp;{time.slice(-2)}</span>}
        </div>
    );
};

export { ITimeProps, Time as default };
