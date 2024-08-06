import React, { FC } from 'react';

// Styles
import './Divider.scss';
import { Icon } from '../../../index';

interface IDividerProps {
    /**
     * type description
     */
    type?: unknown;
}

/**
 * A divider separates sections of content to establish visual rhythm and hierarchy. Combine dividers with appropriate spacing and text hierarchy to effectively organize content within your layout.
 */
const Divider: FC<IDividerProps> = ({ type }) => {
    return (
        <div className="dividerTestHolder">
            <div className="divider divider_horizontal divider_color_default divider_withLabel_before divider_align_right">
                <div className="divider__label">
                    <span className="divider__labelText">Label</span>
                    <Icon className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                </div>
                <div className="divider__element">swap</div>
            </div>
            <div className="divider divider_horizontal divider_color_strong divider_withLabel_center">
                <div className="divider__label">
                    <span className="divider__labelText">Label</span>
                    <Icon className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                </div>
            </div>
            <div className="divider divider_horizontal divider_color_brand divider_withLabel_after">
                <div className="divider__label">
                    <span className="divider__labelText">Label</span>
                    <Icon className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                </div>
            </div>
            <div className="divider divider_horizontal divider_color_inverse divider_withLabel_before">
                <div className="divider__label">
                    <span className="divider__labelText">Label</span>
                    <Icon className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                </div>
            </div>
        </div>
    );
};

export { IDividerProps, Divider as default };
