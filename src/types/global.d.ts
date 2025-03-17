/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line no-unused-vars
import * as React from "react";

declare module "react" {
    interface CSSProperties {
        [key: `--${string}`]: string | number | undefined;
    }
}
