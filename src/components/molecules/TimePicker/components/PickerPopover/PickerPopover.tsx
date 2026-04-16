import React, { Dispatch, FC, Ref, SetStateAction, useMemo } from "react";
import classNames from "classnames";

// Components
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";
import Text from "@components/atoms/Text";
import PickerButton from "@components/molecules/TimePicker/components/PickerButton/PickerButton";
// Constants
import { HOURS_12, HOURS_24, MINUTES, SECONDS } from "@components/molecules/TimePicker/constants";

interface IPickerPopoverProps {
    open?: boolean;
    onClose?: () => void;
    position?: string;
    mobileHeightMode?: "fit" | "full";
    size?: "small" | "medium" | "large";
    ref?: Ref<IPopoverRef>;
    setProps: Dispatch<SetStateAction<Record<string, unknown>>>;
}

const PickerPopover: FC<IPickerPopoverProps> = ({ ref, open, setProps, onClose, size, position, mobileHeightMode }) => {
    const is12Hour = false;
    const hours = useMemo(() => (is12Hour ? HOURS_12 : HOURS_24), [is12Hour, HOURS_12, HOURS_24]);

    const timeColumns = useMemo(
        () => [
            { header: "hours", data: hours, active: false, setActive: () => {} },
            { header: "minutes", data: MINUTES, active: false, setActive: () => {} },
            { header: "seconds", data: SECONDS, active: true, setActive: () => {} }
        ],
        [hours, MINUTES, SECONDS]
    );

    return (
        <Popover
            size={size}
            open={open}
            position={position}
            setProps={setProps}
            onClose={onClose}
            ref={ref}
            mobileHeightMode={mobileHeightMode}
            withArrow={false}
        >
            <PopoverBody withPadding={false}>
                <div className={classNames("timePicker__wrapper", `timePicker__wrapper_size_${size}`)}>
                    {timeColumns.map(({ header, data }) => (
                        <div
                            key={header}
                            className="timePicker__column"
                            role="listbox"
                            aria-label={`Select ${header?.toLowerCase()}`}
                        >
                            <div className="timePicker__headerWrapper">
                                <div className="timePicker__header">
                                    <Text className="ellipsis-text" as="p" variant="bodyMediumSemibold">
                                        {header}
                                    </Text>
                                </div>
                            </div>
                            <div className="timePicker__body">
                                <Scrollbar>
                                    <div className="timePicker__list" role="presentation">
                                        {data.map((item) => (
                                            <PickerButton
                                                key={item}
                                                // selected={active === item}
                                                // disabled={isTimeDisabled(`${item}:00:00`)}
                                                // onClick={() => setActive(item)}
                                                className={classNames(
                                                    "timePicker__pickerButton",
                                                    `timePicker__pickerButton_size_${size}`
                                                )}
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
                                // active={selectedTime[activeField]?.meridiem === "AM"}
                                // onClick={() => handleTimeSelect("AM", "meridiem")}
                                size={size}
                                className={classNames(
                                    "timePicker__pickerButton",
                                    `timePicker__pickerButton_size_${size}`
                                )}
                            >
                                AM
                            </PickerButton>
                            <PickerButton
                                // active={selectedTime[activeField]?.meridiem === "PM"}
                                // onClick={() => handleTimeSelect("PM", "meridiem")}
                                size={size}
                                className={classNames(
                                    "timePicker__pickerButton",
                                    `timePicker__pickerButton_size_${size}`
                                )}
                            >
                                PM
                            </PickerButton>
                        </div>
                    )}
                </div>
            </PopoverBody>
        </Popover>
    );
};

export default PickerPopover;
