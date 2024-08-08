import React, { FC, JSX } from 'react';

// Styles
import './Divider.scss';
import { Icon as IconComponent } from '../../../index';
import classNames from 'classnames';

interface IDividerProps {
    appearance?: 'default' | 'strong' | 'brand' | 'inverse';
    alignContentPosition?: 'right' | 'left';
    isVertical?: boolean;
    Icon?: JSX.Element | null;
    label?: string;
    labelPosition?: 'before' | 'after' | 'center';
    alignContent?: JSX.Element | string;
}

/**
 * A divider separates sections of content to establish visual rhythm and hierarchy. Combine dividers with appropriate spacing and text hierarchy to effectively organize content within your layout.
 */

const Divider: FC<IDividerProps> = ({
    alignContentPosition,
    appearance,
    //@ts-ignore
    Icon = <IconComponent className="divider__labelIcon" type={'bc-icon-info'} />,
    isVertical,
    label,
    labelPosition = 'before',
    alignContent
}) => {
    console.log(Icon);
    return (
        <div
            className={classNames(
                `divider  divider_color_${appearance} divider_withLabel_${labelPosition} divider_align_${alignContentPosition}`,
                {
                    divider_horizontal: !isVertical,
                    divider_vertical: isVertical,
                    [`divider_align_${alignContentPosition}`]: alignContent
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
                    {alignContent && <div className="divider__element">{alignContent}</div>}
                </>
            )}
        </div>
    );
};

export { IDividerProps, Divider as default };
