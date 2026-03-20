import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";

// Icons
import { Percent } from "@geneui/icons";

// Components
import Label from "@components/atoms/Label";
import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import ColorPickerTextField from "@components/molecules/ColorPicker/components/ColorPickerTextField/ColorPickerTextField";
import {
    HexColorPicker,
    RgbaColorPicker
} from "@components/molecules/ColorPicker/components/CustomColorPickers/CustomColorPickers";
// Constants
import { ALPHA_SCALE_MAX, DEFAULT_RGBA, RGB_CHANNELS } from "@components/molecules/ColorPicker/constants";
import TextField from "@components/molecules/TextField";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./ColorPicker.scss";

// Types
import { RGB, RGBA } from "./types";
// Utils
import { clamp, hexToRgb, rgbToHex } from "./utils";

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
     * Label of component, displayed above the input field.
     */
    label?: string;
    /**
     * The size of the picker component.
     */
    size?: "small" | "medium" | "large";
    /**
     * Additional informational text displayed alongside the label.
     * When provided, an info icon will be displayed next to the label,
     * which can be hovered over to reveal the additional context or instructions via a tooltip.
     */
    labelInfoText?: string;
    /**
     * Placeholder value, displayed when component don't have any value.
     */
    placeholder?: string;
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
     * Format of color.
     * Possible values: `rgb | hex`.
     */
    format?: "rgb" | "hex";
    /**
     * Callback which is getting triggered when color is getting changed.
     */
    onChange?: (hex?: string, rgba?: RGBA | RGB | null, alpha?: number) => void;
    /**
     * Callback which is getting triggered when user clicks outside of picker popover.
     */
    onOutsideClick?: () => void;
}

/**
 * Color Picker allows users to select and apply colors within an application or website.
 * It is widely used in design tools, customization features, and any interface where users need to choose colors, such as for text, backgrounds, or graphical elements.
 */
