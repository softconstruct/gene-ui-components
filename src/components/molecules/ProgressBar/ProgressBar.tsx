import React, { FC, useMemo } from "react";
import classNames from "classnames";

// Components
import HelperText from "../../atoms/HelperText";
import Label from "../../atoms/Label";

// Styles
import "./ProgressBar.scss";

interface IProgressBarProps {
    /**
     * Specifies the progress percentage displayed by the progress bar.
     */
    percent?: number;
    /**
     * Text displayed alongside the progress percentage.
     */
    uploadingText?: string;
    /**
     * Defines the size of the progress bar.<br>
     * Possible values: `large | medium | small`
     */
    size?: "large" | "medium" | "small";
    /**
     * Sets the behavior of the bar for measurable or ongoing processes.<br>
     * Possible values: `determinate | indeterminate`
     */
    type?: "determinate" | "indeterminate";
    /**
     * Adjusts the bar's appearance to signal progress feedback.<br>
     * Possible values: `default | success | error`
     */
    color?: "default" | "success" | "error";
    /**
     *  Adds supplementary information below the progress bar.
     */
    helperText?: string;
    /**
     *  Additional descriptive text shown with info icon and tooltip.
     */
    infoText?: string;
    /**
     *  The main label text describing the progress bar's purpose.
     */
    label?: string;
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
}

/**
 * A progress bar offers visual feedback on the status and duration of a process, such as a download, file transfer, or installation, helping users understand how much longer they need to wait.
 */
const ProgressBar: FC<IProgressBarProps> = ({
    className,
    size = "medium",
    type = "determinate",
    color = "default",
    helperText,
    percent,
    uploadingText,
    infoText,
    label
}) => {
    const helperTextTypeMap = {
        default: "rest",
        success: "rest",
        error: "danger"
    } as const;

    const helperTextAndLabelSizeMap = {
        large: "medium",
        medium: "medium",
        small: "small"
    } as const;

    const showPercent = type === "determinate" && percent !== undefined;

    const processedPercent = useMemo(() => {
        let result = percent;
        if (percent === undefined || percent < 0) {
            result = 0;
        }
        if (percent && percent > 100) {
            result = 100;
        }
        return `${result}%`;
    }, [percent]);

    return (
        <div
            className={classNames(
                `progressBar progressBar_type_${type} progressBar_size_${size} progressBar_color_${color}`,
                className
            )}
        >
            <Label labelText={label} size={helperTextAndLabelSizeMap[size]} infoText={infoText} />
            <div className="progressBar__track">
                {showPercent && <div className="progressBar__fill" style={{ width: processedPercent }} />}
                <div className="progressBar__loadingBar" />
            </div>
            <div className="progressBar__info">
                {helperText && (
                    <HelperText
                        text={helperText}
                        size={helperTextAndLabelSizeMap[size]}
                        type={helperTextTypeMap[color]}
                    />
                )}
                {showPercent && (
                    <p className="progressBar__status">
                        {uploadingText} {processedPercent}
                    </p>
                )}
            </div>
        </div>
    );
};

export { IProgressBarProps, ProgressBar as default };
