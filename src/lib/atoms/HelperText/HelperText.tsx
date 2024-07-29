import React, { FC } from 'react';

// Styles
import './HelperText.scss';

interface IHelperTextProps {
    /**
     * size description
     */
    size?: unknown;
}

/**
 * The Helper Text provides users an additional information or guidance related to a specific input field in a form. This text helps users understand the expected format, requirements, or purpose of the input, thereby improving form completion accuracy and user confidence.
 */
const HelperText: FC<IHelperTextProps> = ({ size }) => {
    return <div className="helperText">HelperText</div>;
};

export { IHelperTextProps, HelperText as default };
