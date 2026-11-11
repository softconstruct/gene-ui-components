import React, { forwardRef } from "react";
import classNames from "classnames";

// Types
import { DatePickerSizes } from "../../types";

interface IDatePickerSkeletonProps {
    className?: string;
    size: DatePickerSizes;
    /**
     * Shows the bar of the label.
     */
    withLabel: boolean;
    /**
     * Shows the bar of the helper text.
     */
    withHelperText: boolean;
}

/**
 * The DatePicker while its data is loading: a bar in place of the label, the field and the helper text.
 */
const DatePickerSkeleton = forwardRef<HTMLDivElement, IDatePickerSkeletonProps>(
    ({ className, size, withLabel, withHelperText }, ref) => (
        <div
            ref={ref}
            aria-busy
            className={classNames("datePicker", "datePicker_loading", `datePicker_size_${size}`, className)}
        >
            {withLabel && <div className="datePicker__skeleton datePicker__skeleton_label" />}
            <div className="datePicker__skeleton datePicker__skeleton_field" />
            {withHelperText && <div className="datePicker__skeleton datePicker__skeleton_helperText" />}
        </div>
    )
);

export default DatePickerSkeleton;
