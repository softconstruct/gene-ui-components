import React, { FC, HTMLAttributes, useMemo } from 'react';
import classnames from 'classnames';

// Styles
import './Divider.scss';

export interface IDividerProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Divider direction. <br>
     * Possible values: `horizontal | vertical`
     */
    type: 'horizontal' | 'vertical';
    /**
     * Divider additional className
     */
    className?: string;
    /**
     * Divider size will be applied to height(when "type" is set to "vertical") or to width(when "type" is set to "horizontal"). <br>
     * Possible values: `string | number`
     */
    size?: string | number;
    /**
     * withSpace by default true. If you want to remove the divider`s spacing, switch to false
     */
    withSpace: boolean;
}

const Divider: FC<IDividerProps> = ({ type = 'vertical', className, size, withSpace = true, ...restProps }) => {
    const modifiedSize = useMemo(() => (typeof size === 'number' ? `${size / 10}rem` : size), [size]);

    const styles = useMemo(
        () => (type === 'vertical' ? { height: modifiedSize } : { width: modifiedSize }),
        [modifiedSize, type]
    );

    return (
        <div
            className={classnames('divider', `type-${type}`, { 'divider-withNoSpace': !withSpace }, className)}
            style={styles}
            {...restProps}
        />
    );
};

export default Divider;
