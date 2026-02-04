import classNames from "classnames";
import React from "react";

// Components
import Button from "@components/atoms/Button";

import './Preset.scss';
import { DatePickerSizes } from "../../types";

interface IPresetProps {
    /**
     * Label of preset item
     */
    label: string;
    /**
     * Callback which triggers when preset is clicked
     * @returns void
     */
    onClick: () => void;
    /**
     * 
     */
    className?: string;
    /**
     * Marks the preset as selected if true
     */
    selected: boolean;
    /**
     * Size of the preset item
     * Possible values: `small | medium | large`
     */
    size?: DatePickerSizes;
    /**
     * Marks the preset as disabled if true
     */
    disabled?: boolean;
}

/**
 * Preset item shown in Datepicker
 */
const Preset: React.FC<IPresetProps> = ({ label, onClick, className, selected, size, disabled }) => {
    return (
        <Button
            type="button"
            className={classNames("datePickerPreset", className, {
                "datePickerPreset_selected": selected,
                "datePickerPreset_disabled": disabled,
            })}
            onClick={onClick}
            size={size}
            disabled={disabled}
        >
            {label}
        </Button>
    );
};

export default Preset;
