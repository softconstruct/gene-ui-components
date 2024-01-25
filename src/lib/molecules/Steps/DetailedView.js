import React, { useRef, useState } from 'react';

// Helpers
import { debounce } from 'utils';

// Components
import Popover from '../../atoms/Popover';

// Styles
import './index.scss';

const positionMap = {
    vertical: 'left',
    horizontal: 'bottom'
};

function DetailedView({ content, children, direction }) {
    const isHoveredOnContent = useRef(false);
    const isHoveredOnStep = useRef(false);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const closePopover = () => {
        debounce(() => {
            if (!isHoveredOnContent.current && !isHoveredOnStep.current) {
                setIsPopoverOpen(false);
            }
        }, 250)();
    };

    const stepOnMouseEnterHandler = () => {
        isHoveredOnStep.current = true;
        setIsPopoverOpen(true);
    };
    const stepOnMouseLeaveHandler = () => {
        isHoveredOnStep.current = false;
        closePopover();
    };

    const contentOnMouseEnterHandler = () => (isHoveredOnContent.current = true);
    const contentOnMouseLeaveHandler = () => {
        isHoveredOnContent.current = false;
        closePopover();
    };

    return (
        <Popover
            swipeable
            align="center"
            position={positionMap[direction]}
            isOpen={isPopoverOpen}
            onClickOutside={() => setIsPopoverOpen(false)}
            extendTargetWidth={false}
            onSwipedDown={() => setIsPopoverOpen(false)}
            Content={
                <div
                    onMouseEnter={contentOnMouseEnterHandler}
                    onMouseLeave={contentOnMouseLeaveHandler}
                    className="detailed-value-popover-container"
                >
                    {content}
                </div>
            }
        >
            <div onMouseEnter={stepOnMouseEnterHandler} onMouseLeave={stepOnMouseLeaveHandler}>
                {children}
            </div>
        </Popover>
    );
}

export default DetailedView;
