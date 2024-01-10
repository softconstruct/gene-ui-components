import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';

import { customScrollbarConfig } from 'configs';

import './index.scss';

const easeOutQuad = (t) => t * (2 - t);

const smoothScrollTo = (element, to, duration) => {
    const start = element.viewScrollTop || 0;
    const change = to - start;
    const startTime = performance.now();
    let animationFrameId;

    const animateScroll = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutQuad(progress);
        element.scrollTop(start + change * easeProgress);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animateScroll);
        }
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    const cancelScroll = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };

    return cancelScroll;
};

const CustomScrollbar = forwardRef(({ children, className, size, scrollTop, withSmoothScroll, ...restProps }, ref) => {
    useEffect(() => {
        const element = ref?.current;
        if (!element) return;

        let cancelScroll;

        if (withSmoothScroll) {
            cancelScroll = smoothScrollTo(element, scrollTop, 500);
        } else {
            element.scrollTop(scrollTop);
        }

        // Clean up the cancellation function if the component unmounts
        // or if there's a change in the scroll position
        return () => {
            cancelScroll && cancelScroll();
        };
    }, [scrollTop]);

    return (
        <Scrollbars
            ref={ref}
            renderView={({ style, ...props }) => (
                <div
                    {...props}
                    style={{
                        ...style,
                        margin: null,
                        '--sb-margin-bottom': `${style.marginBottom}px`,
                        '--sb-margin-side': `${style.marginRight}px`
                        /* This change will return the CORE-395 bug due to the fact that we
                         * used a virtualized-list in the ScrollBar everywhere.
                         * ...
                         * overflow: 'auto'
                         */
                    }}
                    className="scroll-content"
                />
            )}
            renderTrackHorizontal={(props) => <div {...props} className="scroll-track horizontal" />}
            renderTrackVertical={(props) => <div {...props} className="scroll-track vertical" />}
            renderThumbHorizontal={(props) => <div {...props} className="scroll-thumb horizontal" />}
            renderThumbVertical={(props) => <div {...props} className="scroll-thumb vertical" />}
            className={classnames('scroll-holder', `s-${size}`, className)}
            thumbMinSize={0}
            hideTracksWhenNotNeeded
            {...restProps}
        >
            {children}
        </Scrollbars>
    );
});

CustomScrollbar.propTypes = {
    /**
     * Any valid React node
     */
    children: PropTypes.node.isRequired,
    /**
     * Enable auto-height mode. When true container grows with content.
     */
    autoHeight: PropTypes.bool,
    /**
     * Set a minimum height for auto-height mode.
     */
    autoHeightMin: PropTypes.number,
    /**
     * Set a maximum height for auto-height mode
     */
    autoHeightMax: PropTypes.number,
    /**
     * Set the size for scrollbar thickness
     */
    size: PropTypes.oneOf(customScrollbarConfig.size),
    /**
     * Set scrollbar top position dynamically.
     * Prop works when ref is provided.
     */
    scrollTop: PropTypes.number,
    /**
     * This prop works with `scrollTop` prop
     * and provide auto scroll type if true
     * then auto scrolling will be smoother
     */
    withSmoothScroll: PropTypes.bool
};

CustomScrollbar.defaultProps = {
    autoHeight: false,
    autoHeightMin: 0,
    autoHeightMax: 5000,
    size: customScrollbarConfig.size[0],
    scrollTop: 0,
    withSmoothScroll: false
};

export default CustomScrollbar;
