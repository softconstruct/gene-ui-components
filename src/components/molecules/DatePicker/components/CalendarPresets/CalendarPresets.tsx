import React, { FC, KeyboardEvent, MouseEvent, useState } from "react";
import classNames from "classnames";

// Components
import Scrollbar from "@components/atoms/Scrollbar";

import { KEYS, PickerButton } from "@internal/components/Picker";

// Helpers
import { isDocumentRTL } from "../../helpers";
// Hooks
import useElementRefs from "../../hooks/useElementRefs";
// Types
import { CalendarPresetState, DatePickerSizes } from "../../types";

interface ICalendarPresetsProps {
    /**
     * Accessible name of the list.
     */
    label: string;
    /**
     * The size of the preset buttons.
     */
    size: DatePickerSizes;
    /**
     * A column beside the calendar, or a row under it on phones.
     */
    orientation: "vertical" | "horizontal";
    /**
     * The presets in the order they are listed.
     */
    presets: CalendarPresetState[];
    /**
     * Picks the preset with `key`.
     */
    onSelect: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
    /**
     * Leaves the calendar on `Shift+Tab`; left out where the calendar has tab stops before the presets.
     */
    onTabOutBackward?: () => void;
    /**
     * Leaves the calendar on `Tab`; left out where the calendar has tab stops after the presets.
     */
    onTabOutForward?: () => void;
}

/**
 * The presets of the calendar, as a list with a single tab stop that the arrow keys move.
 */
const CalendarPresets: FC<ICalendarPresetsProps> = ({
    label,
    size,
    orientation,
    presets,
    onSelect,
    onTabOutBackward,
    onTabOutForward
}) => {
    const [focusedKey, setFocusedKey] = useState<string | null>(null);
    const items = useElementRefs<HTMLButtonElement>();

    const enabledKeys = presets.filter((preset) => !preset.disabled).map((preset) => preset.key);
    const tabStopKey =
        (focusedKey && enabledKeys.includes(focusedKey) ? focusedKey : undefined) ??
        presets.find((preset) => preset.selected && !preset.disabled)?.key ??
        enabledKeys[0];

    const handleTab = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!event.shiftKey) {
            onTabOutForward?.();
            return;
        }

        if (onTabOutBackward) {
            event.preventDefault();
            onTabOutBackward();
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === KEYS.TAB) {
            handleTab(event);
            return;
        }

        const [backward, forward] =
            orientation === "vertical" ? [KEYS.ARROW_UP, KEYS.ARROW_DOWN] : [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT];
        const [previousKey, nextKey] =
            isDocumentRTL() && orientation === "horizontal" ? [forward, backward] : [backward, forward];
        const index = tabStopKey ? enabledKeys.indexOf(tabStopKey) : -1;
        const targets: Partial<Record<string, string>> = {
            [nextKey]: enabledKeys[Math.min(index + 1, enabledKeys.length - 1)],
            [previousKey]: enabledKeys[Math.max(index - 1, 0)],
            [KEYS.HOME]: enabledKeys[0],
            [KEYS.END]: enabledKeys[enabledKeys.length - 1]
        };
        const target = targets[event.key];

        if (!target) return;

        event.preventDefault();
        setFocusedKey(target);
        items.get(target)?.focus();
    };

    const list = (
        <div
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
                    ref={items.getRef(preset.key)}
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

    return orientation === "horizontal" ? (
        <Scrollbar width="full" height="auto">
            {list}
        </Scrollbar>
    ) : (
        list
    );
};

export default CalendarPresets;
