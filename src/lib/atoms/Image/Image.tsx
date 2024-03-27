import React, { FC, HTMLAttributes, ReactNode, useMemo } from 'react';
import classnames from 'classnames';

// Components
import Empty from '../Empty';
import Tooltip from '../../molecules/Tooltip';
import Checkbox from '../../molecules/Checkbox';

// Styles
import './Image.scss';

export interface IImageProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Image path to display
     */
    src: string;
    /**
     * Will add a border when set to "true"
     */
    withBorder: boolean;
    /**
     * The property will add a checkbox and an overlay over the image.
     */
    selectMode: boolean;
    /**
     * Customize checkbox(will be rendered only when "selectMode" is set to "true").
     */
    checkboxProps: {};
    /**
     * Customize image tag with this property.
     */
    imageProps: HTMLAttributes<HTMLImageElement>;
    /**
     * The property will render "actions" when "selectMode" is not setted to "true". Any valid React node
     */
    actions: ReactNode;
    /**
     * Will add a title to the top of Image atom. Any valid React node
     */
    title: string;
    /**
     * Title for 'Tooltip'.
     */
    tooltipTitle: string | ReactNode;
    /**
     * Additional className
     */
    className: string;
    /**
     * Image atom also can be included in "Form" organism. It can be validated as other "Form" elements
     */
    isValid: boolean;
    /**
     * Empty state text for component
     */
    emptyText: string;
}

const Image: FC<IImageProps> = ({
    src,
    withBorder = false,
    selectMode = false,
    actions,
    title,
    imageProps,
    checkboxProps,
    className,
    isValid = true,
    tooltipTitle,
    emptyText = 'No image to display',
    ...restProps
}) => {
    const isValidSource = useMemo(() => typeof src === 'string' && src !== '', [src]);

    return (
        /*@ts-ignore */
        <Tooltip title={tooltipTitle}>
            <div
                className={classnames('image-holder', className, {
                    'with-border': withBorder,
                    error: !isValid
                })}
                {...restProps}
            >
                {isValidSource ? (
                    <div className="image-content">
                        <img src={src} alt={title} {...imageProps} />
                        {selectMode && (
                            <label className="image-label-holder">
                                <ul className="image-heading">
                                    <li className="image-cra">
                                        {/*@ts-ignore */}
                                        <Checkbox size="big" {...checkboxProps} />
                                    </li>
                                    {title && <li className="image-title ellipsis-text">{title}</li>}
                                </ul>
                            </label>
                        )}
                        {actions && !selectMode && (
                            <div className="image-actions-holder">
                                {title && (
                                    <ul className="image-heading">
                                        <li className="image-title ellipsis-text">{title}</li>
                                    </ul>
                                )}
                                <div className="image-actions">{actions}</div>
                            </div>
                        )}
                    </div>
                ) : (
                    /*@ts-ignore */
                    <Empty type="data" title={emptyText} className="image-empty-state-holder" />
                )}
            </div>
        </Tooltip>
    );
};

export default Image;
