import React, { FC } from "react";
import classNames from "classnames";

// Styles
import "./OTPFieldInput.scss";

interface IOTPFieldInputProps {
    className?: string;
}

const OTPFieldInput: FC<IOTPFieldInputProps> = ({ className }) => {
    //  otpFieldInput_size_large, otpFieldInput_size_medium, otpFieldInput_state_error, otpFieldInput_state_disabled
    return (
        <input
            type="number"
            className={classNames("otpFieldInput otpFieldInput_state_disabled otpFieldInput_size_large", className)}
        />
    );
};

export { IOTPFieldInputProps, OTPFieldInput as default };
