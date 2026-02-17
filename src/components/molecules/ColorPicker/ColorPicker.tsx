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
     * When it's true inside picker appears slider to choose alpha value.
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
     * Format of color.
     */
    format?: "rgb" | "rgba" | "hex";
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
    recentColors,
    colorPickerProps,
    onChange,
    open = false,
    format = "hex"
}) => {
    const [alpha, setAlpha] = useState<number>(alphaValue);
    const [selectedFormat, setSelectedFormat] = useState(format);

    const [popoverOpen, setPopoverOpen] = useState(open);
    const [propsForPopover, setPropsForPopover] = useState({});

    const containerRef = useRef<HTMLDivElement>(null);
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
            const ctx = document.createElement("canvas").getContext("2d");
            let standardHex = colorValue;

            if (ctx) {
                ctx.fillStyle = colorValue;
                standardHex = ctx.fillStyle;
            }

            const rgba = hexToRgb(standardHex);

            setColor(standardHex);
            if (rgba) {
                setColorRGBA({ ...rgba, a: alpha / 100 });
            }

            onChange?.(standardHex, rgba, alpha);
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

    const handleFormatChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFormat(e.target.value as "rgb" | "rgba" | "hex");
    }, []);

    useEffect(() => {
        if (value) {
            setColor(value);
        }
    }, [value]);

    useEffect(() => {
        if (alphaValue !== undefined) {
            setAlpha(alphaValue);
            setColorRGBA((prev) => ({ ...prev, a: alphaValue / 100 }));
        }
    }, [alphaValue]);

    useEffect(() => {
        setPopoverOpen(open);
    }, [open]);

    useEffect(() => {
        setSelectedFormat(format);
    }, [format]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            const isInsideContainer = containerRef.current?.contains(target);
            // @ts-expect-error: todo check this and remove
            const isInsidePopover = popoverRef.current?.floatingElement?.current?.contains(target);

            if (!isInsideContainer && !isInsidePopover) {
                setPopoverOpen(false);
            }
        };

        if (popoverOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [popoverOpen]);

    const ColorSquareIcon = useCallback(() => <Square size={28} style={{ color, width: 10, height: 10 }} />, [color]);

    return (
        <div className={classNames("colorPicker", className)} ref={containerRef}>
            <div {...propsForPopover}>
                <TextField readOnly onFocus={() => setPopoverOpen(true)} value={color} IconBefore={ColorSquareIcon} />
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
                        <select name="color_variants" value={selectedFormat} onChange={handleFormatChange}>
                            <option value="rgb">RGB</option>
                            <option value="rgba">RGBA</option>
                            <option value="hex">HEX</option>
                        </select>
                        {alphaEnabled && (
                            <TextField type="text" value={color} onChange={handleColorInputChange} placeholder="Hex" />
                        )}
                        {selectedFormat === "hex" && <div />}
                        {alphaEnabled ? (
                            <TextField type="number" placeholder="Alpha" value={alpha} onChange={handleAlphaChange} />
                        ) : (
                            <div className="colorPicker__rgbInputs">
                                <TextField value={colorRGBA.r} type="number" />
                                <TextField value={colorRGBA.g} type="number" />
                                <TextField value={colorRGBA.b} type="number" />
                                {selectedFormat === "rgba" && <TextField value={colorRGBA.a} type="number" />}
                            </div>
                        )}
                    </div>
                    {recentColors && (
                        <div className="colorPicker__recents">
                            {recentColors.map((recentColor) => (
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
                    )}
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { IColorPickerProps, ColorPicker as default };
