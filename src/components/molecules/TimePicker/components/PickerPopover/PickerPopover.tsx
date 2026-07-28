import React, { Dispatch, FC, Ref, SetStateAction, useCallback, useContext, useMemo } from "react";
import classNames from "classnames";

// Components
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import PickerButton from "@components/molecules/TimePicker/components/PickerButton/PickerButton";
// Constants & Helpers
import { HOURS_12, HOURS_24, MINUTES, SECONDS } from "@components/molecules/TimePicker/constants";
import { isPickerPartDisabled } from "@components/molecules/TimePicker/helpers";
import { TimeParts, TimePickerSizes } from "@components/molecules/TimePicker/types";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

interface IPickerPopoverProps {
    /**
     * Controls whether the popover is open.
     */
    open?: boolean;
    /**
     * Callback invoked when the popover should be closed.
     */
    onClose?: () => void;
    /**
     * Popover placement position.
     */
    position?: string;
    /**
     * Controls the popover height mode on mobile.
     */
    mobileHeightMode?: "fit" | "full";
    /**
     * Size of the popover and its items.
     */
    size?: TimePickerSizes;
    /**
     * Reference to the popover element.
     */
    popoverRef?: Ref<IPopoverRef>;
    /**
     * Popover positioning props passed to the underlying popover component.
     */
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
    onSelect?: (column: keyof TimeParts, val: string) => void;
    parts?: TimeParts;
    /**
     * Whether the time picker is in 12-hour format.
     */
    is12Hour: boolean;
    /**
     * Custom texts for the component.
     * @param {string} texts.amText - The text to display for AM (AM/A).
     * @param {string} texts.pmText - The text to display for PM (P/P).
     */
    texts?: {
        amText?: string;
        pmText?: string;
        hours?: string;
        minutes?: string;
        seconds?: string;
    };
    /**
     * Current active field
     */
    activeField?: "start" | "end";
    /**
     * Time parts.
     */
    partsStart?: TimeParts;
    partsEnd?: TimeParts;
    shouldDisableTime?: (type: keyof TimeParts, value: string) => boolean;
}

const PickerPopover: FC<IPickerPopoverProps> = ({
    popoverRef,
    open,
    setProps,
    onClose,
    size,
    position,
    onSelect,
    mobileHeightMode,
    parts,
    is12Hour,
    texts,
    shouldDisableTime,
    activeField,
    partsStart,
    partsEnd
}) => {
    const hours = useMemo(() => (is12Hour ? HOURS_12 : HOURS_24), [is12Hour, HOURS_12, HOURS_24]);

    const handlePartDisabled = useCallback(
        (header: keyof TimeParts, item: string) => {
            return isPickerPartDisabled(
                header,
                item,
                parts,
                is12Hour,
                activeField,
                partsStart,
                partsEnd,
                shouldDisableTime
            );
        },
        [parts, is12Hour, activeField, partsStart, partsEnd, shouldDisableTime]
    );

    const timeColumns: Array<{ header: keyof TimeParts; data: string[]; text: string }> = [
        { header: "hours", data: hours, text: texts?.hours || "hours" },
        { header: "minutes", data: MINUTES, text: texts?.minutes || "minutes" },
        { header: "seconds", data: SECONDS, text: texts?.seconds || "seconds" }
    ];

    const headerTextVariant = size === "large" || size === "medium" ? "bodyMediumSemibold" : "captionLargeSemibold";

    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const isMobile = breakpoint?.isMobileBreakpoint;

    return (
        <Popover
            size="fitContent"
            open={open}
            position={position}
            setProps={setProps}
            onClose={onClose}
            ref={popoverRef}
            mobileHeightMode={mobileHeightMode}
            withArrow={false}
        >
            <PopoverBody withPadding={false}>
                <div
                    className={classNames("timePicker__wrapper", `timePicker__wrapper_size_${size}`, {
                        timePicker__wrapper_mobile: isMobile
                    })}
                >
                    {timeColumns.map(({ header, data, text }) => (
                        <div
                            key={header}
                            className="timePicker__column"
                            role="group"
                            aria-label={`Select ${header?.toLowerCase()}`}
                        >
                            <div className="timePicker__headerWrapper">
                                <div className="timePicker__header">
                                    <Text className="ellipsis-text" as="p" variant={headerTextVariant}>
                                        {text}
                                    </Text>
                                </div>
                            </div>
                            <div className="timePicker__body">
                                <Scrollbar>
                                    <div className="timePicker__list" role="presentation">
                                        {data.map((item) => (
                                            <PickerButton
                                                key={item}
                                                selected={parts?.[header] === item}
                                                onClick={() => onSelect?.(header, item)}
                                                className={classNames(
                                                    "timePicker__pickerButton",
                                                    `timePicker__pickerButton_size_${size}`
                                                )}
                                                disabled={handlePartDisabled(header, item)}
                                                size={size}
                                            >
                                                {item}
                                            </PickerButton>
                                        ))}
                                    </div>
                                </Scrollbar>
                            </div>
                        </div>
                    ))}
                    {is12Hour && (
                        <div
                            className="timePicker__column timePicker__column_meridiem"
                            role="group"
                            aria-label="Select AM/PM"
                        >
                            <PickerButton
                                selected={parts?.meridiem === "AM"}
                                onClick={() => onSelect?.("meridiem", "AM")}
                                size={size}
                                className={classNames(
                                    "timePicker__pickerButton",
                                    `timePicker__pickerButton_size_${size}`
                                )}
                                disabled={handlePartDisabled("meridiem", "AM")}
                            >
                                {texts?.amText || "AM"}
                            </PickerButton>
                            <PickerButton
                                selected={parts?.meridiem === "PM"}
                                onClick={() => onSelect?.("meridiem", "PM")}
                                size={size}
                                className={classNames(
                                    "timePicker__pickerButton",
                                    `timePicker__pickerButton_size_${size}`
                                )}
                                disabled={handlePartDisabled("meridiem", "PM")}
                            >
                                {texts?.pmText || "PM"}
                            </PickerButton>
                        </div>
                    )}
                </div>
            </PopoverBody>
        </Popover>
    );
};

export default PickerPopover;
