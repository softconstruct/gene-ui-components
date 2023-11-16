import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { childrenOf } from 'utils';
import { stepsConfig } from 'configs';

import Step from './Step';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function getStepStatus(current, index, statusProp) {
    if (current > index) return 'success';
    if (current < index) return 'initial';
    return statusProp || 'current';
}

function Steps({
    direction,
    size,
    appearance,
    highlightCurrent,
    extraLines,
    children,
    current,
    status,
    failColor,
    successColor,
    heroColor,
    className,
    ...rest
}) {
    return (
        <ul
            className={classnames(
                'steps-holder',
                `s-${size}`,
                `d-${direction}`,
                `a-${appearance}`,
                {
                    'highlight-current': highlightCurrent
                },
                className
            )}
            style={{
                '--danger': failColor,
                '--confirm': successColor,
                '--hero': heroColor
            }}
            {...rest}
        >
            {React.Children.map(children, (child, i) => {
                const stepStatus = child.props.status || getStepStatus(current, i, status);
                return (
                    <>
                        {React.cloneElement(child, {
                            __index: i + 1,
                            status: stepStatus,
                            appearance,
                            extraLines,
                            stepsCount: children.length,
                            current,
                            direction
                        })}
                    </>
                );
            })}
        </ul>
    );
}

Steps.propTypes = {
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
     * The child or children of 'Steps' molecule
     */
    children: childrenOf([Step]),
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

Steps.defaultProps = {
    direction: stepsConfig.direction[0],
    size: stepsConfig.size[0],
    appearance: stepsConfig.appearance[0],
    highlightCurrent: false,
    extraLines: false,
    current: 0
};

export default Steps;
