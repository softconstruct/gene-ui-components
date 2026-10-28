import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react";

// Icons
import { Minus, Plus } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import TextField from "@components/molecules/TextField";

// Constants
import { DIGITS_ONLY } from "../../../../../constants";

// Styles
import "./FontSizeStepper.scss";

const FONT_SIZE_STEP = 2;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 14;

const clampFontSize = (size: number): number => Math.min(Math.max(size, MIN_FONT_SIZE), MAX_FONT_SIZE);

interface IFontSizeStepperProps {
    /**
     * The font size set on the editor's selection, in pixels. Left out when the selection carries no
     * size of its own, in which case the stepper starts from the editor's default.
     */
    value?: number;
    /**
     * Indicates whether the control is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * A callback function that is called with the size to apply, clamped to 8-72.
     * `returnFocus` is false only when the value was committed by the field losing focus,
     * so the editor is not pulled out from under whatever the user moved to.
     */
    onChange: (size: number, returnFocus: boolean) => void;
}

/**
 * A font size stepper for the Editor's toolbar. Internal to the Editor.
 */
const FontSizeStepper: FC<IFontSizeStepperProps> = ({ value = DEFAULT_FONT_SIZE, disabled, onChange }) => {
    const [draft, setDraft] = useState<number | null>(value);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    const step = (delta: number): void => {
        const next = clampFontSize(value + delta);

        if (next !== value) {
            onChange(next, true);
        }
    };

    const commit = (returnFocus: boolean): void => {
        if (draft === null) {
            setDraft(value);
            return;
        }

        const next = clampFontSize(draft);
        setDraft(next);

        if (next !== value) {
            onChange(next, returnFocus);
        }
    };

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
        if (!DIGITS_ONLY.test(target.value)) {
            return;
        }

        setDraft(!target.value ? null : Number(target.value));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            commit(true);
        }
    };

    return (
        <div className="fontSizeStepper" role="group" aria-label="Font size">
            <Button
                Icon={Minus}
                appearance="secondary"
                layout="text"
                size="medium"
                aria-label="Decrease font size"
                disabled={disabled || value <= MIN_FONT_SIZE}
                onClick={() => step(-FONT_SIZE_STEP)}
            />
            <TextField
                className="fontSizeStepper__input"
                name="editor-font-size"
                type="text"
                size="medium"
                inputMode="numeric"
                autoComplete="off"
                value={draft}
                disabled={disabled}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={() => commit(false)}
            />
            <Button
                Icon={Plus}
                appearance="secondary"
                layout="text"
                size="medium"
                aria-label="Increase font size"
                disabled={disabled || value >= MAX_FONT_SIZE}
                onClick={() => step(FONT_SIZE_STEP)}
            />
        </div>
    );
};

export { IFontSizeStepperProps, FontSizeStepper as default };
