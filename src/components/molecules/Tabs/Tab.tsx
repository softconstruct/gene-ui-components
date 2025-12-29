import React, { FC, JSX, KeyboardEvent, MouseEvent, PropsWithChildren, useContext, useEffect } from "react";
import classNames from "classnames";

import { CircleAlert, IconProps, X } from "@geneui/icons";

// Components
import Button from "../../atoms/Button";
import { TabsContext } from "./Tabs";

interface ITabProps extends PropsWithChildren {
    /**
     * The title of the tab, displayed as the tab label.
     * Accepts a string or a number.
     */
    title?: string | number;

    /**
     * An optional icon component to display next to the title.
     * Accepts a functional component with `IconProps` or `null` if no icon is needed.
     */
    Icon?: FC<IconProps> | null;

    /**
     * Determines if the tab is selected by default when the component mounts.
     * The default value is `false`.
     */
    defaultSelected?: boolean;

    /**
     * Indicates whether the tab should be marked as an error state.
     * The default value is `false`.
     */
    error?: boolean;

    /**
     * The index of the tab within the parent `Tabs` component.
     */
    index?: number;

    /**
     * Determines if the tab can be closed.
     * When set to `true`, a close button will appear on the tab.
     * The default value is `false`.
     */
    closable?: boolean;

    /**
     * The content of the tab, rendered when the tab is active.
     * Accepts a JSX element.
     */
    content?: JSX.Element;
}

const Tab: FC<ITabProps> = ({ title, Icon, defaultSelected, error, index, closable = false, content }) => {
    const { getIndex, size, selectedTabIndex, removeTabHandler } = useContext(TabsContext);

    const provideChildren = (e: MouseEvent<HTMLDivElement> & KeyboardEvent<HTMLDivElement>) => {
        if (e?.key) {
            if (e.key === "Enter") {
                getIndex(index!);
            }
            return;
        }

        getIndex(index!);
    };

    useEffect(() => {
        if (defaultSelected && index) {
            getIndex(index);
        }
    }, []);

    const handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (index === undefined) return;
        removeTabHandler(index);
    };

    return (
        <div
            role="tab"
            tabIndex={selectedTabIndex === index ? -1 : 0}
            aria-selected={selectedTabIndex === index}
            className={classNames(`tabs__button  tabs__button_${size}`, {
                tabs__button_selected: selectedTabIndex === index,
                tabs__button_error: error,
                tabs__button_textOnly: !Icon,
                tabs__button_icon: Icon && title,
                tabs__button_iconOnly: !title
            })}
            onClick={provideChildren}
            onKeyDown={provideChildren}
        >
            {!error && Icon && <Icon className="tabs__button_icon" size={24} />}
            {title && <span className="tabs__button_text">{title}</span>}
            {closable && <Button appearance="secondary" size="small" onClick={handleCloseClick} Icon={X} />}
            {error && <CircleAlert className="tabs__button_iconError" size={24} />}
            {!closable && content}
        </div>
    );
};
export { ITabProps, Tab as default };
