import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { childrenOf } from 'utils';

// Local components
import TimelineItem, { timelineColors, timelineAppearances } from './item';

// Styles
import './index.scss';

function Timeline(props) {
    const { children, className, ...restProps } = props;

    return (
        <div className={classnames('timeline-holder', className)} {...restProps}>
            {children}
        </div>
    );
}

Timeline.propTypes = {
    /**
     * External/Additional className
     */
    className: PropTypes.string,
    /**
     * Any valid React node.
     */
    children: childrenOf([TimelineItem])
};

export { Timeline, TimelineItem, timelineColors, timelineAppearances };
