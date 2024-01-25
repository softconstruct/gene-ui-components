import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { optionConfig, screenTypes } from 'configs';
import { useDeviceType, useEllipsisDetection } from 'hooks';

// Components
import Icon from '../Icon';
import Tooltip from '../../molecules/Tooltip';

// Styles
import './index.scss';

function Option(props) {
    const {
        title,
        description,
        className,
        icon,
        color,
        active,
        checkMark,
        forwardMark,
        leftCustomElement,
        rightCustomElement,
        assignedValue,
        border,
        sticky,
        content,
        onClick,
        screenType,
        forwardedRef,
        disabled,
        titlePosition,
        ...restProps
    } = props;
    const titleRef = useRef(null);
    const hasTooltip = useEllipsisDetection(titleRef);
    const descriptionRef = useRef(null);
    const hasDescriptionTooltip = useEllipsisDetection(descriptionRef);
    const { isMobile } = useDeviceType(screenType);

    return (
        <label
            className={classnames('option-container', className, `border-${border}`, `sticky-${sticky}`, `c-${color}`, {
                'mobile-view': isMobile,
                'option-container-relative': titlePosition === optionConfig.titlePosition.center,
                active,
                disabled
            })}
            onClick={onClick}
            ref={forwardedRef}
            {...restProps}
        >
            {content}
            {(icon || leftCustomElement) && (
                <div className="option-left-elements">
                    {icon && <Icon type={icon} />}
                    {leftCustomElement}
                </div>
            )}
            <ul className="option-texts">
                <li>
                    {title && (
                        <Tooltip text={title} isVisible={hasTooltip}>
                            <div
                                className={classnames('option-title', 'ellipsis-text', {
                                    'option-title-center': titlePosition === optionConfig.titlePosition.center,
                                    'option-title-end': titlePosition === optionConfig.titlePosition.end
                                })}
                                ref={titleRef}
                            >
                                {title}
                            </div>
                        </Tooltip>
                    )}
                    {description && (
                        <Tooltip text={description} isVisible={hasDescriptionTooltip}>
                            <div ref={descriptionRef} className="option-description ellipsis-text">
                                {description}
                            </div>
                        </Tooltip>
                    )}
                </li>
                {assignedValue && <li className="assigned-value">{assignedValue}</li>}
            </ul>
            {(checkMark || forwardMark || rightCustomElement) && (
                <div className="option-right-elements">
                    {checkMark && <Icon type="bc-icon-selected" />}
                    {forwardMark && <Icon type="bc-icon-arrow-right" />}
                    {rightCustomElement}
                </div>
            )}
        </label>
    );
}

Option.defaultProps = {
    color: optionConfig.color[0],
    border: optionConfig.border[0],
    sticky: optionConfig.sticky[0],
    titlePosition: optionConfig.titlePosition.start,
    screenType: screenTypes[0]
};

Option.propTypes = {
    /**
     * Title of the option
     */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    /**
     * Description of the option which is displayed on the bottom of the title with small caps
     */
    description: PropTypes.string,
    /**
     * Adds additional className to the option
     */
    className: PropTypes.string,
    /**
     * Adds icon on the right side of the option
     */
    icon: PropTypes.string,
    /**
     * Changes text colors
     */
    color: PropTypes.oneOf(optionConfig.color),
    /**
     * Changes color to hero
     */
    active: PropTypes.bool,
    /**
     * Adds check icon and displays it when the option is active
     */
    checkMark: PropTypes.bool,
    /**
     * Adds to right arrow icon
     */
    forwardMark: PropTypes.bool,
    /**
     * Any element you can add to the left side
     */
    leftCustomElement: PropTypes.any,
    /**
     * Any element you can add to the right side
     */
    rightCustomElement: PropTypes.any,
    /**
     * Information you can display on the right side of the option
     */
    assignedValue: PropTypes.string,
    /**
     * Adds border to the option
     */
    border: PropTypes.oneOf(optionConfig.border),
    /**
     * Makes item sticky to scrolling element based on the position you choose
     */
    sticky: PropTypes.oneOf(optionConfig.sticky),
    /**
     * Additional elements for rendering in option
     */
    content: PropTypes.any,
    /**
     * Fires event when user click on one of the menu items;
     * (event: Event, item: Object) => void
     */
    onClick: PropTypes.func,
    /**
     * Controls screen type
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Controls button disable state
     */
    disabled: PropTypes.bool,
    /**
     * ref for label
     */
    forwardedRef: PropTypes.oneOfType([
        PropTypes.func, // for callback ref
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }) // for createRef() object
    ]),
    /**
     * Chose position for title
     */
    titlePosition: PropTypes.oneOf(['start', 'center', 'end'])
};

export default Option;
