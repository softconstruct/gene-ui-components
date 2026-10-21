import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

// Hooks
import useDebouncedCallback from "@hooks/useDebounceCallback";

// Constants
import { ALPHA_SCALE_MAX, EMPTY_RGBA } from "../constants";
// Types
import { RGB, RGBA } from "../types";
// Utils
import { clamp, hexToRgb, parseColor, rgbToHex } from "../utils";

interface IUseColorPickerOptions {
    /**
     * The controlled color value (HEX string).
     */
    value?: string;
    /**
     * The uncontrolled default color value utilized upon initial mount.
     */
    defaultColor?: string;
    /**
     * Determines whether the alpha channel participates in the color updates.
     */
    alphaEnabled?: boolean;
    /**
     * The controlled alpha value, mapped on a scale from 0 to 100.
     */
    alphaValue?: number;
    /**
     * Callback fired continuously as the color is modified.
     */
    onChange?: (hex: string, rgba: RGBA) => void;
}

/**
 * The color being edited and the handlers its controls need.
 */
interface IColorPickerControl {
    /**
     * The parsed color currently held.
     */
    rgba: RGBA;
    /**
     * The HEX representation of `rgba`.
     */
    hex: string;
    /**
     * The raw input text, kept apart from `hex` so a partially typed HEX string survives until it parses.
     */
    localHex: string;
    /**
     * The alpha value, mapped on a scale from 0 to 100.
     */
    alpha: number;
    /**
     * Applies a color picked from the palette.
     */
    handlePickerChange: (color: string | RGBA) => void;
    /**
     * Applies the HEX input field's value.
     */
    handleHexInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Applies one RGB channel's value, clamped to 0-255.
     */
    handleRGBInputChange: (channel: keyof RGB, value: number) => void;
    /**
     * Applies the alpha input field's value, clamped to 0-100.
     */
    handleAlphaChange: (event: ChangeEvent<HTMLInputElement>) => void;
    /**
     * Applies a recent color swatch, or clears the selection when passed an empty string.
     */
    applyRecentColor: (color: string) => void;
}

const useColorPicker = ({
    value,
    defaultColor,
    alphaEnabled = false,
    alphaValue,
    onChange
}: IUseColorPickerOptions): IColorPickerControl => {
    const isColorControlled = value !== undefined;

    const [rgba, setRgba] = useState<RGBA>(() => {
        const initialColor = value ?? defaultColor;
        const parsed = initialColor ? parseColor(initialColor) : null;

        if (parsed) {
            const hasExplicitAlpha = initialColor?.toLowerCase().startsWith("rgba");
            return { ...parsed, a: hasExplicitAlpha ? parsed.a : (alphaValue ?? ALPHA_SCALE_MAX) / ALPHA_SCALE_MAX };
        }

        return EMPTY_RGBA;
    });

    const hex = useMemo(() => rgbToHex(rgba), [defaultColor, rgba]);
    const alpha = useMemo(() => Math.round(rgba.a * ALPHA_SCALE_MAX), [rgba.a]);

    const [localHex, setLocalHex] = useState<string>(hex);

    const triggerOnChange = useCallback(
        (next: unknown) => {
            const newColor = next as RGBA;
            onChange?.(rgbToHex(newColor), newColor);
        },
        [onChange]
    );

    const { debouncedCallback: emitChange } = useDebouncedCallback(triggerOnChange, 200);

    const updateRGBA = (updater: (prev: RGBA) => RGBA) => {
        setRgba((prev) => {
            const next = updater(prev);
            emitChange(next);
            setLocalHex(rgbToHex(next));
            return next;
        });
    };

    const handlePickerChange = useCallback(
        (colorValue: string | RGBA) => {
            if (typeof colorValue === "string") {
                const rgb = hexToRgb(colorValue);
                if (!rgb) return;

                updateRGBA((prev) => ({ ...rgb, a: prev.a }));
                setLocalHex(colorValue);
            } else {
                updateRGBA(() => ({
                    ...colorValue,
                    a: alphaEnabled ? colorValue.a : (alphaValue ?? ALPHA_SCALE_MAX) / ALPHA_SCALE_MAX
                }));
            }
        },
        [alphaEnabled, alphaValue, updateRGBA]
    );

    const applyRecentColor = (colorStr: string) => {
        if (colorStr === "") {
            setRgba(EMPTY_RGBA);
            setLocalHex("");
            emitChange(EMPTY_RGBA);
            return;
        }

        const parsed = parseColor(colorStr);
        if (!parsed) return;

        const hasExplicitAlpha = colorStr.toLowerCase().startsWith("rgba");
        updateRGBA((prev) => ({
            r: parsed.r,
            g: parsed.g,
            b: parsed.b,
            a: hasExplicitAlpha ? parsed.a : prev.a
        }));
    };

    const handleHexInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setLocalHex(newValue);

            const rgb = hexToRgb(newValue);

            if (rgb) {
                setRgba((prev) => ({ ...rgb, a: prev.a }));
                emitChange({ ...rgb, a: rgba.a });
                return;
            }
            setRgba(EMPTY_RGBA);
            emitChange(EMPTY_RGBA);
        },
        [rgba.a, emitChange]
    );

    const handleRGBInputChange = (key: keyof RGB, colorValue: number) => {
        updateRGBA((prev) => ({
            ...prev,
            [key]: clamp(colorValue, 0, 255)
        }));
    };

    const handleAlphaChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const nextAlpha = clamp(Number(e.target.value), 0, ALPHA_SCALE_MAX) / ALPHA_SCALE_MAX;
            updateRGBA((prev) => ({ ...prev, a: nextAlpha }));
        },
        [updateRGBA]
    );

    useEffect(() => {
        if (!isColorControlled || !value) return;

        const parsed = parseColor(value);
        if (!parsed) return;

        const hasExplicitAlpha = value.toLowerCase().startsWith("rgba");
        setRgba((prev) => ({
            r: parsed.r,
            g: parsed.g,
            b: parsed.b,
            a: hasExplicitAlpha ? parsed.a : prev.a
        }));
        setLocalHex(rgbToHex(parsed));
    }, [value, isColorControlled]);

    useEffect(() => {
        if (!defaultColor) return;

        const parsed = parseColor(defaultColor);
        if (!parsed) return;

        const hasExplicitAlpha = defaultColor.toLowerCase().startsWith("rgba");

        setRgba((prev) => ({
            r: parsed.r,
            g: parsed.g,
            b: parsed.b,
            a: hasExplicitAlpha ? parsed.a : prev.a
        }));
        setLocalHex(rgbToHex(parsed));
    }, [defaultColor, isColorControlled]);

    useEffect(() => {
        if (alphaValue === undefined) return;
        setRgba((prev) => ({
            ...prev,
            a: clamp(alphaValue, 0, ALPHA_SCALE_MAX) / ALPHA_SCALE_MAX
        }));
    }, [alphaValue]);

    return {
        rgba,
        hex,
        localHex,
        alpha,
        handlePickerChange,
        handleHexInputChange,
        handleRGBInputChange,
        handleAlphaChange,
        applyRecentColor
    };
};

export { IColorPickerControl, IUseColorPickerOptions, useColorPicker as default };
