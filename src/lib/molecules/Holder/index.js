import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Helpers
import { noop } from 'utils';
import { popoverV2Config } from 'configs';

// Components
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import Portal from '../../atoms/Portal';
import Scrollbar from '../../atoms/Scrollbar';
import ModuleTitle from '../../atoms/ModuleTitle';
import Tooltip from '../Tooltip';

// Styles
import './index.scss';

function Holder({
    title,
    footer,
    disabled,
    children,
    position,
    onChange,
    resetText,
    applyText,
    withPortal,
    className,
    onReset,
    onApply,
    applyDisabled,
    resetDisabled,
    defaultOpened,
    expandText,
    collapseText,
    portalContainer,
    rightIconType,
    leftIconType,
    filterIconType,
    openedWidth,
    disableOnHover,
    ...restProps
}) {
    const parentContainer = useRef(null);

    const isControlled = 'opened' in restProps;
    const [holderOpened, setHolderOpened] = useState(defaultOpened);
    const [holderHovered, setHolderHovered] = useState(false);
    const isOpened = isControlled ? restProps.opened : holderOpened;

    const handleEvent = (open) => {
        if (!isControlled) {
            setHolderOpened(open);
            !open && holderHovered && setHolderHovered(false);
        }
        onChange(open, holderHovered);
    };

    // Will open later
    const handleHover = (hovered) => {
        if (!disableOnHover && hovered !== holderHovered) {
            !isControlled && setHolderHovered(!holderOpened ? hovered : false);
            onChange(holderOpened, hovered);
        }
    };

    const Content = (
        <div
            className={classnames('holder', className, `holder-${position}`, {
                pinned: isOpened,
                opened: holderHovered || isOpened,
                disabled
            })}
            style={{ '--opened-width': openedWidth }}
            onMouseLeave={() => {
                if (!document.documentElement.classList.contains(popoverV2Config.onOpenClassName)) {
                    handleHover(false);
                }
            }}
            {...restProps}
        >
            <div className="holder-c-wrapper" ref={parentContainer}>
                <div className="holder-wrapper" onMouseEnter={() => handleHover(true)}>
                    <div className="holder-content">
                        {title && <ModuleTitle title={title} size="extra-big" />}
                        <div className="holder-body">
                            <Scrollbar>
                                <div className="holder-body-c">{children}</div>
                            </Scrollbar>
                        </div>
                        <div className="holder-footer">
                            {footer !== undefined ? (
                                footer
                            ) : (
                                <>
                                    <Button
                                        flexibility="full-width"
                                        appearance="minimal"
                                        color="default"
                                        disabled={resetDisabled}
                                        onClick={onReset}
                                    >
                                        {resetText}
                                    </Button>
                                    <Button
                                        flexibility="full-width"
                                        color="confirm"
                                        disabled={applyDisabled}
                                        onClick={onApply}
                                    >
                                        {applyText}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="holder-toggle">
                    <button className={classnames({ active: isOpened })}>
                        <Tooltip title={isOpened ? collapseText : expandText} position="right">
                            <div>
                                <Icon type={leftIconType} className="layer-1" onClick={() => handleEvent(false)} />
                                <Icon type={filterIconType} className="layer-2" onClick={() => handleEvent(true)} />
                            </div>
                        </Tooltip>
                        <Icon type={rightIconType} className="layer-3" onClick={() => handleEvent(true)} />
                    </button>
                </div>
            </div>
        </div>
    );

    return withPortal ? (
        <Portal isOpen container={portalContainer}>
            {Content}
        </Portal>
    ) : (
        Content
    );
}

Holder.propTypes = {
    /**
     * Custom footer,
     * Any valid React element
     */
    footer: PropTypes.node,
    /**
     * It prevents the user from changing the state(opened/closed) of holder
     */
    disabled: PropTypes.bool,
    /**
     * Content of holder,
     * Valid React element
     */
    children: PropTypes.node,
    /**
     * Fires event when user changes state(opened/closed) of holder
     * (holderOpened: Boolean) => void
     */
    onChange: PropTypes.func,
    /**
     * Wraps component with Portal component if [true]
     */
    withPortal: PropTypes.bool,
    /**
     * Custom text for reset button
     */
    resetText: PropTypes.string,
    /**
     * Custom text for apply button
     */
    applyText: PropTypes.string,
    /**
     * The CSS class name of the wrapper element.
     */
    className: PropTypes.string,
    /**
     * Fires event when user clicks on reset button
     * (event: Event) -=> void
     */
    onReset: PropTypes.func,
    /**
     * Fires event when user clicks on apply button
     * (event: Event) -=> void
     */
    onApply: PropTypes.func,
    /**
     * Initial state(opened/closed) for holder, I
     * If true holder will be opened
     */
    defaultOpened: PropTypes.bool,
    /**
     * Controlled value or state(opened/closed) for holder, I
     * If true holder will be opened
     */
    opened: PropTypes.bool,
    /**
     * Is any valid DOM node, regardless of its location in the DOM.
     */
    portalContainer: PropTypes.any,
    /**
     * Controls holder position
     */
    position: PropTypes.oneOf(['left', 'right']),
    /**
     * Title for component
     */
    title: PropTypes.string.isRequired,
    /**
     * Disabled state for "apply" button
     */
    applyDisabled: PropTypes.bool,
    /**
     * Disabled state for "reset" button
     */
    resetDisabled: PropTypes.bool,
    /**
     * Tooltip text for expanding icon
     */
    expandText: PropTypes.string.isRequired,
    /**
     * Tooltip text for collapsing icon
     */
    collapseText: PropTypes.string.isRequired,
    /**
     * Width for holder opened state (write with px)
     */
    openedWidth: PropTypes.string,
    /**
     * Left custom icon name, default is 'bc-icon-arrow-left'
     */
    leftIconType: PropTypes.string,
    /**
     * Right custom icon name, default is 'bc-icon-arrow-right'
     */
    rightIconType: PropTypes.string,
    /**
     * Filter custom icon name, default is 'bc-icon-arrow-filter'
     */
    filterIconType: PropTypes.string,
    /**
     * Disabled hover event which opening Holder component.
     */
    disableOnHover: PropTypes.bool
};

Holder.defaultProps = {
    disabled: false,
    applyText: 'Apply',
    withPortal: false,
    resetText: 'Reset',
    defaultOpened: false,
    position: 'left',
    applyDisabled: false,
    onChange: noop,
    leftIconType: 'bc-icon-arrow-left',
    rightIconType: 'bc-icon-arrow-right',
    filterIconType: 'bc-icon-filter',
    disableOnHover: false
};

export default Holder;
