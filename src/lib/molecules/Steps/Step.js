import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { stepsConfig } from 'configs';

import Icon from '../../atoms/Icon';
import Tooltip from '../Tooltip';

import DetailedView from './DetailedView';

import './index.scss';

function WithTooltip({ tooltip, children }) {
    if (!tooltip) return children;

    return <Tooltip title={tooltip}>{children}</Tooltip>;
}

function Step({
    title,
    label,
    onClick,
    icon,
    status,
    appearance,
    failColor,
    successColor,
    heroColor,
    style,
    extraLines,
    stepsCount,
    current,
    tooltip,
    direction,
    detailedView,
    __index
}) {
    const stepBody = (
        <li
            className={classnames('step', `s-${status}`, {
                clickable: !!onClick,
                passed: status === 'fail' || status === 'success'
            })}
            onClick={onClick}
            style={{
                '--danger': failColor,
                '--confirm': successColor,
                '--hero': heroColor,
                ...style
            }}
        >
            {appearance === stepsConfig.appearance[1] ? (
                <div className="step-dot" />
            ) : (
                <div className="step-circle">
                    {icon ? (
                        <Icon type={icon} />
                    ) : (
                        <>
                            <div className="step-layer layer-1">{__index}</div>
                            <div className="step-layer layer-2">
                                <Icon type={status === 'fail' ? 'bc-icon-clear' : 'bc-icon-selected'} />
                            </div>
                        </>
                    )}
                </div>
            )}
            <div
                className={classnames('step-texts', {
                    both: !!title && !!label
                })}
            >
                {title && <div className="step-title">{title}</div>}
                {label && <div className="step-label">{label}</div>}
            </div>
        </li>
    );

    return (
        <>
            {(__index !== 1 || extraLines) && (
                <li className="line-box">
                    <div
                        className={classnames('line', `s-${status}`, {
                            active: current >= __index
                        })}
                        style={{
                            '--danger': failColor,
                            '--confirm': successColor,
                            '--hero': heroColor
                        }}
                    />
                </li>
            )}
            {detailedView ? (
                <DetailedView direction={direction} content={detailedView}>
                    {stepBody}
                </DetailedView>
            ) : (
                <WithTooltip tooltip={tooltip}>{stepBody}</WithTooltip>
            )}
            {__index === stepsCount && extraLines && (
                <li className="line-box">
                    <div
                        className={classnames('line', `s-${status}`, {
                            active: current === stepsCount
                        })}
                        style={{
                            '--danger': failColor,
                            '--confirm': successColor,
                            '--hero': heroColor
                        }}
                    />
                </li>
            )}
        </>
    );
}

Step.propTypes = {
    /**
     * Title of Step
     */
    title: PropTypes.string,
    /**
     * Label of Step
     */
    label: PropTypes.string,
    /**
     * Tooltip of Step
     */
    tooltip: PropTypes.string,
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

Step.defaultProps = {
    appearance: stepsConfig.appearance[0]
};

export default Step;
