import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./ProgressBar.scss";

interface IProgressBarProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill ProgressBar component props interface
}

/**
 * A progress bar offers visual feedback on the status and duration of a process, such as a download, file transfer, or installation, helping users understand how much longer they need to wait.
 */
const ProgressBar: FC<IProgressBarProps> = ({ className }) => {
    return <div className={classNames("progressBar", className)}>ProgressBar</div>;
};

export { IProgressBarProps, ProgressBar as default };
