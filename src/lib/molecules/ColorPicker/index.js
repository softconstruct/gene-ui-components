import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { RgbaColorPicker, HexColorPicker } from 'react-colorful';

import { noop } from 'utils';

import './index.scss';

const defaultColors = [
    '#e91e63',
    '#9c26b0',
    '#673ab7',
    '#3f51b5',
    '#2096f3',
    '#06a9f4',
    '#02bcd4',
    '#029588',
    '#4caf50',
    '#ffeb3b',
    '#ffc108',
    '#fe9804',
    '#ff5622'
];

function rgbToHex(val) {
    const color = {
        r: val.r.toString(16),
        g: val.g.toString(16),
        b: val.b.toString(16)
    };

    if (color.r.length === 1) color.r = `0${color.r}`;
    if (color.g.length === 1) color.g = `0${color.g}`;
    if (color.b.length === 1) color.b = `0${color.b}`;

    return `#${color.r}${color.g}${color.b}`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;
}

function ColorPicker({
    alphaEnabled,
    recentColors,
    defaultColor,
    onChange,
    value,
    colorPickerProps,
    className,
    alphaValue,
    ...rest
}) {
    const [color, setColor] = useState(() => {
        const initialValue = value || defaultColor;
        return initialValue ? (typeof initialValue === 'object' ? rgbToHex(initialValue) : initialValue) : '#aabbcc';
    });

    const [colorRGBA, setColorRGBA] = useState(() => {
        const initialValue = value || defaultColor;
        const rgba = typeof initialValue === 'string' ? hexToRgb(initialValue) : initialValue;

        const customAlpha = rgba && rgba.a;
        return initialValue
            ? { ...rgba, a: customAlpha || alphaValue / 100 }
            : { r: 170, g: 187, b: 204, a: alphaValue / 100 };
    });

    const [alpha, setAlpha] = useState(alphaValue);

    const handlePickerChange = useCallback(
        (val) => {
            if (alphaEnabled) {
                const hex = typeof val === 'object' ? rgbToHex(val) : val;
                const rgba = typeof val === 'object' ? val : hexToRgb(val);
                const opacity = rgba.a ? (rgba.a === 0 ? 0 : Math.round(rgba.a * 100) || 100) : alpha;

                setColor(hex);
                setColorRGBA(rgba);
                setAlpha(opacity);
                onChange(hex, rgba, opacity);
            } else {
                const rgba = hexToRgb(val);
                setColor(val);
                setColorRGBA(rgba);
                onChange(val, rgba, alpha);
            }
        },
        [alpha, alphaEnabled, alpha]
    );

    const handleColorChange = useCallback(
        ({ target }) => {
            const { value } = target;
            const rgba = alphaEnabled ? hexToRgb(value) : value;
            setColor(value);
            rgba && setColorRGBA(rgba);
            onChange(value, rgba, alpha);
        },
        [alphaEnabled, alpha]
    );

    const handleAlphaChange = useCallback(
        ({ target }) => {
            const { value } = target;
            if (value > 100 || value < 0) {
                return;
            }

            if (value === '') {
                setAlpha(0);
                setColorRGBA({ ...colorRGBA, a: 0 });
                onChange(color, { ...colorRGBA, a: 0 }, alpha);
            } else {
                setAlpha(value);
                setColorRGBA({ ...colorRGBA, a: value / 100 });
                onChange(color, { ...colorRGBA, a: value / 100 }, alpha);
            }
        },
        [alphaEnabled, colorRGBA, onChange, color]
    );

    const sharedProps = {
        color: alphaEnabled ? colorRGBA : color,
        onChange: handlePickerChange,
        ...colorPickerProps
    };

    useEffect(() => {
        value && setColor(value);
    }, [value]);

    useEffect(() => {
        alphaValue && setAlpha(alphaValue);
    }, [alphaValue]);

    return (
        <div
            className={classnames(className, 'color-picker-holder', {
                'alpha-enabled': alphaEnabled
            })}
            {...rest}
        >
            {alphaEnabled ? <RgbaColorPicker {...sharedProps} /> : <HexColorPicker {...sharedProps} />}
            <div className="color-picker-samples">
                <button onClick={() => setColor('')}>
                    <small />
                </button>
                {recentColors.map((c) => (
                    <button
                        key={c}
                        onClick={() => handlePickerChange(c)}
                        style={{
                            background: c
                        }}
                    />
                ))}
            </div>
            <div className="color-picker-inputs">
                <input value={color} maxLength={7} onChange={handleColorChange} placeholder="Hex" />
                {alphaEnabled && (
                    <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Alpha"
                        value={alpha}
                        onChange={handleAlphaChange}
                    />
                )}
            </div>
        </div>
    );
}

ColorPicker.defaultProps = {
    alphaValue: 100,
    alphaEnabled: false,
    defaultColor: defaultColors[0],
    onChange: noop,
    recentColors: defaultColors
};

ColorPicker.propTypes = {
    /**
     * Show alpha in color picker
     */
    alphaEnabled: PropTypes.bool,
    /**
     * Array of default colors in hex format
     */
    recentColors: PropTypes.array,
    /**
     * Default selected color
     */
    defaultColor: PropTypes.string,
    /**
     * Fires an event when 'Color picker' changes  value ((hex: string, rgba: object, alpha: number) => void).
     */
    onChange: PropTypes.func,
    /**
     * Provided value ( if component controlled by you)
     */
    value: PropTypes.string,
    /**
     * Provided value for aplha ( if component controlled by you)
     */
    alphaValue: PropTypes.string,
    /**
     * Additional props for color picker, for more info about accepted props pls check 'react-colorful'
     */
    colorPickerProps: PropTypes.object,
    /**
     * External/additional className for component
     */
    className: PropTypes.string
};

export default ColorPicker;
