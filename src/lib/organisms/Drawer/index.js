import React, { Fragment, useMemo, useEffect, useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Helpers
import { noop } from 'utils';
import { useClickOutside } from 'hooks';

// Components
import Icon from '../../atoms/Icon';
import Tooltip from '../../molecules/Tooltip';

// Styles
import './index.scss';

function Drawer({
    menu,
    title,
    value,
    defaultValue,
    className,
    onOpen,
    onClose,
    onChange,
    onOutsideClick,
    defaultOpen,
    height,
    position,
    isOpen,
    closeAfterSelect,
    closeWithOutsideClick
}) {
    const isOpenControlled = typeof isOpen === 'boolean';
    const drawerRef = useRef(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(defaultOpen);
    const [selectedVaule, setSelectedValue] = useState(defaultValue);
    const [openNested, setOpenNested] = useState(null);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    useEffect(() => {
        isOpenControlled && setIsDrawerOpen(isOpen);
    }, [isOpenControlled, isOpen]);

    const handleOpen = useCallback(
        (event) => {
            if (!isDrawerOpen) {
                !isOpenControlled && setIsDrawerOpen(true);
                onOpen(event);
            }
        },
        [isDrawerOpen, isOpenControlled, onOpen]
    );

    const handleClose = useCallback(
        (event) => {
            if (isDrawerOpen) {
                !isOpenControlled && setIsDrawerOpen(false);
                onClose(event);
            }
        },
        [isDrawerOpen, isOpenControlled, onClose]
    );

    const selectedNestedParent = useMemo(() => {
        const selectedItem = menu.find(
            (item) =>
                item.id === selectedVaule ||
                (item.nested &&
                    item.nested.length &&
                    item.nested.findIndex((nestedItem) => nestedItem.id === selectedVaule) > -1)
        );
        return selectedItem && selectedItem.id;
    }, [selectedVaule, menu]);

    const handleItemClick = useCallback(
        (item, index, event) => {
            if (!item.disabled) {
                if (item.nested && item.nested.length > 0) {
                    if (isDrawerOpen) {
                        setOpenNested((prev) => prev !== index && index);
                    } else {
                        setOpenNested(index);
                        handleOpen(event);
                    }
                } else if (item.id !== selectedVaule) {
                    onChange(item);
                    setSelectedValue(item.id);
                    closeAfterSelect && handleClose(event);
                }
            }
        },
        [closeAfterSelect, handleClose, handleOpen, isDrawerOpen, onChange, selectedVaule]
    );

    const handleNestedItemClick = useCallback(
        (item, nested, event) => {
            if (!item.disabled && !nested.disabled && nested.id !== selectedVaule) {
                onChange(item, nested);
                setSelectedValue(nested.id);
                closeAfterSelect && handleClose(event);
            }
        },
        [closeAfterSelect, handleClose, onChange, selectedVaule]
    );

    const handleMenuIconClick = useCallback(
        (event) => {
            isDrawerOpen ? handleClose(event) : handleOpen(event);
        },
        [isDrawerOpen, handleClose, handleOpen]
    );

    const drawerStyles = useMemo(
        () => ({
            position,
            height
        }),
        [position, height]
    );

    const handleOutsideClick = useClickOutside((event) => {
        if (drawerRef && !drawerRef.current.contains(event.target)) {
            closeWithOutsideClick && handleClose();
            onOutsideClick(event);
        }
    });

    const generateDrawerRef = useCallback(
        (node) => {
            if (node && drawerRef) {
                drawerRef.current = node;
                handleOutsideClick(node);
            }
        },
        [handleOutsideClick]
    );

    return (
        <div
            ref={generateDrawerRef}
            className={clsx('bc-drawer', className, { open: isDrawerOpen })}
            style={drawerStyles}
        >
            <div className="bc-drawer-head">
                {isDrawerOpen && <span className="bc-drawer-head-title">{title}</span>}
                <Icon
                    className="bc-drawer-head-icon"
                    onClick={handleMenuIconClick}
                    type={isDrawerOpen ? 'bc-icon-menu-collapsed' : 'bc-icon-menu-expanded'}
                />
            </div>
            <div className="bc-drawer-content">
                {menu &&
                    menu.length > 0 &&
                    menu.map((item, index) => {
                        const { nested } = item;
                        const hasNested = nested && nested.length;
                        const isNestedOpen = isDrawerOpen && openNested === index;

                        return (
                            <Fragment key={item.id}>
                                <div
                                    className={clsx('bc-drawer-item', {
                                        active: selectedNestedParent === item.id,
                                        disabled: item.disabled
                                    })}
                                    onClick={(event) => handleItemClick(item, index, event)}
                                >
                                    <Tooltip title={isDrawerOpen ? '' : item.title} position="right">
                                        {item.icon && <Icon className="bc-drawer-item-icon" type={item.icon} />}
                                    </Tooltip>
                                    <span className="bc-drawer-item-title">{item.title}</span>
                                    {isDrawerOpen && hasNested && (
                                        <Icon
                                            type="bc-icon-arrow-down"
                                            className={clsx('bc-drawer-item-arrow', {
                                                open: isNestedOpen
                                            })}
                                        />
                                    )}
                                </div>
                                {hasNested && (
                                    <div
                                        className={clsx('bc-drawer-item-nested-list', {
                                            open: isNestedOpen
                                        })}
                                    >
                                        {nested.map((nestedItem) => (
                                            <div
                                                key={nestedItem.id}
                                                className={clsx('bc-drawer-item nested', {
                                                    active: selectedVaule === nestedItem.id,
                                                    disabled: nestedItem.disabled
                                                })}
                                                onClick={(event) => handleNestedItemClick(item, nestedItem, event)}
                                            >
                                                <span className="bc-drawer-item-title">{nestedItem.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Fragment>
                        );
                    })}
            </div>
        </div>
    );
}

Drawer.defaultProps = {
    onOpen: noop,
    onClose: noop,
    onChange: noop,
    defaultOpen: false,
    height: '100vh',
    position: 'relative'
};

Drawer.propTypes = {
    /**
     * Date for display the menu
     */
    menu: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            icon: PropTypes.string,
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            disabled: PropTypes.bool,
            nested: PropTypes.arrayOf(
                PropTypes.shape({
                    title: PropTypes.string,
                    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    disabled: PropTypes.bool
                })
            )
        })
    ),
    /**
     * If you want to control the selected item in the menu, you must date id of one of the 'menu' items.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * If you want not to control the menu from the top but have a default value, you can send it using defaultValue
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Label is displayed at the top in the driver
     */
    title: PropTypes.string,
    /**
     * Override or extend the className applied to the component.
     */
    className: PropTypes.string,
    /** 
   * Callback fired when a menu item is selected.
    Signature:
    function(item, nested) => void
    item: Item is the element that was select from the menu
    nested: If you select an item from the submenu, it will be sent as the second argument, and the first will be the item of its parent.
  */
    onChange: PropTypes.func,
    /**
   * Callback fired when a drawer is opened.
    Signature:
    function(event: object) => void
    event: The event source of the callback.
   */
    onOpen: PropTypes.func,
    /**
   * Callback fired when a drawer is closed.
    Signature:
    function(event: object) => void
    event: The event source of the callback.
   */
    onClose: PropTypes.func,
    /**
     * If true, the component is shown by default.
     */
    defaultOpen: PropTypes.bool,
    /**
   * Height for the component
    by default: 100vh
   */
    height: PropTypes.string,
    /**
   * The positioning type. The behavior of the different options is described in the MDN web docs.
    'absolute' | 'fixed' | 'relative' | 'static' | 'sticky'
   */
    position: PropTypes.string,
    /**
     * With this prop you can control Drawer opening and closing from parent component
     */
    isOpen: PropTypes.bool,
    /**
     * Drawer to close after item select
     */
    closeAfterSelect: PropTypes.bool,
    /**
     * Closes when click outside
     */
    closeWithOutsideClick: PropTypes.bool,
    /**
     * Callback fired when a outside click.
     * (event: MouseEvent) => void.
     */
    onOutsideClick: PropTypes.func
};

export default Drawer;
