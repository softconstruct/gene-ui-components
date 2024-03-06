//@ts-ignore
import { stopEvent } from 'utils';

import { IHandleSwipedDownProps, IHandleSwipingProps } from './types';

const handleSwiping = ({ deltaY, event, setSwipingPosition, checkBodyContains }: IHandleSwipingProps) => {
    if (checkBodyContains(event)) {
        stopEvent(event);
    } else if (deltaY >= 0) {
        setSwipingPosition(deltaY * -1);
    }
};

const handleSwipedDown = ({ touchEvent, checkBodyContains, onSwipedDown }: IHandleSwipedDownProps) => {
    !checkBodyContains(touchEvent.event) && onSwipedDown(touchEvent);
};

const handleSwiped = (setSwipingPosition: React.Dispatch<React.SetStateAction<number>>) => setSwipingPosition(0);

export default {
    handleSwiping,
    handleSwipedDown,
    handleSwiped
};
