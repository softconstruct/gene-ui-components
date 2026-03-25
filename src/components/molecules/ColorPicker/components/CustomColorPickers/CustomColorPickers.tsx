import React, { FC, useCallback, useEffect, useState } from "react";

import { IHsvColor, RGBA } from "@components/molecules/ColorPicker/types";

// Styles
import "./CustomColorPickers.scss";

// Utils
import { hexToRgb, rgbToHex } from "../../utils";
import { AlphaSlider } from "./components/AlphaSlider";
import { HueSlider } from "./components/HueSlider";
// Sub-components
import { SaturationBrightnessPalette } from "./components/SaturationBrightnessPalette";
// Types
import { convertHsvToRgb, convertRgbToHsv } from "./utils/colorMath";

export interface IHexColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}

export interface IRgbaColorPickerProps {
    color: RGBA;
    onChange: (color: RGBA) => void;
}

export const HexColorPicker: FC<IHexColorPickerProps> = ({ color, onChange }) => {
    const [hsvColor, setHsvColor] = useState<IHsvColor>(() => {
        const rgbColor = hexToRgb(color) ?? { r: 255, g: 255, b: 255 };
        return convertRgbToHsv(rgbColor.r, rgbColor.g, rgbColor.b);
    });

    useEffect(() => {
        const newRgb = hexToRgb(color);
        if (!newRgb) return;

        setHsvColor((currentHsv: IHsvColor) => {
            const currentRgb = convertHsvToRgb(currentHsv.hue, currentHsv.saturation, currentHsv.value);
            const isIdenticalColor =
                newRgb.r === currentRgb.r && newRgb.g === currentRgb.g && newRgb.b === currentRgb.b;
            return isIdenticalColor ? currentHsv : convertRgbToHsv(newRgb.r, newRgb.g, newRgb.b);
        });
    }, [color]);

    const handleSaturationBrightnessChange = useCallback(
        (saturation: number, value: number) => {
            setHsvColor((previousHsv: IHsvColor) => {
                const updatedHsv = { ...previousHsv, saturation, value };
                const resultingRgb = convertHsvToRgb(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value);
                onChange(rgbToHex(resultingRgb));
                return updatedHsv;
            });
        },
        [onChange]
    );

    const handleHueChange = useCallback(
        (hueDegree: number) => {
            setHsvColor((previousHsv: IHsvColor) => {
                const updatedHsv = { ...previousHsv, hue: hueDegree };
                const resultingRgb = convertHsvToRgb(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value);
                onChange(rgbToHex(resultingRgb));
                return updatedHsv;
            });
        },
        [onChange]
    );

    return (
        <div className="colorPalette">
            <SaturationBrightnessPalette hsv={hsvColor} onChange={handleSaturationBrightnessChange} />
            <HueSlider hueDegree={hsvColor.hue} onChange={handleHueChange} />
        </div>
    );
};

export const RgbaColorPicker: FC<IRgbaColorPickerProps> = ({ color, onChange }) => {
    const [hsvColor, setHsvColor] = useState<IHsvColor>(() => convertRgbToHsv(color.r, color.g, color.b));
    const [opacityLevel, setOpacityLevel] = useState<number>(color.a ?? 1);

    useEffect(() => {
        setHsvColor((currentHsv: IHsvColor) => {
            const currentRgb = convertHsvToRgb(currentHsv.hue, currentHsv.saturation, currentHsv.value);
            const isIdenticalColor = color.r === currentRgb.r && color.g === currentRgb.g && color.b === currentRgb.b;
            return isIdenticalColor ? currentHsv : convertRgbToHsv(color.r, color.g, color.b);
        });
        setOpacityLevel(color.a ?? 1);
    }, [color]);

    const handleSaturationBrightnessChange = useCallback(
        (saturation: number, value: number) => {
            setHsvColor((previousHsv: IHsvColor) => {
                const updatedHsv = { ...previousHsv, saturation, value };
                const resultingRgb = convertHsvToRgb(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value);
                onChange({ ...resultingRgb, a: opacityLevel });
                return updatedHsv;
            });
        },
        [onChange, opacityLevel]
    );

    const handleHueChange = useCallback(
        (hueDegree: number) => {
            setHsvColor((previousHsv: IHsvColor) => {
                const updatedHsv = { ...previousHsv, hue: hueDegree };
                const resultingRgb = convertHsvToRgb(updatedHsv.hue, updatedHsv.saturation, updatedHsv.value);
                onChange({ ...resultingRgb, a: opacityLevel });
                return updatedHsv;
            });
        },
        [onChange, opacityLevel]
    );

    const handleAlphaChange = useCallback(
        (newOpacity: number) => {
            setOpacityLevel(newOpacity);
            const resultingRgb = convertHsvToRgb(hsvColor.hue, hsvColor.saturation, hsvColor.value);
            onChange({ ...resultingRgb, a: newOpacity });
        },
        [onChange, hsvColor]
    );

    const currentBaseRgb = convertHsvToRgb(hsvColor.hue, hsvColor.saturation, hsvColor.value);

    return (
        <div className="colorPalette">
            <SaturationBrightnessPalette hsv={hsvColor} onChange={handleSaturationBrightnessChange} />
            <HueSlider hueDegree={hsvColor.hue} onChange={handleHueChange} />
            <AlphaSlider opacityLevel={opacityLevel} baseRgb={currentBaseRgb} onChange={handleAlphaChange} />
        </div>
    );
};
