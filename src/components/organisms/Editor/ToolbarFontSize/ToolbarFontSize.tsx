import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react";

// Icons
import { Minus, Plus } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import TextField from "@components/molecules/TextField";

// Styles
import "./ToolbarFontSize.scss";

const FONT_SIZE_STEP = 2;
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 14;

const clampFontSize = (size: number): number => Math.min(Math.max(size, MIN_FONT_SIZE), MAX_FONT_SIZE);

interface IToolbarFontSizeProps {
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
const ToolbarFontSize: FC<IToolbarFontSizeProps> = ({ value = DEFAULT_FONT_SIZE, disabled, onChange }) => {
    const [draft, setDraft] = useState<string>(String(value));

    useEffect(() => {
        setDraft(String(value));
    }, [value]);

    const step = (delta: number): void => {
        const next = clampFontSize(value + delta);

        if (next !== value) {
            onChange(next, true);
        }
    };

    const commit = (returnFocus: boolean): void => {
        const parsed = Number.parseInt(draft, 10);

        if (Number.isNaN(parsed)) {
            setDraft(String(value));
            return;
        }

        const next = clampFontSize(parsed);
        setDraft(String(next));

        if (next !== value) {
            onChange(next, returnFocus);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            commit(true);
        }
    };

    return (
        <div className="toolbarFontSize" role="group" aria-label="Font size">
            <Button
                Icon={Minus}
                appearance="secondary"
                layout="text"
                size="medium"
                aria-label="Decrease font size"
                disabled={disabled || value - FONT_SIZE_STEP < MIN_FONT_SIZE}
                onClick={() => step(-FONT_SIZE_STEP)}
            />
            <TextField
                className="toolbarFontSize__input"
                name="editor-font-size"
                type="number"
                size="medium"
                inputMode="numeric"
                autoComplete="off"
                value={draft}
                disabled={disabled}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => commit(false)}
            />
            <Button
                Icon={Plus}
                appearance="secondary"
                layout="text"
                size="medium"
                aria-label="Increase font size"
                disabled={disabled || value + FONT_SIZE_STEP > MAX_FONT_SIZE}
                onClick={() => step(FONT_SIZE_STEP)}
            />
        </div>
    );
};

export { IToolbarFontSizeProps, ToolbarFontSize as default };
