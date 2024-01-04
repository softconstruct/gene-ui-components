import React, { useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useClickOutside } from 'hooks';
import { noop } from 'utils';

import { Icon, Portal, Dropdown, Popover, Menu } from 'components';

import './index.scss';

function Overspread(props) {
    const {
        opened,
        title,
        hasDone,
        disabledDone,
        children,
        hasSearch,
        hasOptions,
        titleHasOptions,
        searchOutput,
        hasBack,
        doneText,
        backWithIcon,
        backText,
        doneWithIcon,
        onClose,
        onDone,
        onBack,
        onSelectingOption,
        onSelectingTitleOption,
        dataForOptions,
        dataForTitleWithOptions,
        defaultValueForTitleWithOptions,
        onAnimationEnd,
        ...restProps
    } = props;

    const isControlled = 'opened' in props;

    const [isOpen, setIsOpen] = useState(opened);
    const [optionsPopoverIsOpen, setOptionsPopoverIsOpen] = useState(false);
    const portalRef = useRef(null);

    useEffect(() => setIsOpen(opened), [opened]);

    const handleSearchOutput = useCallback(
        (e) => {
            searchOutput && searchOutput(e.target.value);
        },
        [searchOutput]
    );

    const handleClose = useCallback(
        (e) => {
            !isControlled && setIsOpen((isOpen) => !isOpen);
            onClose && onClose(e);
        },
        [onClose, isControlled]
    );

    const handleDone = useCallback(
        (e) => {
            !isControlled && setIsOpen((isOpen) => !isOpen);
            onDone && onDone(e);
        },
        [onDone, isControlled]
    );

    const outsideClickHandler = useCallback(() => {
        setOptionsPopoverIsOpen(false);
    }, []);

    const outsideClickRef = useClickOutside(outsideClickHandler);

    const onAnimationEndHandler = useCallback(() => {
        onAnimationEnd && onAnimationEnd();
    }, [onAnimationEnd]);

    useEffect(() => {
        portalRef?.current?.addEventListener('animationend', onAnimationEndHandler);
    }, [portalRef.current, isOpen]);

    const cleanup = () => {
        portalRef?.current?.removeEventListener('animationend', onAnimationEndHandler);
    };

    useEffect(() => cleanup, []);

    return (
        <Portal isOpen={isOpen}>
            <div className="overspread-container" {...restProps}>
                <div className="overspread-holder" ref={portalRef}>
                    <ul className="overspread-head">
                        <li className="over-h-act">
                            {hasBack ? (
                                <p onClick={onBack} className="back-button-holder cursor-pointer">
                                    {backWithIcon && <Icon type="bc-icon-arrow-left" />}
                                    <span>{backText}</span>
                                </p>
                            ) : (
                                <Icon type="bc-icon-close" onClick={handleClose} className="cursor-pointer" />
                            )}
                        </li>
                        <li className="over-h-tt">
                            {titleHasOptions ? (
                                <Dropdown
                                    hasSearch={false}
                                    value={defaultValueForTitleWithOptions.value}
                                    data={dataForTitleWithOptions}
                                    placeholder=" "
                                    appearance="light"
                                    onChange={onSelectingTitleOption}
                                    flexibility="content-size"
                                />
                            ) : (
                                <p className="ellipsis-text">{title}</p>
                            )}
                        </li>
                        <li className="over-h-act">
                            {hasSearch && (
                                <div className="overspread-search cursor-pointer">
                                    <Icon type="bc-icon-close" />
                                    <input onChange={handleSearchOutput} placeholder="Search" />
                                    <Icon type="bc-icon-search" />
                                </div>
                            )}
                            {hasOptions && (
                                <Popover
                                    isOpen={optionsPopoverIsOpen}
                                    extendTargetWidth={false}
                                    Content={
                                        <Menu
                                            ref={outsideClickRef}
                                            data={dataForOptions}
                                            onSelect={(...args) => {
                                                setOptionsPopoverIsOpen(false);
                                                onSelectingOption(...args);
                                            }}
                                        />
                                    }
                                    align="end"
                                >
                                    <Icon type="bc-icon-more-vertical" onClick={() => setOptionsPopoverIsOpen(true)} />
                                </Popover>
                            )}
                            {hasDone && (
                                <button
                                    disabled={disabledDone}
                                    onClick={handleDone}
                                    className="color-hero cursor-pointer"
                                >
                                    {doneWithIcon ? <Icon type="bc-icon-checkbox-checked" /> : doneText}
                                </button>
                            )}
                        </li>
                    </ul>
                    {children && <div className="overspread-body">{children}</div>}
                </div>
            </div>
        </Portal>
    );
}

Overspread.propTypes = {
    title: PropTypes.string,
    /**
     * Enables title's dropdown,
     */
    titleHasOptions: PropTypes.bool,
    /**
     * Fires event for handling change of value/selected option
     * ((event: Event) => void)
     */
    onSelectingTitleOption: PropTypes.func,
    /**
     * Title's dropdown data
     */
    dataForTitleWithOptions: PropTypes.array,
    /**
     *  Default value for title's dropdown
     */
    defaultValueForTitleWithOptions: PropTypes.object,
    /**
     * Enables search,
     */
    hasSearch: PropTypes.bool,
    /**
     * Fires event when user types in search field
     * (event: Event) => void
     */
    searchOutput: PropTypes.func,
    /**
     * Displays dropdown on the right corner,
     */
    hasOptions: PropTypes.bool,
    /**
     * Right corner dropdown's data
     */
    dataForOptions: PropTypes.array,
    /**
     * Fires event for handling change of value/selected option
     * ((event: Event) => void)
     */
    onSelectingOption: PropTypes.func,
    /** Opened state */
    opened: PropTypes.bool,
    /**
     * Any valid node
     */
    children: PropTypes.node,
    /**
     * Enables done button on the right corner,
     */
    hasDone: PropTypes.bool,
    /**
     * Shows done icon instead of text
     */
    doneWithIcon: PropTypes.bool,
    /**
     * Done button disabled state
     */
    disabledDone: PropTypes.bool,
    /**
     * Custom text for done button
     */
    doneText: PropTypes.string,
    /**
     * Fires event when done button is clicked
     * ((event: Event) => void)
     */
    onDone: PropTypes.func,
    /**
     * Enables back button on the left corner,
     */
    hasBack: PropTypes.bool,
    /**
     * Custom text for back button
     */
    backText: PropTypes.string,
    /**
     * Displays chevron icon in back button
     */
    backWithIcon: PropTypes.bool,
    /**
     * Fires event when back button is clicked
     * ((event: Event) => void)
     */
    onBack: PropTypes.func,
    /**
     * Fires event when close icon is clicked
     * ((event: Event) => void)
     */
    onClose: PropTypes.func,
    /**
     * Function calls when the animation ends.
     */
    onAnimationEnd: PropTypes.func
};

Overspread.defaultProps = {
    hasSearch: false,
    hasBack: false,
    hasOptions: false,
    doneText: 'Done',
    titleHasOptions: false,
    backWithIcon: false,
    doneWithIcon: false,
    hasDone: true,
    onDone: noop,
    onBack: noop,
    onClose: noop,
    onSelectingOption: noop,
    onSelectingTitleOption: noop,
    onAnimationEnd: noop
};

export default Overspread;
