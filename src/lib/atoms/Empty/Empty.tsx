import React, { FC, HTMLAttributes, ReactNode } from 'react';
import classnames from 'classnames';

// Utils
import { images } from './utils';

// Styles
import './Empty.scss';

interface IEmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /**
     * Available style varieties of Empty atom to display
     */
    appearance?: 'with-circles' | 'without-circles' | 'greyscale' | 'transparent';
    /**
     * Types of data Empty atom should represent
     */
    type?: 'data' | 'image' | 'search' | 'message';
    /**
     * Empty atom size
     */
    size?: 'big' | 'medium' | 'small';
    /**
     * Will add a title to the Empty atom. Any valid React node
     */
    title?: ReactNode | string;
    /**
     * Will add a subtitle to the Empty atom. Any valid React node
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
    appearance = 'with-circles',
    type = 'data',
    size = 'big',
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

export { IEmptyProps, Empty as default };
