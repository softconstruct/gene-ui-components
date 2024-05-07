import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, ReactNode } from 'react';

// Helpers
import { useKeyDown, useClickOutside } from 'hooks';

// Components
import Popover from '../../atoms/PopoverV2';

// Types
import { ChildRef, GetArrayAsUnion } from './TimePicker';

interface ITimePickerPopover {
    toggleHandler: (open: boolean) => boolean | void;
    children: ReactNode;
    readOnly: boolean;
    value: string | null;
    positions: GetArrayAsUnion<'positions'>;
    Content: ReactNode;
}

const TimePickerPopover = forwardRef<ChildRef | undefined, ITimePickerPopover>(
    ({ children, readOnly, value, positions, ...props }, ref) => {
        const rootRef = useRef<HTMLDivElement | null>(null);
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

        const handleOutsideClick = useClickOutside((event: MouseEvent) => {
            !rootRef.current?.contains(event.target as Node) && closePopover();
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
    }
);

export default TimePickerPopover;
