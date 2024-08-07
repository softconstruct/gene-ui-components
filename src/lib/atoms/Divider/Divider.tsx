import React, { FC, JSX } from 'react';

// Styles
import './Divider.scss';
import { Icon as IconComponent } from '../../../index';
import classNames from 'classnames';

interface IDividerProps {
    appearance?: 'default' | 'strong' | 'brand' | 'inverse';
    alignContent?: 'right' | 'center' | 'left';
    isVertical?: boolean;
    Icon?: JSX.Element;
    label?: string;
    labelPosition?: 'before' | 'after' | 'center';
}

/**
 * A divider separates sections of content to establish visual rhythm and hierarchy. Combine dividers with appropriate spacing and text hierarchy to effectively organize content within your layout.
 */

const Divider: FC<IDividerProps> = ({
    alignContent,
    appearance,
    Icon = <IconComponent className="divider__labelIcon" type={'bc-icon-info'} disabled={false} isFilled={true} />,
    isVertical,
    label,
    labelPosition = 'before'
}) => {
    return (
        <div
            className={classNames(
                `divider  divider_color_${appearance} divider_withLabel_${labelPosition} divider_align_${alignContent}`,
                {
                    divider_horizontal: !isVertical,
                    divider_vertical: isVertical
                }
            )}
        >
            {!isVertical && (
                <>
                    <div className="divider__label">
                        {label && <span className="divider__labelText">{label}</span>}
                        {Icon && Icon}
                    </div>
                    {/**TODO: Add Button component (or any component) when finish refactoring */}
                    {/* {label && <div className="divider__element">{label}</div>} */}
                </>
            )}
        </div>
    );
};

export { IDividerProps, Divider as default };
