import React, { FC, Ref, useContext, useEffect, useState } from "react";
import classNames from "classnames";

// Icons
import { Percent } from "@geneui/icons";

// Components
import { IPopoverProps, IPopoverRef, Popover, PopoverBody } from "@components/atoms/Popover";
import Dropdown, { IDropdownOption } from "@components/molecules/Dropdown";
import TextField from "@components/molecules/TextField";
import { GeneUIDesignSystemContext } from "@components/providers/GeneUIProvider";

// Styles
import "./ColorPickerPopover.scss";

import { HexColorPicker, RgbaColorPicker } from "./components/CustomColorPickers/CustomColorPickers";
// Constants
import { FORMAT_OPTIONS, RGB_CHANNELS } from "./constants";
// Hooks
import { IColorPickerControl } from "./hooks/useColorPicker";
// Types
import { ColorFormat, RGBA } from "./types";

interface IColorPickerPopoverProps extends IColorPickerControl {
    /**
     * The open/closed state of the palette.
     */
    open: boolean;
    /**
     * Receives the props the trigger has to carry. The consumer renders its own trigger and
     * spreads these onto it.
     */
    setProps: IPopoverProps["setProps"];
    /**
     * Called when the palette is dismissed, with the reason it closed.
     */
    onClose?: IPopoverProps["onClose"];
    /**
     * Determines whether the alpha slider and input field are active.
     * @default false
     */
    alphaEnabled?: boolean;
    /**
     * An array of valid HEX strings rendered as clickable swatches beneath the palette.
     * An empty string renders the "clear selection" swatch.
     */
    recentColors?: string[];
    /**
     * The color syntax format shown in the input fields.
     * Leave it out to render the palette on its own, with no format dropdown and no input fields.
     */
    format?: ColorFormat;
    /**
     * Where the palette is placed relative to the trigger.
     * @default "bottom-left"
     */
    position?: IPopoverProps["position"];
    /**
     * Receives the palette's reference and floating elements.
     */
    popoverRef?: Ref<IPopoverRef>;
    /**
     * Additional class for the palette.
     */
    className?: string;
}

const ColorPickerPopover: FC<IColorPickerPopoverProps> = ({
    open,
    setProps,
    onClose,
    rgba,
    hex,
    localHex,
    alpha,
    handlePickerChange,
    handleHexInputChange,
    handleRGBInputChange,
    handleAlphaChange,
    applyRecentColor,
    alphaEnabled = false,
    recentColors,
    format,
    position = "bottom-left",
    popoverRef,
    className
}) => {
    const { breakpoint } = useContext(GeneUIDesignSystemContext);
    const isMobileBreakpoint = breakpoint?.isMobileBreakpoint;

    const [colorFormatMode, setColorFormatMode] = useState<ColorFormat | undefined>(format);
    const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);

    useEffect(() => {
        setColorFormatMode(format);
    }, [format]);

    const handleClose: IPopoverProps["onClose"] = (event, reason) => {
        if (isFormatDropdownOpen) {
            return;
        }

        onClose?.(event, reason);
    };

    return (
        <Popover
            ref={popoverRef}
            open={open}
            setProps={setProps}
            onClose={handleClose}
            position={position}
            withArrow={false}
            mobileHeightMode="fit"
        >
            <PopoverBody withPadding={false}>
                <div
                    className={classNames("colorPickerPopover__wrapper", className, {
                        colorPickerPopover__wrapper_mobile: isMobileBreakpoint
                    })}
                >
                    {alphaEnabled ? (
                        <RgbaColorPicker color={rgba} onChange={handlePickerChange as (val: RGBA) => void} />
                    ) : (
                        <HexColorPicker color={hex} onChange={handlePickerChange as (val: string) => void} />
                    )}
                    {colorFormatMode && (
                        <div
                            className={classNames("colorPickerPopover__inputs", {
                                colorPickerPopover__inputsRgb: colorFormatMode === "rgb",
                                colorPickerPopover__inputsHex: colorFormatMode === "hex"
                            })}
                        >
                            <Dropdown
                                className="colorPickerPopover__formatDropdown"
                                options={FORMAT_OPTIONS}
                                value={colorFormatMode}
                                size="small"
                                onOpenChange={setIsFormatDropdownOpen}
                                onChange={(option) =>
                                    setColorFormatMode((option as IDropdownOption).value as ColorFormat)
                                }
                            />
                            {colorFormatMode === "hex" ? (
                                <TextField
                                    type="text"
                                    size="small"
                                    value={localHex}
                                    onChange={handleHexInputChange}
                                    placeholder="Hex"
                                    autoComplete="off"
                                    className="colorPickerPopover__hexInput"
                                />
                            ) : (
                                <div className="colorPickerPopover__rgbInputs">
                                    {RGB_CHANNELS.map((channel) => (
                                        <TextField
                                            className="colorPickerPopover__rgbInput"
                                            key={channel}
                                            size="small"
                                            value={rgba[channel]}
                                            autoComplete="off"
                                            placeholder={channel}
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
                                    className="colorPickerPopover__alphaInput"
                                    onChange={handleAlphaChange}
                                    IconAfter={Percent}
                                />
                            )}
                        </div>
                    )}

                    {recentColors && recentColors?.length > 0 && (
                        <div className="colorPickerPopover__recents">
                            {recentColors.map((recentColor) => (
                                <div className="colorPickerPopover__recentColorWrapper" key={recentColor}>
                                    <button
                                        key={recentColor}
                                        type="button"
                                        className={classNames("colorPickerPopover__recentColor", {
                                            colorPickerPopover__recentColor__empty: !recentColor
                                        })}
                                        aria-label={`Select recent color ${recentColor}`}
                                        onClick={() => applyRecentColor(recentColor)}
                                        style={{
                                            "--color-picker-recent-color": recentColor
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverBody>
        </Popover>
    );
};

export { IColorPickerPopoverProps, ColorPickerPopover as default };
