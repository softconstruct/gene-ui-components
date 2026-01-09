import React, { FC, useEffect, useMemo, useState } from "react";
import classNames from "classnames";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";

// Styles
import "./ProgressBar.scss";

interface IProgressBarProps {
    /**
     * Specifies the progress percentage displayed by the progress bar.<br>
     * Valid values are between `0` and `100`. Values less than `0` will fallback to `0`,
     * and values greater than `100` will fallback to `100`.<br>
     * In case of value is `100` or greater the style of the component will be changed to success.
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
     *  Determines the `ProgressBar` appearance based on its status.<br>
     *  Possible values: `rest | warning | error`
     */
    status?: "rest" | "warning" | "error";
    /**
     *  Adds supplementary information below the progress bar.
     */
    helperText?: string;
    /**
     *  Additional descriptive text shown with info icon and tooltip alongside of the label component.
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

const helperTextTypeMap = {
    rest: "rest",
    warning: "warning",
    error: "error"
} as const;

const helperTextAndLabelSizeMap = {
    large: "medium",
    medium: "medium",
    small: "small"
} as const;

/**
 * A progress bar offers visual feedback on the status and duration of a process, such as a download, file transfer, or installation, helping users understand how much longer they need to wait.
 */
const ProgressBar: FC<IProgressBarProps> = ({
    className,
    size = "medium",
    type = "determinate",
    status = "rest",
    helperText,
    percent,
    uploadingText,
    infoText,
    label
}) => {
    const [progressBarStatus, setProgressBarStatus] = useState<
        Exclude<IProgressBarProps["status"], undefined> | "success"
    >(status);

    const isDeterminate = type === "determinate";
    const isTypeRest = progressBarStatus === "rest";
    const isPercentLowerThanMax = percent !== undefined && percent < 100;
    const error = status === "error";

    const processedPercent = useMemo(() => {
        let result = percent || 0;

        if (result < 0 && !error) result = 0;
        if (result >= 100 || error) result = 100;

        return `${result}%`;
    }, [percent, error]);

    useEffect(() => {
        if (error) {
            setProgressBarStatus("error");
            return;
        }

        if (percent !== undefined && !error) {
            if (percent >= 100 && progressBarStatus !== "success" && isDeterminate) {
                setProgressBarStatus("success");
            } else if ((!isTypeRest && isPercentLowerThanMax && isDeterminate) || !isDeterminate) {
                setProgressBarStatus("rest");
            }
        }
    }, [error, isTypeRest, status, percent, isDeterminate]);

    return (
        <div
            className={classNames(
                `progressBar progressBar_type_${error ? "determinate" : type} progressBar_size_${size} progressBar_status_${progressBarStatus}`,
                className
            )}
        >
            <Label text={label} size={helperTextAndLabelSizeMap[size]} infoText={infoText} />
            <div className="progressBar__track">
                {(isDeterminate || error) && <div className="progressBar__fill" style={{ width: processedPercent }} />}
                <div className="progressBar__loadingBar" />
            </div>
            <div className="progressBar__info">
                {helperText && (
                    <HelperText
                        text={helperText}
                        size={helperTextAndLabelSizeMap[size]}
                        status={helperTextTypeMap[status]}
                        className="progressBar__helperText"
                    />
                )}
                {isDeterminate && isTypeRest && isPercentLowerThanMax && (
                    <p className="progressBar__statusBar">
                        <span className="progressBar__uploadingText">{uploadingText}</span>
                        <span className="progressBar__percent">{processedPercent}</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export { IProgressBarProps, ProgressBar as default };
