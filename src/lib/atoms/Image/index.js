import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import Empty from '../Empty';
import Tooltip from '../../molecules/Tooltip';
import Checkbox from '../../molecules/Checkbox';

// Styles
import './index.scss';

function Image({
    src,
    withBorder,
    selectMode,
    actions,
    title,
    imageProps,
    checkboxProps,
    className,
    isValid,
    tooltipTitle,
    emptyText,
    ...restProps
}) {
    const isValidSource = useMemo(() => typeof src === 'string' && src !== '', [src]);

    return (
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
                    <Empty type="data" title={emptyText} className="image-empty-state-holder" />
                )}
            </div>
        </Tooltip>
    );
}

Image.propTypes = {
    /**
     * Image path to display
     */
    src: PropTypes.string.isRequired,
    /**
     * Will add a border when set to "true"
     */
    withBorder: PropTypes.bool,
    /**
     * The property will add a checkbox and an overlay over the image.
     */
    selectMode: PropTypes.bool,
    /**
     * Customize checkbox(will be rendered only when "selectMode" is set to "true").
     */
    checkboxProps: PropTypes.object,
    /**
     * Customize image tag with this property.
     */
    imageProps: PropTypes.object,
    /**
     * The property will render "actions" when "selectMode" is not setted to "true". Any valid React node
     */
    actions: PropTypes.node,
    /**
     * Will add a title to the top of Image atom. Any valid React node
     */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * Title for 'Tooltip'.
     */
    tooltipTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * Addional className
     */
    className: PropTypes.string,
    /**
     * Image atom also can be included in "Form" organism. It can be validated as other "Form" elements
     */
    isValid: PropTypes.bool,
    /**
     * Empty state text for component
     */
    emptyText: PropTypes.string
};

Image.defaultProps = {
    withBorder: false,
    selectMode: false,
    isValid: true,
    emptyText: 'No image to display'
};

export default Image;
