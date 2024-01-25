import React, { useState, useRef, useEffect } from 'react';

// Helpers
import { useKeyDown, useClickOutside } from 'hooks';

// Components
import Popover from '../../../atoms/PopoverV2';

function TimePickerPopover({ children, readOnly, value, positions, ...props }) {
    const rootRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const openPopover = () => !readOnly && setIsOpen(true);
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
}

export default TimePickerPopover;
