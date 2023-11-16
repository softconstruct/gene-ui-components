import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

import { noop } from 'utils';

function PopoverProp(props) {
    return <div />;
}

const screenTypes = ['desktop', 'mobile'];
const Config = {
    align: ['start', 'end', 'center'],
    position: ['bottom', 'left', 'right', 'top'],
    cornerRadius: ['full-radius', 'smooth-radius'],
    behave: ['toggle', 'open']
};

PopoverProp.propTypes = {
    /**
     * The component that need to be displayed in the Popover. Any valid React node
     */
    Content: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    /**
     * The component that need to be displayed as Popover header. Any valid React node
     */
    Header: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /**
     * The component that need to be displayed as Popover footer. Any valid React node
     */
    Footer: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    /**
     * The component which click needs to trigger the Popover to open. Need to passed as child to Popover. Any valid React node
     */
    children: PropTypes.node,
    /**
     * The Popover will get the width of its child. The property will not work when "width" prop is specified
     */
    extendTargetWidth: PropTypes.bool,
    /**
     * The Popover "Content" minimum scroll height
     */
    minHeight: PropTypes.number,
    /**
     * The Popover "Content" scroll height
     */
    height: PropTypes.number,
    /**
     * The Popover "Content" maximum scroll height. Will not work when the "screenType" is "mobile"
     */
    maxHeight: PropTypes.number,
    /**
     * Use this prop to control the Popover. Note the component will start not to open and close automatically
     */
    isOpen: PropTypes.bool,
    /**
     * Popover position to be displayed
     */
    position: PropTypes.oneOfType([
        PropTypes.oneOf(Config.position),
        PropTypes.arrayOf(PropTypes.oneOf(Config.position))
    ]),
    /**
     * Will called each time the popover need to be toggled(child click, close button click, backdrop click).
     * (event: Event, isOpen: bool) => void
     */
    toggleHandler: PropTypes.func,
    /**
     * Possible values are start, center, and end.
     * If start is specified, the popover content's top or left location is aligned with its target's.
     * With end specified, the content's bottom or right location is aligned with its target's.
     * If center is specified, the popover content and target's centers are aligned.
     */
    align: PropTypes.oneOfType([PropTypes.oneOf(Config.align), PropTypes.arrayOf(PropTypes.oneOf(Config.align))]),
    /**
     * If you'd like to apply styles to the single container div that your popover content is rendered within via stylesheets,
     * you can specify a custom className for the container here.
     */
    className: PropTypes.string,
    /**
     * This number determines the gap, in pixels, between your target content and your popover content
     */
    padding: PropTypes.number,
    /**
     * If this property is enabled, rather than the popover content repositioning on a boundary collision,
     * the popover content container will move beyond the window's bounds.
     * You are, however, supplied with nudgedLeft and nudgedTop values, so you may choose to handle content overflow as you wish.
     */
    disableReposition: PropTypes.bool,
    /**
     * Popover corner radius
     */
    cornerRadius: PropTypes.oneOf(Config.cornerRadius),
    /**
     * The swith between mobile and desktop version of Popover will be applied automatically, when the prop is not specified.
     * When the prop is present it must be changed from outside.
     */
    screenType: PropTypes.oneOf(screenTypes),
    /**
     * Specify does Popover needs to be toggled on child click
     */
    behave: PropTypes.oneOf(Config.behave),
    /**
     * Popover content ref
     */
    contentRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
    /**
     * props for scrollbar
     */
    scrollbarProps: PropTypes.object
};

PopoverProp.defaultProps = {
    cornerRadius: Config.cornerRadius[0],
    position: Config.position,
    align: Config.align,
    toggleHandler: noop,
    behave: Config.behave[0],
    extendTargetWidth: true,
    disableReposition: true,
    minHeight: 0,
    maxHeight: 510,
    height: null,
    padding: 10
};

export default PopoverProp;
