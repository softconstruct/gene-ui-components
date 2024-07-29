import React, { FC } from 'react';

// Styles
import './HelperText.scss';
import { Icon } from '../../../index';

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
    return (
        <div className="helperTextTestHolder">
            {/* Please add following classNames // helperText_size_medium /or/ helperText_size_small */}
            <div className="helperText helperText_state_rest helperText_size_medium">
                <div className="helperText__icon">
                    <Icon type={'bc-icon-info-48'} disabled={false} isFilled={true} />
                </div>
                <p className="helperText__text">Helper Text</p>
            </div>
            <div className="helperText helperText_state_danger helperText_size_medium">
                <div className="helperText__icon">
                    <Icon type={'bc-icon-info-48'} disabled={false} isFilled={true} />
                </div>
                <p className="helperText__text">Helper Text</p>
            </div>
            <div className="helperText helperText_state_disabled helperText_size_medium">
                <div className="helperText__icon">
                    <Icon type={'bc-icon-info-48'} disabled={false} isFilled={true} />
                </div>
                <p className="helperText__text">Helper Text</p>
            </div>
        </div>
    );
};

export { IHelperTextProps, HelperText as default };
