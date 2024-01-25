import React from 'react';
import PropTypes from 'prop-types';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

// Styles
import './index.scss';

function SkeletonLoader({ children, isBusy, width, ...restProps }) {
    return isBusy ? (
        <span
            className="skeleton-holder"
            style={{
                width: typeof width === 'number' ? `${width / 10}rem` : width
            }}
        >
            <SkeletonTheme>
                <Skeleton {...restProps} circle={restProps.circle} />
            </SkeletonTheme>
        </span>
    ) : (
        children
    );
}

SkeletonLoader.propTypes = {
    /**
     * Show circle shape when set to "true" otherwise shows square shape.
     */
    circle: PropTypes.bool,
    /**
     * Shows Skeleton when set to "true"
     */
    isBusy: PropTypes.bool,
    /**
     * Specify how many shapes need to be displayed
     */
    count: PropTypes.number,
    /**
     * Skeleton width
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Skeleton height
     */
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Wrapper for skeleton
     */
    wrapper: PropTypes.node,
    /**
     * What need to be displayed when "isBusy" is set to "false". Any valid React node
     */
    children: PropTypes.node,
    /**
     * Displaying shaped can be specified by duration(in seconds)
     */
    duration: PropTypes.number
};

SkeletonLoader.defaultProps = {
    count: 1,
    width: '100%',
    height: 40,
    duration: 1,
    isBusy: false,
    circle: false
};

export default SkeletonLoader;
