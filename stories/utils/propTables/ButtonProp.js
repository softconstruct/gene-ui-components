import React from 'react';
import PropTypes from 'prop-types';

const ButtonProp = (props) => <div></div>;

const ButtonConfig = {
    appearance: ['default', 'outline', 'minimal', 'grayscale'],

    size: ['default', 'medium', 'big'],
    color: ['primary', 'confirm', 'danger', 'default'],
    flexibility: ['default', 'content-size', 'full-width'],
    itemsDirection: ['start', 'end'],
    cornerRadius: ['round', 'smooth']
};

ButtonProp.propTypes = {
    /**
     * Any valid React node
     */
    children: PropTypes.node,
    /**
     * The way how the Button should be displayed
     */
    appearance: PropTypes.oneOf(ButtonConfig.appearance),
    /**
     * Button size
     */
    size: PropTypes.oneOf(ButtonConfig.size),
    /**
     * How to display inscription in relation to it's parent in Button
     */
    flexibility: PropTypes.oneOf(ButtonConfig.flexibility),
    /**
     * Button color
     */
    color: PropTypes.oneOf(ButtonConfig.color),
    /**
     * Button children direction either from the start, or from the end
     */
    itemsDirection: PropTypes.oneOf(ButtonConfig.itemsDirection),
    /**
     * Button corner radius
     */
    cornerRadius: PropTypes.oneOf(ButtonConfig.cornerRadius),
    /**
     * The property will add an "Icon" as Button child. The valid values can be found in "Icon" atom
     */
    icon: PropTypes.string,
    /**
     * Button disabled state
     */
    disabled: PropTypes.bool,
    /**
     * Button active state
     */
    active: PropTypes.bool,
    /**
     * Adding shadow to button
     */
    withShadow: PropTypes.bool,
    /**
     * Button additianl className
     */
    className: PropTypes.string,
    /**
     * Button text transforms to spinner
     */
    loading: PropTypes.bool
};

ButtonProp.defaultProps = {
    appearance: ButtonConfig.appearance[0],
    size: ButtonConfig.size[0],
    flexibility: ButtonConfig.flexibility[0],
    color: ButtonConfig.color[0],
    itemsDirection: ButtonConfig.itemsDirection[0],
    cornerRadius: ButtonConfig.cornerRadius[0]
};

export default ButtonProp;
