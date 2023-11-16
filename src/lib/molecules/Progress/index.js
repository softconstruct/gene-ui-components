import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { fileSizeDisplay, noop } from 'utils';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

function Progress({
    title,
    selectedAppearance,
    selectedSize,
    fileName,
    fullFileSize,
    selectedCircularAppearance,
    percentage,
    loaderStatuses,
    color,
    showCancel,
    showRestart,
    onCancel,
    onRestart,
    pathStyle,
    ...restProps
}) {
    const [percentageUpdated, setPercentageUpdated] = useState(percentage);

    useEffect(() => {
        const flooredPercentage = percentage >= 100 ? 100 : percentage || 0;
        setPercentageUpdated(flooredPercentage);
    }, [percentage]);

    const currentFileSize = (fullFileSize * percentageUpdated) / 100;
    const percentageStyle = `${percentageUpdated}%`;

    const restartHandler = useCallback(
        (e) => {
            onRestart(e);
        },
        [onRestart]
    );

    const cancelHandler = useCallback(
        (e) => {
            onCancel && onCancel(e);
        },
        [onCancel]
    );

    const statusExternal = (
        <>
            ({percentageStyle} {color === 'default' || color === 'success' ? loaderStatuses[0] : loaderStatuses[1]})
        </>
    );

    const circularProgress = (size) => (
        <div className={classnames('circular-progress-inner', `s-${size || selectedSize}`)}>
            <div className="circular-progress-back" />
            <svg viewBox="0 0 100 100">
                {percentageUpdated && (
                    <path
                        d="M 50,50 m 0,-47a 47,47 0 1 1 0,94a 47,47 0 1 1 0,-94"
                        style={{
                            strokeDasharray: `${(300 * percentageUpdated) / 100}px, 300px`,
                            ...pathStyle
                        }}
                    />
                )}
            </svg>
            <div className="circular-progress-layer">
                <div
                    className={classnames({
                        'layer-text': selectedAppearance === 'circular',
                        'to-be-colored': selectedAppearance === 'circular' && color !== 'default'
                    })}
                >
                    {selectedCircularAppearance === 'show-percentage' ? percentageStyle : fileName}
                </div>
                {selectedAppearance === 'circular' && showCancel && (
                    <div className="layer-action">
                        <Icon type="bc-icon-clear" />
                    </div>
                )}
            </div>
        </div>
    );

    const progressActions = (
        <div className="progress-actions">
            {color === 'fail' && showRestart && (
                <Button size="big" color="danger" onClick={restartHandler} appearance="minimal" icon="bc-icon-reset" />
            )}
            {showCancel && (
                <ul className="on-hover-layers">
                    {color === 'success' && percentage === 100 && (
                        <li>
                            <Icon type="bc-icon-success" />
                        </li>
                    )}
                    <li>
                        <Button
                            size="big"
                            color="default"
                            onClick={cancelHandler}
                            appearance="minimal"
                            icon="bc-icon-clear"
                        />
                    </li>
                </ul>
            )}
        </div>
    );

    return (
        <div
            className={classnames('progress-holder', `a-${selectedAppearance}`, `s-${selectedSize}`, `c-${color}`)}
            {...restProps}
        >
            {selectedAppearance === 'circular' ? (
                circularProgress()
            ) : (
                <>
                    {selectedAppearance !== 'linear' && (
                        <ul className="progress-structure">
                            {selectedAppearance === 'box-circular' && (
                                <li className="left-additional-info">{circularProgress('very-small')}</li>
                            )}
                            {selectedAppearance === 'box-bar' && (
                                <li className="left-additional-info">{percentageStyle}</li>
                            )}
                            <li className="left-info">
                                <div className="progress-title ellipsis-text">{title}</div>
                                {selectedAppearance !== 'default' && (
                                    <div
                                        className={classnames('progress-sub-title', {
                                            'to-be-colored':
                                                color !== 'default' &&
                                                selectedAppearance !== 'box-circular' &&
                                                selectedAppearance !== 'box-bar'
                                        })}
                                    >
                                        {fileSizeDisplay(currentFileSize)} / {fileSizeDisplay(fullFileSize)}
                                        {` `}
                                        {selectedAppearance === 'detailed' && statusExternal}
                                    </div>
                                )}
                            </li>
                            <li className="right-info">
                                {selectedAppearance === 'default' ? (
                                    <div
                                        className={classnames({
                                            'to-be-colored': color !== 'default',
                                            blended: percentageUpdated === 0
                                        })}
                                    >
                                        {percentageStyle}
                                    </div>
                                ) : (
                                    progressActions
                                )}
                            </li>
                        </ul>
                    )}
                    {selectedAppearance !== 'box-circular' && (
                        <>
                            <div className="progress-line">
                                <div className="progress-line-fill" style={{ width: percentageStyle }} />
                            </div>
                            {selectedAppearance === 'linear' && <div className="linear-progress-text">{title}</div>}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

Progress.propTypes = {
    /**
     * Text title for component
     */
    title: PropTypes.string,
    /**
     * displays filename when selectedCircularAppearance's value is [show-percentage]
     */
    fileName: PropTypes.string,
    /**
     * Displays cancel button
     */
    showCancel: PropTypes.bool,
    /**
     * Displays reset button
     */
    showRestart: PropTypes.bool,
    /**
     * The value of the progress indicator
     */
    percentage: PropTypes.number,
    /**
     * Size of current file
     */
    fullFileSize: PropTypes.number,
    /**
     * Style for path
     */
    pathStyle: PropTypes.object,
    /**
     * Array of text with length of two.
     * If selectedAppearance value is not default
     * It will display either first of second item from array based on color value
     */
    loaderStatuses: PropTypes.array.isRequired,
    /**
     * Controls color of progress bar
     */
    color: PropTypes.oneOf(['default', 'fail', 'success']),
    /**
     * Controls size of progress bar
     */
    selectedSize: PropTypes.oneOf(['big', 'medium', 'small', 'very-small']),
    /**
     * Displays either percent value or file value inside circular progress bar
     */
    selectedCircularAppearance: PropTypes.oneOf(['show-percentage', 'show-file-name']),
    /**
     * Controls appearance of progress bar
     */
    selectedAppearance: PropTypes.oneOf(['default', 'detailed', 'circular', 'box-bar', 'box-circular', 'linear']),
    /**
     * Fires event when user clicks on cancel button
     * (event: Event) => void
     */
    onCancel: PropTypes.func,
    /**
     * Fires event when user clicks on restart button
     * (event: Event) => void
     */
    onRestart: PropTypes.func
};

Progress.defaultProps = {
    onRestart: noop,
    onCancel: noop,
    percentage: 0,
    color: 'default',
    showCancel: true,
    showRestart: true,
    selectedSize: 'small',
    selectedAppearance: 'default',
    selectedCircularAppearance: 'show-percentage'
};

export default Progress;
