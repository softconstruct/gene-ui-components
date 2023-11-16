import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const stepsConfig = {
    size: ['small', 'big'],
    direction: ['horizontal', 'vertical'],
    appearance: ['steps', 'dots'],
    status: ['initial', 'current', 'success', 'fail', 'activated']
};

const StepsProp = (props) => <div></div>;
const StepProp = (props) => <div></div>;

StepsProp.propTypes = {
    /**
     * View of 'Steps'.
     */
    direction: PropTypes.oneOf(stepsConfig.direction),
    /**
     * Size of 'Steps'.
     */
    size: PropTypes.oneOf(stepsConfig.size),
    /**
     * View type of 'Steps'.
     */
    appearance: PropTypes.oneOf(stepsConfig.appearance),
    /**
     * Turn on/off highlighted view of current step.
     */
    highlightCurrent: PropTypes.bool,
    /**
     * Show/hide extra lines in 'Steps'.
     */
    extraLines: PropTypes.bool,
    /**
     * The child or children of 'Steps' molecule (Step component)
     */
    children: PropTypes.node,
    /**
     * Initial/current step
     */
    current: PropTypes.number,
    /**
     * Status of current step
     */
    status: PropTypes.oneOf(stepsConfig.status),
    /**
     * Additional classname
     */
    className: PropTypes.string
};

StepProp.propTypes = {
    /**
     * Title of Step
     */
    title: PropTypes.string,
    /**
     * Label of Step
     */
    label: PropTypes.string,
    /**
     * Fires an event on ExtendedInput change((event: Event) => void).
     */
    onClick: PropTypes.func,
    /**
     * Icon for current step
     */
    icon: PropTypes.string,
    /**
     * Current step status
     */
    status: PropTypes.oneOf(stepsConfig.status),
    /**
     * View/style for step
     */
    appearance: PropTypes.oneOf(stepsConfig.appearance),
    /**
     * style for step
     */
    style: PropTypes.object,
    /**
     * Color for failed step
     */
    failColor: PropTypes.string,
    /**
     * Color for success step
     */
    successColor: PropTypes.string,
    /**
     * Default color for step
     */
    heroColor: PropTypes.string
};

export { StepsProp, StepProp };
