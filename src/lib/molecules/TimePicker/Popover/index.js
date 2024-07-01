import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Helpers
import { useKeyDown, useClickOutside } from 'hooks';

// Components
import Popover from '../../../atoms/PopoverV2';

const TimePickerPopover = forwardRef(({ children, readOnly, value, positions, ...props }, ref) => {
    const rootRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        toggleOpen(isPopoverOpen = isOpen) {
            setIsOpen(!isPopoverOpen);
        }
    }));

    const openPopover = () => !readOnly && !isOpen && setIsOpen(true);
    const closePopover = () => setIsOpen(false);

    useKeyDown(openPopover, [openPopover], rootRef, ['Enter']);
    useKeyDown(closePopover, [closePopover], rootRef, ['Tab', 'Escape']);

    const handleOutsideClick = useClickOutside((event) => {
        !rootRef.current.contains(event.target) && closePopover();
    });

    useEffect(() => {
        setIsOpen(false);
    }, [value]);

    return (
        <Popover
            behave="open"
            scrollbarNeeded={false}
            contentRef={handleOutsideClick}
            isOpen={isOpen}
            position={positions}
            {...props}
        >
            <div tabIndex={1} ref={rootRef} onClick={openPopover}>
                {children}
            </div>
        </Popover>
    );
});

export default TimePickerPopover;
