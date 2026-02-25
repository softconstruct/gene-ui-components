import React, { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { HexColorPicker, RgbaColorPicker } from "react-colorful";

import { Square } from "@geneui/icons";

import { IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
// Components
import TextField from "@components/molecules/TextField";

// Hooks
import useClickOutside from "@hooks/useClickOutside";

// Styles
import "./ColorPicker.scss";

// Utils
import { clamp, hexToRgb, rgbToHex } from "./utils";

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface RGBA extends RGB {
    a: number;
}

const DEFAULT_RGBA: RGBA = {
    r: 170,
    g: 187,
    b: 204,
    a: 1
};

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
    alphaValue = 100,
    value,
    defaultColor,
    recentColors,
    colorPickerProps,
    onChange,
    open,
    format = "hex",
    onOutsideClick
}) => {
    const isColorControlled = value !== undefined;
    const isOpenControlled = open !== undefined;

    const [isOpen, setIsOpen] = useState<boolean>(open ?? false);
    const [formatState, setFormatState] = useState<"rgb" | "hex">(format);

    const [propsForPopover, setPropsForPopover] = useState({});

    const popoverRef = useRef<IPopoverRef>({
        floatingElement: { current: null },
        referenceElement: { current: null }
    });

    const [rgba, setRgba] = useState<RGBA>(() => {
        const initialHex = value ?? defaultColor;
        const rgb = initialHex ? hexToRgb(initialHex) : null;

        return rgb ? { ...rgb, a: alphaValue / 100 } : { ...DEFAULT_RGBA };
    });

    const hex = useMemo(() => rgbToHex(rgba), [rgba]);
    const alpha = useMemo(() => Math.round(rgba.a * 100), [rgba.a]);

    const [localHex, setLocalHex] = useState<string>(hex);

    const emitChange = useCallback(
        (next: RGBA) => {
            onChange?.(rgbToHex(next), next, Math.round(next.a * 100));
        },
        [onChange]
    );

    const updateRGBA = useCallback(
        (updater: (prev: RGBA) => RGBA) => {
            setRgba((prev) => {
                const next = updater(prev);
                emitChange(next);
                setLocalHex(rgbToHex(next));
                return next;
            });
        },
        [emitChange]
    );

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
                    a: alphaEnabled ? colorValue.a : alphaValue / 100
                }));
            }
        },
        [alphaEnabled, alphaValue, updateRGBA]
    );

    const applyRecentColor = useCallback(
        (hexColor: string) => {
            const rgb = hexToRgb(hexColor);
            if (!rgb) return;

            updateRGBA((prev) => ({ ...rgb, a: prev.a }));
        },
        [updateRGBA]
    );
    const handleHexInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setLocalHex(newValue);

            const rgb = hexToRgb(newValue);
            if (rgb) {
                setRgba((prev) => ({ ...rgb, a: prev.a }));
                emitChange({ ...rgb, a: rgba.a });
            }
        },
        [updateRGBA, rgba.a, emitChange]
    );

    const handleRGBInputChange = useCallback(
        (key: keyof RGB, colorValue: number) => {
            updateRGBA((prev) => ({
                ...prev,
                [key]: clamp(colorValue, 0, 255)
            }));
        },
        [updateRGBA]
    );

    const handleAlphaChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const nextAlpha = clamp(Number(e.target.value), 0, 100) / 100;
            updateRGBA((prev) => ({ ...prev, a: nextAlpha }));
        },
        [updateRGBA]
    );

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
            a: clamp(alphaValue, 0, 100) / 100
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

    const ColorSquareIcon = useCallback(
        () => (
            <Square
                size={20}
                onClick={() => !isOpenControlled && setIsOpen(true)}
                style={{ color: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` }}
            />
        ),
        [rgba, localHex]
    );

    return (
        <div className={classNames("colorPicker", className)}>
            <div className="colorPicker__fieldsWrapper" {...propsForPopover}>
                <TextField
                    className="colorPicker__textField"
                    value={localHex}
                    IconBefore={ColorSquareIcon}
                    onChange={handleHexInputChange}
                />
                {alphaEnabled && (
                    <TextField className="colorPicker__alphaField" onChange={handleAlphaChange} value={alpha} />
                )}
            </div>

            <Popover
                onClose={() => !isOpenControlled && setIsOpen(false)}
                withArrow={false}
                ref={popoverRef}
                position="bottom-left"
                open={isOpen}
                setProps={setPropsForPopover}
            >
                <PopoverBody withPadding={false}>
                    <div className="colorPicker__wrapper">
                        {alphaEnabled ? (
                            <RgbaColorPicker
                                color={rgba}
                                onChange={handlePickerChange as (val: RGBA) => void}
                                {...colorPickerProps}
                            />
                        ) : (
                            <HexColorPicker
                                color={hex}
                                onChange={handlePickerChange as (val: string) => void}
                                {...colorPickerProps}
                            />
                        )}
                        <div className="colorPicker__inputs">
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
                                    <TextField
                                        size="small"
                                        value={rgba.r}
                                        autoComplete="off"
                                        type="number"
                                        name="r"
                                        onChange={(e) => handleRGBInputChange("r", Number(e.target.value))}
                                    />
                                    <TextField
                                        size="small"
                                        autoComplete="off"
                                        value={rgba.g}
                                        type="number"
                                        name="g"
                                        onChange={(e) => handleRGBInputChange("g", Number(e.target.value))}
                                    />
                                    <TextField
                                        size="small"
                                        autoComplete="off"
                                        value={rgba.b}
                                        type="number"
                                        name="b"
                                        onChange={(e) => handleRGBInputChange("b", Number(e.target.value))}
                                    />
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
                                />
                            )}
                        </div>
                        <div className="colorPicker__recents">
                            {recentColors?.map((recentColor) => (
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
                            ))}
                        </div>
                    </div>
                </PopoverBody>
            </Popover>
        </div>
    );
};

export { IColorPickerProps, ColorPicker as default };
