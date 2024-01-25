import React, { useCallback, useMemo, useState, useEffect } from 'react';

// Helpers
import { useClickOutside, useBodyScroll } from 'hooks';

// Components
import Popover from '../../atoms/Popover';
import Button from '../../atoms/Button';
import Menu from '../Menu';

function CardMenu({ menuOptions = [] }) {
    const bodyScroll = useBodyScroll();
    const [isOpened, setIsOpened] = useState(false);

    const handleOpen = useCallback(() => {
        setIsOpened(true);
        bodyScroll.lock();
    }, []);

    useEffect(() => () => bodyScroll.unlock(), []);

    const handleClose = useCallback(() => {
        setIsOpened(false);
        bodyScroll.unlock();
    }, []);

    const handleOutsideClick = useClickOutside(handleClose);

    const handleItemClick = useCallback(
        ({ onClick, disabled, ...item }) => {
            if (!disabled) {
                onClick && onClick(event);
                handleClose(item);
            }
        },
        [handleClose]
    );

    const options = useMemo(
        () =>
            menuOptions.filter(Boolean).map((item) => {
                if (React.isValidElement(item)) {
                    return {
                        component: React.cloneElement(item, {
                            onClick: () => handleItemClick(item.props)
                        })
                    };
                }
                return {
                    ...item,
                    onClick: () => handleItemClick(item)
                };
            }),
        [menuOptions, handleItemClick]
    );

    return (
        <Popover
            swipeable
            screenType="mobile"
            isOpen={isOpened}
            onSwipedDown={handleClose}
            contentRef={handleOutsideClick}
            Content={
                <Menu
                    screenType="mobile"
                    data={[
                        ...options,
                        {
                            title: 'Cancel',
                            onClick: handleClose,
                            icon: 'bc-icon-clear',
                            border: 'top'
                        }
                    ]}
                />
            }
        >
            <Button onClick={handleOpen} icon="bc-icon-more-horizontal" appearance="minimal" withShadow />
        </Popover>
    );
}

export default CardMenu;
