import React, { useCallback, useRef, useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { useKeyDown } from 'hooks';
import { noop } from 'utils';
import Button from '../../atoms/Button';
import Portal from '../../atoms/Portal';

import 'src/assets/styles/globalStyling.scss';
import './index.scss';

const sizes = ['default', 'content-size'];
const backgrounds = ['transparent', 'light-background', 'dark-background'];
const appearances = ['default', 'compact'];
const positions = ['center', 'top', 'bottom'];

const KEYBOARD_ENTER_KEY = 13;
const KEYBOARD_ESC_KEY = 27;

function Modal({
    visible,
    size,
    background,
    appearance,
    withPortal,
    portalContainer,
    customActions,
    position,
    closable,
    cancelText,
    okText,
    title,
    width,
    zIndex,
    children,
    onOK,
    onCancel,
    footer,
    isOkActive,
    className,
    disableFooter,
    needEnter,
    closeOnClickOutside,
    onClose,
    isOkButtonLoading,
    ...rest
}) {
    const modalSplashRef = useRef(null);
    const [mouseDown, setMouseDown] = useState(false);

    // We need this 2 functions, because must be closed only when
    // mouseDown and mouseUp are outside of modal
    const handleMouseDown = useCallback(
        (e) => e.target === modalSplashRef.current && setMouseDown(true),
        [modalSplashRef.current]
    );

    const handleMouseUp = useCallback(
        (e) => {
            if (mouseDown && e.target === modalSplashRef.current) {
                closeOnClickOutside && onCancel(e);
                setMouseDown(false);
            } else if (e.target !== modalSplashRef.current) {
                setMouseDown(false);
            }
        },
        [closeOnClickOutside, onCancel, modalSplashRef.current, mouseDown]
    );

    useKeyDown(
        (e) => {
            if (visible) {
                e.keyCode === KEYBOARD_ESC_KEY && onCancel(e);
                e.keyCode === KEYBOARD_ENTER_KEY && isOkActive && needEnter && onOK(e);
            }
        },
        [visible, isOkActive, onCancel, onOK],
        { current: window },
        ['Escape', 'Enter']
    );

    const Content = (
        <div
            className={classnames('modal-splash', `${background}`, `a-${appearance}`, `p-${position}`, className)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            style={{ zIndex }}
            ref={modalSplashRef}
            {...rest}
        >
            <div className={classnames('modal-content', `s-${size}`)} style={{ width }}>
                {closable && !title && (
                    <Button
                        icon="bc-icon-close"
                        size="medium"
                        className="modal-close"
                        appearance="minimal"
                        color="default"
                        onClick={onClose || onCancel}
                    />
                )}
                {(title || customActions) && (
                    <div className="modal-head">
                        <div className="ellipsis-text">{title}</div>
                        {closable && (
                            <Button
                                icon="bc-icon-close"
                                size="medium"
                                className="modal-close"
                                appearance="minimal"
                                color="default"
                                onClick={onClose || onCancel}
                            />
                        )}
                        {customActions}
                    </div>
                )}
                {children && <div className="modal-body">{children}</div>}
                {!disableFooter && (
                    <div className="modal-footer">
                        {footer || (
                            <>
                                <Button appearance="minimal" size="medium" color="default" onClick={onCancel}>
                                    {cancelText}
                                </Button>
                                <Button
                                    disabled={!isOkActive || isOkButtonLoading}
                                    size="medium"
                                    onClick={onOK}
                                    loading={isOkButtonLoading}
                                >
                                    {okText}
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
    const portalWrapper = withPortal ? (
        <Portal isOpen={visible} container={portalContainer}>
            {Content}
        </Portal>
    ) : (
        Content
    );

    return visible && portalWrapper;
}

Modal.propTypes = {
    /**
     * Displays modal if [true]
     */
    visible: PropTypes.bool,
    /**
     * Controls modal size
     */
    size: PropTypes.oneOf(sizes),
    /**
     * Controls background color of modal
     */
    background: PropTypes.oneOf(backgrounds),
    /**
     * Controls divider between modal's header and body
     */
    appearance: PropTypes.oneOf(appearances),
    /**
     * Controls modal position on screen
     */
    position: PropTypes.oneOf(positions),
    /**
     * Displays close button on modal,
     * Fires onCancel function when clicked
     */
    closable: PropTypes.bool,
    /**
     * Disables footer in modal
     */
    disableFooter: PropTypes.bool,
    /**
     * Enables footers Ok button in modal
     */
    isOkActive: PropTypes.bool,
    /**
     * Custom text for cancel button
     */
    cancelText: PropTypes.string,
    /**
     * Custom text for ok button
     */
    okText: PropTypes.string,
    /**
     * Custom title for modal
     */
    title: PropTypes.any,
    /**
     * Wraps component with Portal component if [true]
     */
    withPortal: PropTypes.bool,
    portalContainer: PropTypes.any,
    /**
     * Custom value to override default css value
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Custom  zIndex value to overRide default css value
     */
    zIndex: PropTypes.number,
    /**
     * Valid React elements for modal body
     */
    children: PropTypes.node,
    /**
     * Additional classname
     */
    className: PropTypes.string,
    /**
     * Fires event when user clicks on ok button
     * (event: Event) => void
     */
    onOK: PropTypes.func,
    /**
     * Fires event when user clicks on Cancel button
     * (event: Event) => void
     */
    onCancel: PropTypes.func,
    /**
     * Custom footer element for modal
     */
    footer: PropTypes.element,
    /**
     * Pass [true] if you need to hide a modal when people click outside of it's content
     */
    closeOnClickOutside: PropTypes.bool,
    /**
     * Custom action elements for modal's header
     */
    customActions: PropTypes.node,
    /**
     * Enable keyboard Enter
     */
    needEnter: PropTypes.bool,
    /**
     * Fires event when user clicks on Close icon
     * (event: Event) => void
     */
    onClose: PropTypes.func,
    /**
     * Loader for ok button
     */
    isOkButtonLoading: PropTypes.bool
};

Modal.defaultProps = {
    visible: false,
    size: sizes[0],
    onOK: noop,
    onCancel: noop,
    background: backgrounds[2],
    appearance: appearances[0],
    position: positions[0],
    closable: true,
    cancelText: 'Cancel',
    okText: 'OK',
    closeOnClickOutside: true,
    isOkActive: true,
    disableFooter: false,
    needEnter: true,
    isOkButtonLoading: false
};

export default Modal;
