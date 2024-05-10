import React, { CSSProperties, FC } from 'react';
import classNames from 'classnames';

//components
import { Icon } from '../../../index';

interface IInteractiveWidgetIconProps {
    children?: string | React.ReactNode;
    appearance?: 'default' | 'compact';
    iconColor?: string;
    iconBackground?: boolean;
}

const InteractiveWidgetIcon: FC<IInteractiveWidgetIconProps> = ({
    children,
    iconColor = '#000000',
    appearance,
    iconBackground
}) => {
    return (
        <div
            className={`widgetIcon widgetIcon-${appearance}`}
            style={iconColor ? ({ '--icon-color': iconColor, filter: 'alpha(opacity=60)' } as CSSProperties) : {}}
        >
            {iconBackground && <div className="widgetIcon__background" />}
            {typeof children === 'string' ? (
                // @ts-ignore
                <Icon type={children} className={classNames({ widgetIcon__iconDefault: appearance === 'default' })} />
            ) : (
                children
            )}
        </div>
    );
};

export default InteractiveWidgetIcon;