const ColorPicker: FC<IColorPickerProps> = ({
    className,
    alphaEnabled = false,
    alphaValue = ALPHA_SCALE_MAX,
    value,
    defaultColor,
    recentColors,
    onChange,
    open,
    format = "hex",
    label,
    labelInfoText,
    size = "medium",
    placeholder,
    onOutsideClick
}) => {
    const isColorControlled = value !== undefined;
    const isOpenControlled = open !== undefined;

    const [isOpen, setIsOpen] = useState(!!open);
    const [formatState, setFormatState] = useState<"rgb" | "hex">(format);

    const [propsForPopover, setPropsForPopover] = useState({});

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const [rgba, setRgba] = useState<RGBA>(() => {
        const initialHex = value ?? defaultColor;
        const rgb = initialHex ? hexToRgb(initialHex) : null;

        return rgb ? { ...rgb, a: alphaValue / ALPHA_SCALE_MAX } : { ...DEFAULT_RGBA };
    });

    const hex = useMemo(() => rgbToHex(rgba), [rgba]);
    const alpha = useMemo(() => Math.round(rgba.a * ALPHA_SCALE_MAX), [rgba.a]);

    const [localHex, setLocalHex] = useState<string>(hex);

    const emitChange = (next: RGBA) => {
        onChange?.(rgbToHex(next), next, Math.round(next.a * ALPHA_SCALE_MAX));
    };

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
                    a: alphaEnabled ? colorValue.a : alphaValue / ALPHA_SCALE_MAX
                }));
            }
        },
        [alphaEnabled, alphaValue, updateRGBA]
    );

    const applyRecentColor = (hexColor: string) => {
        const rgb = hexToRgb(hexColor);
        if (!rgb) return;

        updateRGBA((prev) => ({ ...rgb, a: prev.a }));
    };

    const handleHexInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalHex(newValue);

        const rgb = hexToRgb(newValue);

        if (rgb) {
            setRgba((prev) => ({ ...rgb, a: prev.a }));
            emitChange({ ...rgb, a: rgba.a });
            return;
        }
        setRgba({ r: "", g: "", b: "", a: 100 });
        emitChange({ r: "", g: "", b: "", a: 100 });
    };

    const handleRGBInputChange = (key: keyof RGB, colorValue: number) => {
        updateRGBA((prev) => ({
            ...prev,
            [key]: clamp(colorValue, 0, 255)
        }));
    };

    const handleAlphaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nextAlpha = clamp(Number(e.target.value), 0, ALPHA_SCALE_MAX) / ALPHA_SCALE_MAX;
        updateRGBA((prev) => ({ ...prev, a: nextAlpha }));
    };

    const handleOpen = (openState: boolean) => {
        if (!isOpenControlled) {
            setIsOpen(openState);
        }
    };

    useEffect(() => {
        if (!isColorControlled || !value) return;

        const rgb = hexToRgb(value);
        if (!rgb) return;

        setRgba((prev) => ({ ...rgb, a: prev.a }));
        setLocalHex(value);
    }, [value, isColorControlled]);

    useEffect(() => {
        if (!defaultColor) return;

        const rgb = hexToRgb(defaultColor);
        if (!rgb) return;

        setRgba((prev) => ({ ...rgb, a: prev.a }));
        setLocalHex(defaultColor);
    }, [defaultColor, isColorControlled]);

    useEffect(() => {
        setRgba((prev) => ({
            ...prev,
            a: clamp(alphaValue, 0, ALPHA_SCALE_MAX) / ALPHA_SCALE_MAX
        }));
    }, [alphaValue]);

    useEffect(() => {
        if (!isOpenControlled || open === undefined) return;
        setIsOpen(open);
    }, [open, isOpenControlled]);

    useEffect(() => {
        setFormatState(format);
    }, [format]);

    useClickOutside(() => {
        if (!isOpenControlled) {
            setIsOpen(false);
            return;
        }
        onOutsideClick?.();
    }, [popoverRef.current.floatingElement, popoverRef.current.referenceElement]);

    return (
        <div className={classNames("colorPicker", className)} {...propsForPopover}>
            <Label
                size={size === "large" ? "medium" : size}
                text={label}
                infoText={labelInfoText}
                labelFor="colorPickerTextField"
            />
            <ColorPickerTextField
                id="colorPickerTextField"
                className="changeMe"
                value={localHex}
                alpha={alpha}
                alphaEnabled={alphaEnabled}
                onChange={handleHexInputChange}
                onAlphaChange={handleAlphaChange}
                placeholder={placeholder}
                onPickerOpen={handleOpen}
                size={size}
            />
            <Popover
                onClose={() => handleOpen(false)}
                withArrow={false}
                ref={popoverRef}
                position="bottom-left"
                open={isOpen}
                setProps={setPropsForPopover}
            >
                <PopoverBody withPadding={false}>
                    <div className="colorPicker__wrapper">
                        {alphaEnabled ? (
                            <RgbaColorPicker color={rgba} onChange={handlePickerChange as (val: RGBA) => void} />
                        ) : (
                            <HexColorPicker color={hex} onChange={handlePickerChange as (val: string) => void} />
                        )}
                        <div
                            className={classNames("colorPicker__inputs", {
                                colorPicker__inputsRgb: format === "rgb",
                                colorPicker__inputsHex: format === "hex"
                            })}
                        >
                            {/** TODO: Replace select with Dropdown component when it will be ready */}
                            <select
                                name="color_formats"
                                value={formatState}
                                onChange={(e) => setFormatState(e.target.value as "rgb" | "hex")}
                            >
                                <option value="rgb">RGB</option>
                                <option value="hex">HEX</option>
                            </select>
                            {formatState === "hex" ? (
                                <TextField
                                    type="text"
                                    size="small"
                                    value={localHex}
                                    onChange={handleHexInputChange}
                                    placeholder="Hex"
                                    autoComplete="off"
                                    className="colorPicker__hexInput"
                                />
                            ) : (
                                <div className="colorPicker__rgbInputs">
                                    {RGB_CHANNELS.map((channel) => (
                                        <TextField
                                            size="small"
                                            value={rgba[channel]}
                                            autoComplete="off"
                                            type="number"
                                            name={channel}
                                            onChange={(e) => handleRGBInputChange(channel, Number(e.target.value))}
                                        />
                                    ))}
                                </div>
                            )}

                            {alphaEnabled && (
                                <TextField
                                    type="number"
                                    size="small"
                                    placeholder="Alpha"
                                    autoComplete="off"
                                    value={alpha}
                                    className="colorPicker__alphaInput"
                                    onChange={handleAlphaChange}
                                    IconAfter={Percent}
                                />
                            )}
                        </div>

                        {recentColors && recentColors?.length > 0 && (
                            <div className="colorPicker__recents">
                                {recentColors.map((recentColor) => (
                                    <div className="colorPicker__recentColorWrapper">
                                        <button
                                            key={recentColor}
                                            type="button"
                                            className="colorPicker__recentColor"
                                            aria-label={`Select recent color ${recentColor}`}
                                            onClick={() => applyRecentColor(recentColor)}
                                            style={{
                                                background: recentColor
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { IColorPickerProps, ColorPicker as default };
