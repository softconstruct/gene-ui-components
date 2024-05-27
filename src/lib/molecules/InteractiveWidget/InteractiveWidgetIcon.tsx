import React, { CSSProperties, FC, PropsWithChildren } from 'react';
import classNames from 'classnames';

//Components
import Icon from '../../atoms/Icon';

interface IInteractiveWidgetIconProps extends PropsWithChildren {
    appearance?: 'default' | 'compact';
    iconColor?: string;
    iconBackground?: boolean;
}

const InteractiveWidgetIcon: FC<IInteractiveWidgetIconProps> = ({
    children,
    iconColor,
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
