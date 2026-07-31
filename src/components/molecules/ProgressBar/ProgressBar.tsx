import React, { FC, useMemo } from "react";
import classNames from "classnames";

// Components
import HelperText from "@components/atoms/HelperText";
import Label from "@components/atoms/Label";
import Text from "@components/atoms/Text";

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

const helperTextAndLabelSizeMap = {
    large: "medium",
    medium: "medium",
    small: "small"
} as const;

const textVariantMap = {
    large: "labelMediumMedium",
    medium: "labelMediumMedium",
    small: "labelSmallMedium"
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
    const isDeterminate = type === "determinate";
    const isTypeRest = status === "rest";
    const isPercentLowerThanMax = percent !== undefined && percent < 100;
    const isError = status === "error";
    const isSuccess = percent === 100;
    const effectiveType = isError ? "determinate" : type;
    const isRestOrWarning = status === "rest" || status === "warning";
    const isRTLMode = typeof document !== "undefined" && document.dir === "rtl";

    const processedPercent = useMemo(() => {
        let result = percent || 0;

        if (result < 0 && !isError) result = 0;
        if (result >= 100 || isError) result = 100;

        return `${result}%`;
    }, [percent, isError]);

    return (
        <div
            className={classNames(
                "progressBar",
                `progressBar_type_${effectiveType}`,
                `progressBar_size_${size}`,
                className,
                {
                    progressBar_status_error: isError,
                    progressBar_status_success: isSuccess,
                    progressBar_status_rest: isRestOrWarning,
                    progressBar_rtl: isRTLMode
                }
            )}
        >
            <Label text={label} size={helperTextAndLabelSizeMap[size]} infoText={infoText} />
            <div className="progressBar__track">
                {(isDeterminate || isError) && (
                    <div className="progressBar__fill" style={{ width: processedPercent }} />
                )}
                <div className="progressBar__loadingBar" />
            </div>
            <div className="progressBar__info">
                {helperText && (
                    <HelperText
                        text={helperText}
                        size={helperTextAndLabelSizeMap[size]}
                        status={status}
                        className="progressBar__helperText"
                    />
                )}
                {((isDeterminate && isTypeRest && isPercentLowerThanMax) || (!isDeterminate && isTypeRest)) && (
                    <p className="progressBar__statusBar">
                        {uploadingText && (
                            <Text as="span" variant={textVariantMap[size]} className="progressBar__uploadingText">
                                {uploadingText}
                            </Text>
                        )}
                        {isDeterminate && (
                            <Text as="span" variant={textVariantMap[size]} className="progressBar__percent">
                                {processedPercent}
                            </Text>
                        )}
                    </p>
                )}
            </div>
        </div>
    );
};

export { IProgressBarProps, ProgressBar as default };
