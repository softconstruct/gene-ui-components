import React, { useState, useCallback, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactPopover from 'react-tiny-popover';

// Helpers
import { positions } from 'configs';
import { noop } from 'utils';
import { useDeviceType } from 'hooks';

// Components
import { GeneUIDesignSystemContext } from '../../providers/GeneUIProvider';

// Styles
import './index.scss';

function Tooltip({
    children,
    position,
    size,
    style,
    text,
    title,
    transitionDuration,
    customPosition,
    alwaysShow,
    disableReposition,
    onClick,
    padding,
    screenType,
    isVisible,
    ...props
}) {
    const { isMobile } = useDeviceType(screenType);
    const [isPopoverOpen, setPopoverState] = useState(false);
    const { geneUIProviderRef } = useContext(GeneUIDesignSystemContext);

    const mouseEnterHandler = useCallback(() => !alwaysShow && setPopoverState(true), [alwaysShow]);
    const mouseLeaveHandler = useCallback(() => !alwaysShow && setPopoverState(false), [alwaysShow]);

    useEffect(() => {
        if (children.props.disabled) {
            mouseLeaveHandler();
        }
    }, [children.props.disabled]);

    const preferredPosition = position === 'auto' ? positions : position;

    const checkNudged = useCallback(
        ({ nudgedLeft, nudgedTop }) => (isMobile ? !(nudgedTop || nudgedLeft) : true),
        [isMobile]
    );

    return isVisible ? (
        <ReactPopover
            contentDestination={geneUIProviderRef.current}
            transitionDuration={transitionDuration}
            disableReposition={disableReposition}
            isOpen={alwaysShow || isPopoverOpen}
            position={preferredPosition}
            contentLocation={customPosition}
            align="center"
            padding={padding}
            content={(rect) =>
                checkNudged(rect) && (
                    <div
                        className={classnames('tooltip-c-p', `s-${size}`)}
                        style={{
                            ...style
                        }}
                        {...props}
                    >
                        {(title || text) && (
                            <div className="tooltip-content">
                                {title && <div className="tooltip-title">{title}</div>}
                                {text && <div className="tooltip-text">{text}</div>}
                            </div>
                        )}
                    </div>
                )
            }
        >
            {children
                ? React.cloneElement(children, {
                      onMouseEnter: mouseEnterHandler,
                      onMouseLeave: mouseLeaveHandler,
                      onClick: (e) => {
                          const { onClick: onClickHandler } = children.props;
                          typeof onClickHandler === 'function' && onClickHandler(e);
                          onClick(e);
                      }
                  })
                : null}
        </ReactPopover>
    ) : (
        children
    );
}

Tooltip.propTypes = {
    /**
     * Different sizes for 'Tooltip'.
     */
    size: PropTypes.oneOf(['default', 'small']),
    /**
     * Text for 'Tooltip'.
     */
    text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    /**
     * Title for 'Tooltip'.
     */
    title: PropTypes.string,
    /**
     * Style object, to have extra styles.
     */
    style: PropTypes.object,
    /**
     * Have always visible 'Tooltip'.
     */
    alwaysShow: PropTypes.bool,
    /**
     * Custom positions(left, top) for 'Tooltip'.
     */
    customPosition: PropTypes.shape({
        left: PropTypes.number,
        top: PropTypes.number
    }),
    /**
     * Duration for showing 'Tooltip'.
     */
    transitionDuration: PropTypes.number,
    /**
     * Any valid React node.
     */
    children: PropTypes.node,
    /**
     * Disable/Enable repositions.
     */
    disableReposition: PropTypes.bool,
    /**
     * 'Tooltip' position to be displayed
     */
    position: PropTypes.oneOf(['auto', ...positions]),
    /**
     * 'Tooltip' padding from the target element
     */
    padding: PropTypes.number,
    /**
     * If isVisible is false, the component will render only children without a tooltip wrapped.
     */
    isVisible: PropTypes.bool
};

Tooltip.defaultProps = {
    position: 'auto',
    size: 'default',
    transitionDuration: 0,
    disableReposition: false,
    onClick: noop,
    padding: 5,
    screenType: 'desktop',
    isVisible: true
};

export default Tooltip;
