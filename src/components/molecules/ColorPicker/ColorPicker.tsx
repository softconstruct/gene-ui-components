import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";

import "./ColorPicker.scss";

const defaultColors = ["#fff", "#000"];

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface RGBA extends RGB {
    a: number;
}

interface IColorPickerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Whether the alpha field slider should be enabled.
     */
    alphaEnabled?: boolean;
    /**
     * The selected alpha value.
     */
    alphaValue?: number;
    /**
     * Selected color value.
     */
    value?: string;
    /**
     * Default selected color for color picker.
     */
    defaultColor?: string;
    /**
     * Recent colors that should be displayed inside popover of picker.
     */
    recentColors?: string[];
    /**
     * Props that react-colorful is accepting.
     */
    colorPickerProps?: Record<string, unknown>;
    /**
     * Callback which is getting triggered when color is getting changed.
     */
    onChange?: (hex?: string, rgba?: RGBA | RGB | null, alpha?: number) => void;
}

function rgbToHex(val: RGB | RGBA): string {
    const r = val.r.toString(16).padStart(2, "0");
    const g = val.g.toString(16).padStart(2, "0");
    const b = val.b.toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
}

function hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;
}

/**
 * Color Picker allows users to select and apply colors within an application or website.
 * It is widely used in design tools, customization features, and any interface where users need to choose colors, such as for text, backgrounds, or graphical elements.
 */
const ColorPicker: FC<IColorPickerProps> = ({
    className,
    alphaEnabled = false,
    alphaValue = 100,
    value,
    defaultColor,
    recentColors = defaultColors,
    colorPickerProps,
    onChange
}) => {
    const initialValue = value || defaultColor;
    const initialPickerValue = typeof initialValue === "object" ? rgbToHex(initialValue) : initialValue;

    const [color, setColor] = useState<string>(initialValue ? (initialPickerValue as string) : "#aabbcc");

    const [colorRGBA, setColorRGBA] = useState<RGBA>(() => {
        const rgba = typeof initialValue === "string" ? hexToRgb(initialValue) : (initialValue as unknown as RGB);
        const customAlpha = rgba && "a" in rgba ? (rgba as RGBA).a : undefined;

        return initialValue && rgba
            ? { ...rgba, a: customAlpha || alphaValue / 100 }
            : { r: 170, g: 187, b: 204, a: alphaValue / 100 };
    });

    const [alpha, setAlpha] = useState<number>(alphaValue);

    const handlePickerChange = useCallback(
        (val: string | RGBA) => {
            if (alphaEnabled) {
                const hex = typeof val === "object" ? rgbToHex(val) : val;
                const rgba = typeof val === "object" ? val : hexToRgb(val);

                let opacity = alpha;
                if (rgba && "a" in rgba && (rgba as RGBA).a !== undefined) {
                    const rgbaAlpha = (rgba as RGBA).a;
                    opacity = rgbaAlpha === 0 ? 0 : Math.round(rgbaAlpha * 100) || 100;
                }

                setColor(hex);
                if (rgba) {
                    setColorRGBA(rgba as RGBA);
                }
                setAlpha(opacity);
                onChange?.(hex, rgba, opacity);
            } else {
                const stringVal = val as string;
                const rgba = hexToRgb(stringVal);
                setColor(stringVal);
                if (rgba) {
                    setColorRGBA({ ...rgba, a: alphaValue / 100 });
                }
                onChange?.(stringVal, rgba, alpha);
            }
        },
        [alpha, alphaEnabled, alphaValue, onChange]
    );

    const applyColorChange = useCallback(
        (colorValue: string) => {
            const rgba = hexToRgb(colorValue);
            setColor(colorValue);
            if (rgba) {
                setColorRGBA({ ...rgba, a: alpha / 100 });
            }
            onChange?.(colorValue, rgba, alpha);
        },
        [alpha, onChange]
    );

    const handleColorInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            applyColorChange(e.target.value);
        },
        [applyColorChange]
    );

    const handleAlphaChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newAlphaValue = e.target.value;
            const parsedAlpha = Number(newAlphaValue);

            if (parsedAlpha > 100 || parsedAlpha < 0) {
                return;
            }

            if (newAlphaValue === "") {
                setAlpha(0);
                setColorRGBA((prev) => ({ ...prev, a: 0 }));
                onChange?.(color, { ...colorRGBA, a: 0 }, 0);
            } else {
                setAlpha(parsedAlpha);
                setColorRGBA((prev) => ({ ...prev, a: parsedAlpha / 100 }));
                onChange?.(color, { ...colorRGBA, a: parsedAlpha / 100 }, parsedAlpha);
            }
        },
        [colorRGBA, onChange, color]
    );

    useEffect(() => {
        if (value) {
            setColor(value);
        }
    }, [value]);

    useEffect(() => {
        if (alphaValue !== undefined) {
            setAlpha(alphaValue);
        }
    }, [alphaValue]);

    return (
        <div className={classNames("colorPicker", className)}>
            {alphaEnabled ? (
                <RgbaColorPicker
                    color={colorRGBA}
                    onChange={handlePickerChange as (val: RGBA) => void}
                    {...colorPickerProps}
                />
            ) : (
                <HexColorPicker
                    color={color}
                    onChange={handlePickerChange as (val: string) => void}
                    {...colorPickerProps}
                />
            )}
            <div className="colorPicker__recents">
                {recentColors?.map((recentColor) => (
                    <button
                        key={recentColor}
                        type="button"
                        aria-label={`Select recent color ${recentColor}`}
                        onClick={() => applyColorChange(recentColor)}
                    />
                ))}
            </div>
            <div className="colorPicker__inputs">
                <input value={color} maxLength={7} onChange={handleColorInputChange} placeholder="Hex" />
                {alphaEnabled && (
                    <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Alpha"
                        value={alpha}
                        onChange={handleAlphaChange}
                    />
                )}
            </div>
        </div>
    );
};

export { IColorPickerProps, ColorPicker as default };
