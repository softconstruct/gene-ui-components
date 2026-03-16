import React, { FC } from "react";
import classNames from "classnames";

import HelperText from "@components/atoms/HelperText";
import Text from "@components/atoms/Text";
import Notification from "@components/molecules/Notification";
import TextField from "@components/molecules/TextField";

// Styles
import "./OTPField.scss";

interface IOTPFieldProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    // fill OTPField component props interface
}

/**
 * The OTP Field component is an input field designed for entering a one-time password, often used for multi-factor authentication. The OTP Field component ensures that applications can securely verify user actions and identities, thereby protecting against unauthorized access and enhancing overall security.
 */
const OTPField: FC<IOTPFieldProps> = ({ className }) => {
    return (
        <div className={classNames("otpField otpField_size_large", className)}>
            {/* otpField_size_large / otpField_size_medium */}
            <div className="otpField__wrapper">
                <div className="otpField__textFieldWrapper">
                    <TextField className="otpField__textField" size="large" type="number" />
                    <TextField className="otpField__textField" size="large" type="number" />
                    <TextField className="otpField__textField" size="large" type="number" />
                    <TextField className="otpField__textField" size="large" type="number" />
                    <TextField className="otpField__textField" size="large" type="number" />
                    <TextField className="otpField__textField" size="large" type="number" />
                </div>
                <div className="otpField__content">
                    <HelperText className="otpField__helperText" text="Code is valid for" />
                    <Text className="otpField__timer" as="span" variant="bodyMediumMedium">
                        02:32
                    </Text>
                </div>
            </div>
            <Notification variant="sectionMessage" open status="error" title="The entered code is invalid." />
        </div>
    );
};

export { IOTPFieldProps, OTPField as default };
