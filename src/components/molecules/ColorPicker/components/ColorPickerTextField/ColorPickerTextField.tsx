import React from "react";

import { Percent } from "@geneui/icons";

import "./ColorPickerTextField.scss";

import { Divider } from "../../../../../index";

const ColorPickerTextField = () => {
    return (
        <div className="colorPickerTextField">
            <div className="colorPickerTextField__wrapper">
                <div className="colorPickerTextField__colorIndicator">{/* Here should be indicator component */}</div>
                <div className="colorPickerTextField__value">
                    <input type="text" placeholder="Value" className="colorPickerTextField__input" />
                </div>
                <Divider direction="vertical" className="colorPickerTextField__divider" />
                <div className="colorPickerTextField__percent">
                    <input type="text" placeholder="100" className="colorPickerTextField__input" />
                    <div className="colorPickerTextField__icon">
                        <Percent size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorPickerTextField;
