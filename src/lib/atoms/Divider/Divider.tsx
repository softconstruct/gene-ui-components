import React, { cloneElement, FC, JSX } from 'react';
import { CheckMark } from '@geneui/icons';

// Styles
import './Divider.scss';
import classNames from 'classnames';

interface IDividerProps {
    appearance?: 'default' | 'strong' | 'brand' | 'inverse';
    alignContentPosition?: 'right' | 'left';
    isVertical?: boolean;
    Icon?: JSX.Element | null;
    label?: string;
    labelPosition?: 'before' | 'after' | 'center';
    alignContent?: JSX.Element;
}

/**
 * A divider separates sections of content to establish visual rhythm and hierarchy. Combine dividers with appropriate spacing and text hierarchy to effectively organize content within your layout.
 */

const Divider: FC<IDividerProps> = ({
    alignContentPosition = 'left',
    appearance = 'brand',
    //@ts-ignore
    Icon = <CheckMark />,
    isVertical,
    label,
    labelPosition = 'before',
    alignContent
}) => {
    return (
        <div
            className={classNames(`divider  divider_color_${appearance} divider_withLabel_${labelPosition}`, {
                divider_horizontal: !isVertical,
                divider_vertical: isVertical,
                [`divider_align_${alignContentPosition}`]: alignContent
            })}
        >
            {!isVertical && (
                <>
                    <div className="divider__label">
                        {label && <span className="divider__label__text ellipsis-text">{label}</span>}
                        {Icon &&
                            cloneElement(Icon, {
                                className: ` ${Icon.props?.className} divider__label__icon`
                            })}
                    </div>
                    {/**TODO: Add Button component (or any component) when finish refactoring */}
                    {alignContent && <div className="divider__element">{alignContent}</div>}
                </>
            )}
        </div>
    );
};

export { IDividerProps, Divider as default };
