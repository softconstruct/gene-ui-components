import React, { FC } from "react";
import classNames from "classnames";
// Styles
import "./ProgressBar.scss";
import HelperText from "../../atoms/HelperText";
import Label from "../../atoms/Label";

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
    // Sizes / large / medium / small
    // Types / determinate / indeterminate
    // Colors / default / success / error

    return (
        <div
            className={classNames(
                "progressBar progressBar_type_indeterminate progressBar_size_large progressBar_color_default",
                className
            )}
        >
            <Label required labelText="Label" />
            <div className="progressBar__track">
                <div className="progressBar__fill" style={{ width: "50%" }} />
                <div className="progressBar__loadingBar" />
            </div>
            <div className="progressBar__info">
                <HelperText text="Helper Text" />
                <p className="progressBar__status">Uploading 10%</p>
            </div>
        </div>
    );
};

export { IProgressBarProps, ProgressBar as default };
