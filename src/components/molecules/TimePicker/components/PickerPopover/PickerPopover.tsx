import React, { Dispatch, FC, Ref, SetStateAction, useMemo } from "react";
import classNames from "classnames";

// Components
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import PickerButton from "@components/molecules/TimePicker/components/PickerButton/PickerButton";
// Constants
import { HOURS_12, HOURS_24, MINUTES, SECONDS } from "@components/molecules/TimePicker/constants";
import { TimeParts, TimePickerSizes } from "@components/molecules/TimePicker/types";

type TimePartKey = "hours" | "minutes" | "seconds" | "meridiem";

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
    /**
     * Called when a time part is selected.
     */
    onSelect?: (column: string, val: string) => void;
    /**
     * Current selected time parts used to highlight the active item.
     */
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
    /**
     * Programmatically disable time parts.
     * @param type
     * @param value
     */
    shouldDisableTime?: (type: "hours" | "minutes" | "seconds" | "meridiem", value: string) => boolean;
}

const convertTo24Hour = (hStr: string | undefined, meridiem: string | undefined): number => {
    if (!hStr) return 0;
    let h = parseInt(hStr, 10);
    if (meridiem) {
        if (meridiem === "PM" && h !== 12) h += 12;
        if (meridiem === "AM" && h === 12) h = 0;
    }
    return h;
};

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
    partsStart
}) => {
    const hours = useMemo(() => (is12Hour ? HOURS_12 : HOURS_24), [is12Hour, HOURS_12, HOURS_24]);

    const isPartDisabled = (header: TimePartKey, item: string): boolean => {
        if (shouldDisableTime?.(header, item)) return true;

        if (activeField !== "end" || !partsStart) return false;

        const startH = convertTo24Hour(partsStart.hours, partsStart.meridiem);
        const startM = parseInt(partsStart.minutes ?? "00", 10);
        const startS = parseInt(partsStart.seconds ?? "00", 10);

        if (header === "meridiem") {
            return partsStart.meridiem === "PM" && item === "AM";
        }

        const currentMeridiem = parts?.meridiem ?? (is12Hour ? "AM" : undefined);

        if (header === "hours") {
            return convertTo24Hour(item, currentMeridiem) < startH;
        }

        if (header === "minutes") {
            const currentH = convertTo24Hour(parts?.hours, currentMeridiem);
            if (currentH < startH) return true;
            if (currentH === startH) return parseInt(item, 10) < startM;
            return false;
        }

        if (header === "seconds") {
            const currentH = convertTo24Hour(parts?.hours, currentMeridiem);
            const currentM = parseInt(parts?.minutes ?? "00", 10);
            if (currentH < startH) return true;
            if (currentH === startH && currentM < startM) return true;
            if (currentH === startH && currentM === startM) return parseInt(item, 10) < startS;
            return false;
        }

        return false;
    };

    const timeColumns: Array<{ header: TimePartKey; data: string[]; text: string }> = [
        { header: "hours", data: hours, text: texts?.hours || "hours" },
        { header: "minutes", data: MINUTES, text: texts?.minutes || "minutes" },
        { header: "seconds", data: SECONDS, text: texts?.seconds || "seconds" }
    ];

    return (
        <Popover
            size={size}
            open={open}
            position={position}
            setProps={setProps}
            onClose={onClose}
            ref={popoverRef}
            mobileHeightMode={mobileHeightMode}
            withArrow={false}
        >
            <PopoverBody withPadding={false}>
                <div className={classNames("timePicker__wrapper", `timePicker__wrapper_size_${size}`)}>
                    {timeColumns.map(({ header, data, text }) => (
                        <div
                            key={header}
                            className="timePicker__column"
                            role="listbox"
                            aria-label={`Select ${header?.toLowerCase()}`}
                        >
                            <div className="timePicker__headerWrapper">
                                <div className="timePicker__header">
                                    <Text className="ellipsis-text" as="p" variant="bodyMediumSemibold">
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
                                                disabled={isPartDisabled(header, item)}
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
                            role="listbox"
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
                                disabled={isPartDisabled("meridiem", "AM")}
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
                                disabled={isPartDisabled("meridiem", "PM")}
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
