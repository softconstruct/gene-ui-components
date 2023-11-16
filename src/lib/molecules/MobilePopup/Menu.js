import React, { useState, useCallback } from 'react';

import { useClickOutside } from 'hooks';
import Popover from '../../atoms/Popover';
import Menu from '../Menu';

function ActionMenu({ action, children }) {
    const [isOpened, setIsOpened] = useState(false);

    const toggleMenu = useCallback(() => setIsOpened((status) => !status), []);

    const handleOutsideClick = useClickOutside(toggleMenu);

    if (action.menuOptions) {
        return (
            <Popover
                swipeable
                align="end"
                screenType="mobile"
                isOpen={isOpened}
                onSwipedDown={toggleMenu}
                contentRef={handleOutsideClick}
                Content={
                    <Menu
                        screenType="mobile"
                        onClick={toggleMenu}
                        data={[
                            ...action.menuOptions,
                            {
                                title: 'Cancel',
                                icon: 'bc-icon-clear',
                                border: 'top'
                            }
                        ]}
                    />
                }
            >
                <div onClick={toggleMenu}>{children}</div>
            </Popover>
        );
    }

    return children;
}

export default ActionMenu;
