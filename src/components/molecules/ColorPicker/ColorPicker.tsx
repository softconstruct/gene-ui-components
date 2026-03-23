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
import { ColorFormat, RGB, RGBA } from "./types";
// Utils
import { clamp, hexToRgb, parseColor, rgbToHex } from "./utils";

/**
 * Configuration properties for the ColorPicker component.
 */
interface IColorPickerProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * Determines whether the alpha (transparency) slider and input fields are active.
     * When `true`, the picker allows users to select an opacity level.
     * @default false
     */
    alphaEnabled?: boolean;
    /**
     * The controlled alpha value, mapped on a scale from 0 to 100.
     * @default 100
     */
    alphaValue?: number;
    /**
     * The controlled color value (HEX string).
     * If provided, the component operates in controlled mode and ignores `defaultColor`.
     */
    value?: string;
    /**
     * The text label rendered above the primary color input field.
     */
    label?: string;
    /**
     * Specifies the visual size variant of the color picker inputs and indicators.
     * @default "medium"
     */
    size?: "small" | "medium" | "large";
    /**
     * Supplementary description text for the label.
     * Renders an information icon next to the label that displays this text within a tooltip upon hover.
     */
    labelInfoText?: string;
    /**
     * Ghost text displayed in the primary color input field when it is empty.
     */
    placeholder?: string;
    /**
     * The explicitly defined open/closed state of the popover palette.
     * Passing this prop switches the popover to a controlled state.
     */
    open?: boolean;
    /**
     * The uncontrolled default color value utilized upon initial mount.
     */
    defaultColor?: string;
    /**
     * An array of valid HEX strings representing previously selected or favorite colors.
     * These are rendered as clickable swatches beneath the main palette.
     * When passed an empty string ("") will render "clean selection" element in recent colors section.
     */
    recentColors?: string[];
    /**
     * The preferred color syntax format to display in the input fields.
     * @default "hex"
     */
    format?: ColorFormat;
    /**
     * Callback fired continuously as the user modifies the color.
     * * @param hex - The 6 or 8 character HEX string representation of the color.
     * @param rgba - The parsed RGBA/RGB object representing the current state.
     * @param alpha - The alpha integer value mapped from 0 to 100.
     */
    onChange?: (hex?: string, rgba?: RGBA | RGB | null, alpha?: number) => void;
    /**
     * Callback fired when a user clicks outside the bounds of an open picker popover.
     * Used primarily to close the popover in controlled setups.
     */
    onOutsideClick?: () => void;
}

/**
 * Color Picker allows users to select and apply colors within an application or website.
 * It is widely used in design tools, customization features, and any interface where users need to choose colors, such as for text, backgrounds, or graphical elements.
 */
const ColorPicker: FC<IColorPickerProps> = ({
    className,
    alphaEnabled = true,
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
    const [isAlphaEnabled, setIsAlphaEnabled] = useState(alphaEnabled);
    const [formatState, setFormatState] = useState<ColorFormat>(format);

    const [propsForPopover, setPropsForPopover] = useState({});

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const [rgba, setRgba] = useState<RGBA>(() => {
        const initialColor = value ?? defaultColor;
        const parsed = initialColor ? parseColor(initialColor) : null;

        if (parsed) {
            const hasExplicitAlpha = initialColor?.toLowerCase().startsWith("rgba");
            return { ...parsed, a: hasExplicitAlpha ? parsed.a : alphaValue / ALPHA_SCALE_MAX };
        }

        return { ...DEFAULT_RGBA };
    });

    const hex = useMemo(() => rgbToHex(rgba), [rgba]);
    const alpha = useMemo(() => Math.round(rgba.a * ALPHA_SCALE_MAX), [defaultColor, rgba.a]);

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
                    a: isAlphaEnabled ? colorValue.a : alphaValue / ALPHA_SCALE_MAX
                }));
            }
        },
        [alphaEnabled, alphaValue, updateRGBA]
    );

    const applyRecentColor = (colorStr: string) => {
        if (colorStr === "") {
            const emptyRgba: RGBA = { r: "", g: "", b: "", a: 1 };
            setRgba(emptyRgba);
            setLocalHex("");
            emitChange(emptyRgba);
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

    const handleHexInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalHex(newValue);

        const rgb = hexToRgb(newValue);

        if (rgb) {
            setRgba((prev) => ({ ...rgb, a: prev.a }));
            emitChange({ ...rgb, a: rgba.a });
            return;
        }
        setRgba({ r: "", g: "", b: "", a: 1 });
        emitChange({ r: "", g: "", b: "", a: 1 });
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
        if (hasExplicitAlpha && !isAlphaEnabled) {
            setIsAlphaEnabled(true);
        }

        setRgba((prev) => ({
            r: parsed.r,
            g: parsed.g,
            b: parsed.b,
            a: hasExplicitAlpha ? parsed.a : prev.a
        }));
        setLocalHex(rgbToHex(parsed));
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
                alphaEnabled={isAlphaEnabled}
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
                        {isAlphaEnabled ? (
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
                                onChange={(e) => setFormatState(e.target.value as ColorFormat)}
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

                            {isAlphaEnabled && (
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
                                            className={classNames("colorPicker__recentColor", {
                                                colorPicker__recentColor__empty: !recentColor
                                            })}
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
