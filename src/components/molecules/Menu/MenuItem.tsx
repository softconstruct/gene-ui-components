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
                        {IconBefore && <IconBefore className="menu__icon" size={16} />}
                        <span className="menu__cell">
                            <span className="menu__rowTitle">{title}</span>
                        </span>
                        <ChevronRight className="menu__rowIcon" size={16} />
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
                            <ChevronLeft className="menu__icon" size={16} />
                            <p className="menu__headerTitle">{title}</p>
                        </button>
                        <div className="menu__content">{children}</div>
                    </div>
                </>
            ) : (
                // Simple menu item
                <button type="button" className="menu__item" onClick={() => controlHandler(index, false)}>
                    {IconBefore && <IconBefore className="menu__icon" size={16} />}
                    <span className="menu__cell">
                        <span className="menu__rowTitle">{children}</span>
                    </span>
                    {(selected && <CheckMark className="menu__rowIcon" size={16} />) ||
                        (IconAfter && <IconAfter className="menu__icon" size={16} />)}
                </button>
            )}
        </>
    );
};

export { IMenuItemProps, MenuItem as default };
