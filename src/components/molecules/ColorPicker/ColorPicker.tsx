import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";

import { Square } from "@geneui/icons";

import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
// Components
import TextField from "@components/molecules/TextField";

// Styles
import "./ColorPicker.scss";

// Utils
import { hexToRgb, rgbToHex } from "./utils";

const defaultColors = ["#fff", "#000", "red"];

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface RGBA extends RGB {
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
     * Whether picker is open.
     */
    open?: boolean;
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
    onChange,
    open = false
}) => {
    const [popoverOpen, setPopoverOpen] = useState(open);
    const [propsForPopover, setPropsForPopover] = useState({});

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });
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

    const ColorSquareIcon = useCallback(() => <Square size={28} style={{ color, width: 10, height: 10 }} />, [color]);

    return (
        <div className={classNames("colorPicker", className)}>
            <div {...propsForPopover}>
                <TextField readOnly onFocus={() => setPopoverOpen(true)} value={value} IconBefore={ColorSquareIcon} />
            </div>

            <Popover
                onClose={() => setPopoverOpen(false)}
                withArrow={false}
                ref={popoverRef}
                position="bottom-left"
                open={popoverOpen}
                setProps={setPropsForPopover}
            >
                <PopoverBody withPadding={false}>
                    {alphaEnabled ? (
                        <RgbaColorPicker
                            color={colorRGBA}
                            className="colorPicker__rgbaPicker"
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
                    <div className="colorPicker__inputs">
                        <select name="color_variants">
                            <option value="rgb">RGB</option>
                            <option value="rgba">RGBA</option>
                            <option value="hex">HEX</option>
                        </select>
                        {alphaEnabled && (
                            <TextField type="text" value={color} onChange={handleColorInputChange} placeholder="Hex" />
                        )}
                        {alphaEnabled ? (
                            <TextField type="number" placeholder="Alpha" value={alpha} onChange={handleAlphaChange} />
                        ) : (
                            <div className="colorPicker__rgbInputs">
                                <TextField value={colorRGBA.r} type="number" />
                                <TextField value={colorRGBA.g} type="number" />
                                <TextField value={colorRGBA.b} type="number" />
                            </div>
                        )}
                    </div>
                    <div className="colorPicker__recents">
                        {recentColors?.map((recentColor) => (
                            <button
                                key={recentColor}
                                type="button"
                                className="colorPicker__recents__color"
                                aria-label={`Select recent color ${recentColor}`}
                                onClick={() => applyColorChange(recentColor)}
                                style={{
                                    background: recentColor
                                }}
                            />
                        ))}
                    </div>
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { IColorPickerProps, ColorPicker as default };
