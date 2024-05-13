import React, { FC, HTMLAttributes, MouseEvent, KeyboardEvent, useRef, ReactNode } from 'react';
import classNames from 'classnames';

//Components
import { Switcher, Tag, Tooltip, Icon } from '../../../index';
import InteractiveWidgetIcon from './InteractiveWidgetIcon';

//Hooks
import { useEllipsisDetection } from '../../../hooks';

// Styles
import './InteractiveWidget.scss';

interface IInteractiveWidgetProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Show/Hide border.
     */
    withBorder?: boolean;
    /**
     * Additional className.
     */
    className?: string;
    /**
     * Fires an event on Panel click `((event: Event) => void)`.
     */
    onClick?: (event: MouseEvent | KeyboardEvent) => void;
    /**
     * Disabled state.
     */
    disabled?: boolean;
    /**
     * The `icon` prop determines the representation of an icon within the component.
     * It can be a string, such as a URL for an SVG image, or a React component for example <Icon> component.
     */
    icon?: string | ReactNode;
    /**
     * This property controls the size of the icon, influencing the appearance of the component.<br>
     * Possible values: `'default' | 'compact'`
     */
    appearance?: 'default' | 'compact';
    /**
     * The `iconColor` prop determines the color of the icon in the component.
     * It should be a string representing a valid CSS color value.
     */
    iconColor?: string;
    /**
     * Label for tag component.
     * Adding props you will add the `<Tag/>` component.
     */
    tagName?: string;
    /**
     * color for tag.
     */
    tagColor?: string;
    /**
     * Props for `<Switcher/>` component (see `<Switcher/>` component documentation).
     * Adding props you wil add the component.
     */
    switcherProps?: typeof Switcher.propTypes;
    /**
     * The main descriptive text or title for the component.
     */
    title?: string;
    /**
     * Additional information or tooltip string that appears when hovering over the info icon next to the title.
     * If not provided, the info icon will not be displayed.
     */
    titleInfo?: string;
    /**
     * Description paragraph.
     */
    description?: string;
    /**
     * icon background for default appearance.
     */
    iconBackground?: boolean;
}

const InteractiveWidget: FC<IInteractiveWidgetProps> = ({
    className,
    withBorder = true,
    onClick,
    disabled = false,
    icon,
    title,
    appearance = 'default',
    iconColor,
    tagName,
    tagColor,
    switcherProps,
    titleInfo,
    description,
    iconBackground = true,
    ...restProps
}) => {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const descriptionRef = useRef<HTMLParagraphElement | null>(null);
    const isTitleTruncated = useEllipsisDetection(titleRef);
    const isDescriptionTruncated = useEllipsisDetection(descriptionRef);

    return (
        <div
            className={classNames(
                'interactiveWidget',
                {
                    'interactiveWidget-border': withBorder,
                    'interactiveWidget-pointer': onClick,
                    'interactiveWidget-disabled': disabled
                },
                className
            )}
            {...(!disabled && onClick ? { onClick: (event: MouseEvent<HTMLDivElement>) => onClick(event) } : {})}
            tabIndex={0}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                onClick && onClick(event);
            }}
            {...restProps}
        >
            <div className={'interactiveWidget__wrapper'}>
                {icon && appearance === 'default' && (
                    <InteractiveWidgetIcon
                        children={icon}
                        appearance={appearance}
                        iconColor={iconColor}
                        iconBackground={iconBackground}
                    />
                )}
                <div className={classNames('interactiveWidget__content')}>
                    <div className={`interactiveWidget__header interactiveWidget__header-${appearance}`}>
                        {icon && appearance === 'compact' && (
                            <InteractiveWidgetIcon children={icon} appearance={appearance} iconColor={iconColor} />
                        )}
                        <div className="interactiveWidget__titleWrapper">
                            {title && (
                                // @ts-ignore
                                <Tooltip text={title} isVisible={isTitleTruncated}>
                                    <h3 className={'interactiveWidget__title ellipsis-text'} ref={titleRef}>
                                        {title}
                                    </h3>
                                </Tooltip>
                            )}
                            {titleInfo && title && (
                                // @ts-ignore
                                <Tooltip text={titleInfo}>
                                    {/*@ts-ignore*/}
                                    <Icon className={'interactiveWidget__infoIcon'} type={'bc-icon-info-48'} />
                                </Tooltip>
                            )}
                        </div>
                        {(switcherProps || tagName) && (
                            <div className="interactiveWidget__components">
                                {tagName && (
                                    // @ts-ignore
                                    <Tag
                                        name={tagName}
                                        color={tagColor}
                                        appearance="outline"
                                        size="small"
                                        cornerRadius={'smooth-radius'}
                                    />
                                )}
                                {switcherProps && (
                                    // @ts-ignore
                                    <Switcher
                                        className={'interactiveWidget__switcher'}
                                        changeOnEnter
                                        {...switcherProps}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    {description && (
                        //@ts-ignore
                        <Tooltip text={description} isVisible={isDescriptionTruncated}>
                            <p className="interactiveWidget__description" ref={descriptionRef}>
                                {description}
                            </p>
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
};

export { IInteractiveWidgetProps, InteractiveWidget as default };
