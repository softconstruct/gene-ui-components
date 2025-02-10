import React, { JSX, FC, useContext, useEffect, PropsWithChildren } from "react";

import { IconProps, Close, InfoFill } from "@geneui/icons";
import classNames from "classnames";
import { TabsContext } from "./Tabs";
import Button from "../../atoms/Button";

export interface ITabProps extends PropsWithChildren {
    title?: string | number;
    Icon?: FC<IconProps> | null;
    defaultSelected?: boolean;
    isError?: boolean;
    index?: number;
    closable?: boolean;
    content?: JSX.Element;
}

const Tab: FC<ITabProps> = ({ title, Icon, defaultSelected, isError, index, closable = false, content }) => {
    const { getIndex, size, selectedTabIndex, removeTabHandler } = useContext(TabsContext);

    const provideChildren = () => {
        getIndex(index!);
    };

    useEffect(() => {
        if (defaultSelected && index) {
            getIndex(index);
        }
    }, []);

    return (
        <button
            type="button"
            role="tab"
            tabIndex={0}
            className={classNames(`tabs__button  tabs__button_${size}`, {
                tabs__button_selected: selectedTabIndex === index,
                tabs__button_error: isError,
                tabs__button_textOnly: !Icon,
                tabs__button_icon: Icon && title,
                tabs__button_iconOnly: !title
            })}
            onClick={provideChildren}
        >
            {!isError && Icon && <Icon className="tabs__button_icon" size={24} />}
            {title && <span className="tabs__button_text"> {title}</span>}
            {closable && (
                <Button
                    displayType="text"
                    appearance="secondary"
                    size="XSmall"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (index === undefined) return;
                        removeTabHandler(index);
                    }}
                    Icon={Close}
                />
            )}
            {isError && <InfoFill className="tabs__button_iconError" size={24} />}
            {content}
        </button>
    );
};
export default Tab;
