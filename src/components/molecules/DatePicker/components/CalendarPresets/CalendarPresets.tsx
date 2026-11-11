import React, { FC, KeyboardEvent, MouseEvent, Ref, useRef, useState } from "react";
import classNames from "classnames";

// Components
import Scrollbar from "@components/atoms/Scrollbar";

import { KEYS, PickerButton } from "@internal/components/Picker";

// Types
import { CalendarPresetState, DatePickerSizes } from "../../types";

interface ICalendarPresetsProps {
    /**
     * Accessible name of the list.
     */
    label: string;
    size: DatePickerSizes;
    /**
     * A column beside the calendar, or a row under it on phones.
     */
    orientation: "vertical" | "horizontal";
    presets: CalendarPresetState[];
    listRef: Ref<HTMLDivElement>;
    onSelect: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * The presets of the calendar, as a list with a single tab stop that the arrow keys move.
 */
const CalendarPresets: FC<ICalendarPresetsProps> = ({ label, size, orientation, presets, listRef, onSelect }) => {
    const [focusedKey, setFocusedKey] = useState<string | null>(null);
    const itemRefs = useRef(new Map<string, HTMLButtonElement>());
    const itemRefCallbacks = useRef(new Map<string, (node: HTMLButtonElement | null) => void>());

    const enabledKeys = presets.filter((preset) => !preset.disabled).map((preset) => preset.key);
    // The tab stop stays where the focus was, and starts on the selected preset.
    const tabStopKey =
        (focusedKey && enabledKeys.includes(focusedKey) ? focusedKey : undefined) ??
        presets.find((preset) => preset.selected && !preset.disabled)?.key ??
        enabledKeys[0];

    const getItemRef = (key: string) => {
        let callback = itemRefCallbacks.current.get(key);

        if (!callback) {
            callback = (node: HTMLButtonElement | null) => {
                if (node) itemRefs.current.set(key, node);
                else itemRefs.current.delete(key);
            };
            itemRefCallbacks.current.set(key, callback);
        }

        return callback;
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const isRTL = typeof document !== "undefined" && document.dir === "rtl";
        const [backward, forward] =
            orientation === "vertical" ? [KEYS.ARROW_UP, KEYS.ARROW_DOWN] : [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT];
        const [previousKey, nextKey] =
            isRTL && orientation === "horizontal" ? [forward, backward] : [backward, forward];
        const index = tabStopKey ? enabledKeys.indexOf(tabStopKey) : -1;
        const targets: Record<string, string | undefined> = {
            [nextKey]: enabledKeys[Math.min(index + 1, enabledKeys.length - 1)],
            [previousKey]: enabledKeys[Math.max(index - 1, 0)],
            [KEYS.HOME]: enabledKeys[0],
            [KEYS.END]: enabledKeys[enabledKeys.length - 1]
        };
        const target = targets[event.key];

        if (!target) return;

        event.preventDefault();
        setFocusedKey(target);
        itemRefs.current.get(target)?.focus();
    };

    const list = (
        <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-label={label}
            aria-orientation={orientation}
            className={classNames("datePicker__presets", `datePicker__presets_${orientation}`)}
            onKeyDown={handleKeyDown}
        >
            {presets.map((preset) => (
                <PickerButton
                    key={preset.key}
                    ref={getItemRef(preset.key)}
                    value={preset.key}
                    size={size}
                    tabIndex={preset.key === tabStopKey ? 0 : -1}
                    selected={preset.selected}
                    disabled={preset.disabled}
                    className="datePicker__preset"
                    onClick={onSelect}
                    onFocus={setFocusedKey}
                >
                    {preset.label}
                </PickerButton>
            ))}
        </div>
    );

    // The row under the calendar on phones scrolls sideways when the presets do not fit.
    return orientation === "horizontal" ? (
        <Scrollbar className="datePicker__presetsScroll" width="full" height="auto">
            {list}
        </Scrollbar>
    ) : (
        list
    );
};

export default CalendarPresets;
