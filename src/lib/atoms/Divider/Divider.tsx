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
            {/* This component created partially because of missing many cases in design */}
            <div className="divider divider_color_default">
                <div className="divider__label">
                    <label htmlFor="#id" className="divider__labelText">
                        Label
                    </label>
                    <Icon className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                </div>
            </div>
            <div className="divider divider_color_strong">
                <div className="divider__label">
                    <label htmlFor="#id" className="divider__labelText">
                        Label
                    </label>
                    <Icon className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                </div>
            </div>
            <div className="divider divider_color_brand">
                <div className="divider__label">
                    <label htmlFor="#id" className="divider__labelText">
                        Label
                    </label>
                    <Icon className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                </div>
            </div>
            <div className="divider divider_color_inverse">
                <div className="divider__label">
                    <label htmlFor="#id" className="divider__labelText">
                        Label
                    </label>
                    <Icon className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />
                </div>
            </div>
        </div>
    );
};

export { IDividerProps, Divider as default };
