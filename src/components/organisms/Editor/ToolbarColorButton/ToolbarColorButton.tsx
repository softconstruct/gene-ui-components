import React, { FC, useState } from "react";

// Icons
import { CaretDownFilled, IconProps } from "@geneui/icons";

// Components
import ToolbarButton from "@components/organisms/Editor/ToolbarButton/ToolbarButton";

import ColorPickerPopover, { useColorPicker } from "@internal/components/ColorPickerPopover";

interface IToolbarColorButtonProps {
    /**
     * A React Functional Component rendered as the trigger's icon, before the caret.
     */
    Icon: FC<IconProps>;
    /**
     * An ARIA label for the trigger.
     */
    "aria-label": string;
    /**
     * Indicates whether the trigger is `disabled`, preventing user interaction, focus, click etc...
     */
    disabled?: boolean;
    /**
     * A callback function that is called with the picked color as the user drags the palette, and
     * with an empty string when the color is cleared.
     */
    onChange: (color: string) => void;
    /**
     * A callback function that is called once the palette is dismissed.
     */
    onClose?: () => void;
    /**
     * The color currently applied to the editor's selection, as a HEX string. The palette opens on
     * it, and an empty string opens the palette cleared.
     */
    color?: string;
    /**
     * HEX strings rendered as clickable color squares beneath the palette.
     */
    recentColors?: string[];
    /**
     * Additional class for the trigger.
     */
    className?: string;
}

/**
 * A `ToolbarButton` that opens a color palette. Internal to the Editor.
 */
const ToolbarColorButton: FC<IToolbarColorButtonProps> = ({
    Icon,
    "aria-label": ariaLabel,
    disabled,
    onChange,
    onClose,
    color = "",
    recentColors,
    className
}) => {
    const [triggerProps, setTriggerProps] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    const handleColorChange = (pickedColor: string): void => {
        if (pickedColor.toLowerCase() !== color.toLowerCase()) {
            onChange(pickedColor);
        }
    };

    const {
        rgba,
        hex,
        localHex,
        alpha,
        handlePickerChange,
        handleHexInputChange,
        handleRGBInputChange,
        handleAlphaChange,
        applyRecentColor
    } = useColorPicker({ onChange: (pickedColor) => handleColorChange(pickedColor ?? "") });

    const handleTriggerClick = (): void => {
        if (!isOpen) {
            applyRecentColor(color);
        }

        setIsOpen((previous) => !previous);
    };

    const handleClose = (): void => {
        setIsOpen(false);
        onClose?.();
    };

    return (
        <>
            <ToolbarButton
                triggerProps={triggerProps}
                IconBefore={Icon}
                IconAfter={CaretDownFilled}
                disabled={disabled}
                className={className}
                aria-label={ariaLabel}
                onClick={handleTriggerClick}
            />

            <ColorPickerPopover
                open={isOpen}
                setProps={setTriggerProps}
                onClose={handleClose}
                rgba={rgba}
                hex={hex}
                localHex={localHex}
                alpha={alpha}
                handlePickerChange={handlePickerChange}
                handleHexInputChange={handleHexInputChange}
                handleRGBInputChange={handleRGBInputChange}
                handleAlphaChange={handleAlphaChange}
                applyRecentColor={applyRecentColor}
                recentColors={recentColors}
            />
        </>
    );
};

export { IToolbarColorButtonProps, ToolbarColorButton as default };
