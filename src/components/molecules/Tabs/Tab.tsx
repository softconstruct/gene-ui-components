import React, { FC, useContext, useEffect, PropsWithChildren } from "react";

import { IconProps, TagOutline } from "@geneui/icons";
import classNames from "classnames";
import { TabsContext } from "./Tabs";

export interface ITabProps extends PropsWithChildren {
    title?: string | number;
    iconBefore?: boolean;
    Icon?: FC<IconProps>;
    defaultSelected?: boolean;
    isError?: boolean;
    index?: number;
}

const Tab: FC<ITabProps> = ({ title, Icon = TagOutline, iconBefore = true, defaultSelected, isError, index }) => {
    const { getChildrenAndIndex, size, selectedTabIndex } = useContext(TabsContext);

    const provideChildren = () => {
        getChildrenAndIndex(index!);
    };

    useEffect(() => {
        if (defaultSelected && index) {
            getChildrenAndIndex(index);
        }
    }, []);

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
            {iconBefore && <Icon className="tabs__button_icon" size={24} />}
            {title && <span className="tabs__button_text"> {title}</span>}
            {!iconBefore && <Icon className="tabs__button_icon" size={24} />}
        </button>
    );
};
export default Tab;
