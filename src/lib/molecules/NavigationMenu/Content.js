import React, { memo, useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { debounce } from 'utils';
import { useDeviceType } from 'hooks';
import MenuContent from '../Menu';

import { indexStackFromItems, navigationOptionsToMenu } from './utils';
import Option from '../../atoms/Option';

function NavigationMenuContent({ depth, path, options, onChange, splitedValue }) {
    const [activeItem, setActiveItem] = useState();
    const navigationRef = useRef(null);
    const isHovered = useRef(true);

    const optionId = useMemo(() => splitedValue?.[depth], [depth, splitedValue]);

    const isActiveItem = useMemo(() => activeItem?.id && optionId === activeItem.id, [activeItem, optionId]);
    const mobileOptions = useMemo(
        () => (options ? navigationOptionsToMenu(options, optionId) : undefined),
        [options, optionId]
    );
    const initialIndexStack = useMemo(
        () => indexStackFromItems([], mobileOptions, optionId),
        [mobileOptions, activeItem]
    );

    const { isMobile } = useDeviceType();

    const onMouseEnterHandler = useCallback(
        debounce(({ isColaps, item }) => {
            if (!isHovered.current) return;
            isColaps ? setActiveItem(item) : setActiveItem(null);
        }, 200),
        [isHovered, setActiveItem]
    );

    useEffect(() => {
        if (optionId && options?.length) {
            const item = options.find((item) => item.id === optionId);
            item && setActiveItem(item);
        }
    }, [optionId, options]);

    const onItemClick = (item) => {
        onChange(path ? `${path}/${item.id}` : item.id, item);
        setActiveItem(item);
    };

    if (isMobile) {
        return (
            <MenuContent
                data={mobileOptions}
                onSelect={(_, item) => onItemClick(item)}
                selectedItem={activeItem}
                initialIndexStack={initialIndexStack}
            />
        );
    }

    return (
        <>
            {options?.length > 0 && (
                <div
                    className="bc-navigation-menu_content-menu"
                    ref={navigationRef}
                    onMouseEnter={() => (isHovered.current = true)}
                    onMouseLeave={() => (isHovered.current = false)}
                >
                    {options.map((item) => {
                        const isColaps = !!(item.data && item.data.length);

                        return (
                            item.isHidden !== true && (
                                <Option
                                    {...item}
                                    key={item.id}
                                    active={optionId === item.id}
                                    forwardMark={isColaps}
                                    onClick={() => !isColaps && onItemClick(item)}
                                    onMouseEnter={() => onMouseEnterHandler({ isColaps, item })}
                                />
                            )
                        );
                    })}
                </div>
            )}
            {activeItem && (
                <NavigationMenuContent
                    depth={depth + 1}
                    path={path ? `${path}/${activeItem.id}` : activeItem.id}
                    options={activeItem.data}
                    onChange={onChange}
                    splitedValue={isActiveItem && splitedValue}
                />
            )}
        </>
    );
}

NavigationMenuContent.defaultProps = {
    depth: 0
};

export default memo(NavigationMenuContent);
