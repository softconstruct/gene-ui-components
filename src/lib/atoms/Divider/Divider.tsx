import React, { cloneElement, FC, JSX } from 'react';
import { InfoOutline } from '@geneui/icons';
import classNames from 'classnames';

// Styles
import './Divider.scss';

interface IDividerProps {
    /**
     * Divider visual style <br/>
     * Possible values: `default | strong | brand | inverse`
     */
    appearance?: 'default' | 'strong' | 'brand' | 'inverse';
    /**
     * Divider content <br/>
     * The `alignContent` prop accepts a JSX element that will be displayed alongside the divider
     */
    alignContent?: JSX.Element;
    /**
     * Divider `alignContent` position <br/>
     * Possible values: `right | left`
     */
    alignContentPosition?: 'right' | 'left';
    /**
     * Divider direction <br/>
     * If the `isVertical` prop is `true`, the `Divider` will be displayed vertically otherwise the `Divider` will be displayed horizontally
     */
    isVertical?: boolean;
    /**
     * Divider icon <br/>
     * The `Icon` prop accepts a JSX element that will be displayed alongside the divider
     */
    Icon?: JSX.Element | null;
    /**
     * Divider label <br/>
     * Text which will be displayed with `Divider`. The position of the `label` depends on `labelPosition` prop
     */
    label?: string;
    /**
     * Divider `label` position <br/>
     * Possible values: `before | after | center`
     */
    labelPosition?: 'before' | 'after' | 'center';
}

/**
 * A divider separates sections of content to establish visual rhythm and hierarchy. Combine dividers with appropriate spacing and text hierarchy to effectively organize content within your layout.
 */

const Divider: FC<IDividerProps> = ({
    alignContentPosition = 'left',
    appearance = 'brand',
    //@ts-ignore
    Icon = <InfoOutline />,
    isVertical,
    label,
    labelPosition = 'before',
    alignContent
}) => {
    const iconClassName = Icon?.props?.className || '';
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
                        {label && <span className="divider__text ellipsis-text">{label}</span>}
                        {Icon &&
                            cloneElement(Icon, {
                                className: ` ${iconClassName} divider__icon`
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
