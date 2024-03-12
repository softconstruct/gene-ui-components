import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

// Statics
import { appearances, images, sizes, types } from './helper';

// Styles
import './Empty.scss';

interface IEmptyProps {
    /**
     * Available style varieties of Empty atom to display
     */
    appearance?: (typeof appearances)[number];
    /**
     * Types of data Empty atom should represent
     */
    type?: (typeof types)[number];
    /**
     * Empty atom size
     */
    size?: (typeof sizes)[number];
    /**
     * Will add a title to the "Empty" atom. Any valid React node
     */
    title?: ReactNode | string;
    /**
     * Will add a subtitle to the "Empty" atom. Any valid React node
     */
    subTitle?: ReactNode | string;
    /**
     * When set to "true" Empty atom will show a predefined image based on "appearance" and "type" props
     */
    withImage?: boolean;
    /**
     * Additional className
     */
    className?: string;
}

const Empty: FC<IEmptyProps> = ({
    appearance = appearances[0],
    type = types[0],
    size = sizes[0],
    withImage = true,
    title = 'No Data to Display',
    subTitle,
    className,
    ...restProps
}) => {
    return (
        <div {...restProps} className={classnames('empty-state-holder', `s-${size}`, className)}>
            {withImage && (
                <div className="empty-state-image">
                    <img alt="Empty" src={images[appearance][type]} />
                </div>
            )}
            {title && <div className="empty-state-title">{title}</div>}
            {subTitle && <div className="empty-state-subtitle">{subTitle}</div>}
        </div>
    );
};

Empty.displayName = 'Empty';

export { IEmptyProps, Empty as default };
