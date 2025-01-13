import React, { FC, ReactNode } from "react";
import { CheckMark, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";
import classNames from "classnames";

interface IMenuItemProps {
    selected?: boolean;
    children: ReactNode;
    title?: string;
    controlHandler?: (index: number, isBack?: boolean) => void;
    activeElement?: boolean;
    index: number;
    defaultOpened?: never;
    IconBefore?: FC<IconProps>;
    IconAfter?: FC<IconProps>;
}

const MenuItem: FC<IMenuItemProps> = ({
    children,
    title,
    controlHandler,
    activeElement,
    index,
    selected,
    IconBefore,
    IconAfter
}) => {
    return (
        <>
            {typeof children !== "string" ? (
                <>
                    {/* Parent menu item */}
                    <button
                        type="button"
                        className="menu__item"
                        onClick={() => {
                            controlHandler(index, false, true);
                        }}
                    >
                        <span className="menu__cell">
                            {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                            <span className="menu__itemTitle">{title}</span>
                        </span>
                        <ChevronRight className="menu__icon menu__icon_after" size={20} />
                    </button>
                    {/* menu list wrapper */}
                    <div
                        className={classNames("menu__list  ", {
                            menu__list_current: activeElement
                        })}
                    >
                        {/* header */}
                        <button
                            type="button"
                            className="menu__header"
                            onClick={() => controlHandler(index, true, true)}
                        >
                            <ChevronLeft className="menu__icon menu__icon_before" size={20} />
                            <p className="menu__headerTitle">{title}</p>
                        </button>
                        <div className="menu__content">{children}</div>
                    </div>
                </>
            ) : (
                // Simple menu item
                <button type="button" className="menu__item" onClick={() => controlHandler(index, false)}>
                    <span className="menu__cell">
                        {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                        <span className="menu__itemTitle">{children}</span>
                    </span>
                    {(selected && <CheckMark className="menu__icon menu__icon_after" size={20} />) ||
                        (IconAfter && <IconAfter className="menu__icon menu__icon_after" size={20} />)}
                </button>
            )}
        </>
    );
};

export { IMenuItemProps, MenuItem as default };
