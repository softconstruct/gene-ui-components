import React, { FC, useContext, useEffect, PropsWithChildren } from "react";

import { IconProps, TagOutline, Close } from "@geneui/icons";
import classNames from "classnames";
import { TabsContext } from "./Tabs";
import Button from "../../atoms/Button";

export interface ITabProps extends PropsWithChildren {
    title?: string | number;
    iconBefore?: boolean;
    Icon?: FC<IconProps> | null;
    defaultSelected?: boolean;
    isError?: boolean;
    index?: number;
    isClosable?: boolean;
}

const Tab: FC<ITabProps> = ({
    title,
    Icon = TagOutline,
    iconBefore = true,
    defaultSelected,
    isError,
    index,
    isClosable
}) => {
    const { getIndex, size, selectedTabIndex, removeTabHandler } = useContext(TabsContext);

    const provideChildren = () => {
        getIndex(index!);
    };

    useEffect(() => {
        if (defaultSelected && index) {
            getIndex(index);
        }
    }, []);

    console.log(isClosable);

    return (
        <button
            type="button"
            role="tab"
            tabIndex={0}
            className={classNames(`tabs__button  tabs__button_${size}`, size, {
                tabs__button_selected: selectedTabIndex === index,
                tabs__button_error: isError
            })}
            onClick={provideChildren}
        >
            {iconBefore && Icon && <Icon className="tabs__button_icon" size={24} />}
            {title && <span className="tabs__button_text"> {title}</span>}
            {!iconBefore && Icon && <Icon className="tabs__button_icon" size={24} />}
            {isClosable && (
                <Button
                    displayType="text"
                    appearance="secondary"
                    size="XSmall"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!index) return;
                        removeTabHandler(index);
                    }}
                    Icon={Close}
                />
            )}
        </button>
    );
};
export default Tab;
