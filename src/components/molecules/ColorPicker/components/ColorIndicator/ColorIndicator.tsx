import React, { FC } from 'react';

import { Square } from "@geneui/icons";
import { hexToRgb } from '../../utils';
import Button from '@components/atoms/Button';

// Styles
import './ColorIndicator.scss';

interface IColorIndicator {
    onClick?: () => void;
    color: string;
    size?: "small" | "medium" | "large";
    alpha?: number;
}

/**
 * Sub-component for ColorPicker.
 * Used to show color indicator in TextField component. 
 */
const ColorIndicator: FC<IColorIndicator> = ({
    onClick,
    color,
    size,
    alpha = 1,
}) => {
    const localRGB = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
    return (
        <button
            onClick={onClick}
            className='colorIndicator'
            style={{ width: 20, height: 20, backgroundColor: `rgba(${localRGB.r}, ${localRGB.g}, ${localRGB.b}, ${alpha})` }}
        />
    );
};

export default ColorIndicator;

{/* <Square
size={size === 'large' ? 24 : 20}
onClick={onClick}
style={{ color: `rgba(${localRGB.r}, ${localRGB.g}, ${localRGB.b}, ${alpha})` }}
/> */}