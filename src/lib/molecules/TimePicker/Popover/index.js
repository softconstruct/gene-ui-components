import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Helpers
import { useKeyDown, useClickOutside } from 'hooks';

// Components
import Popover from '../../../atoms/PopoverV2';

const TimePickerPopover = forwardRef(({ children, readOnly, value, positions, ...props }, ref) => {
    const rootRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        toggleOpen() {
            setIsOpen(!isOpen);
        }
    }));

    const openPopover = () => !readOnly && !isOpen && setIsOpen(true);
    const closePopover = () => setIsOpen(false);

    useKeyDown(openPopover, [openPopover], rootRef, ['Enter']);
    useKeyDown(closePopover, [closePopover], rootRef, ['Tab', 'Escape']);

    const handleOutsideClick = useClickOutside((event) => {
        !rootRef.current.contains(event.target) && closePopover();
    });

    // We need to close popup every time when
    // user select some value from current popup
    useEffect(() => {
        setIsOpen(false);
    }, [value]);

    return (
        <Popover
            contentRef={handleOutsideClick}
            scrollbarNeeded={false}
            position={positions}
            isOpen={isOpen}
            behave="open"
            {...props}
        >
            <div tabIndex={1} ref={rootRef} onClick={openPopover}>
                {children}
            </div>
        </Popover>
    );
});

export default TimePickerPopover;
