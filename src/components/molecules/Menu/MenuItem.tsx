import React, { Children, FC, ReactNode, useContext, useState } from "react";
import classNames from "classnames";
import { isValidElementType } from "react-is";

import { CheckMark, ChevronLeft, ChevronRight, IconProps } from "@geneui/icons";

import { Popover, PopoverBody } from "@components/atoms/Popover";
import Scrollbar from "@components/atoms/Scrollbar";

// components
import Divider from "../../atoms/Divider";
import { MenuContext } from "./Menu";

interface IMenuItemProps {
    selected?: boolean;
    children: ReactNode;
    title?: string;
    activeElement?: boolean;
    index: number;
    defaultOpened?: never;
    isLoading?: never;
    IconBefore?: FC<IconProps>;
    IconAfter?: FC<IconProps>;
    danger?: boolean;
    disabled?: boolean;
    id: number | string;
    divider?: boolean;
    loadingText?: string;
    emptyText?: string;
    ComponentRender?: FC;
}

const MenuItem: FC<IMenuItemProps> = ({
    children,
    title,
    activeElement,
    index,
    selected,
    IconBefore,
    IconAfter,
    danger,
    disabled,
    id,
    divider,
    ComponentRender,
    emptyText
}) => {
    const [propsForPopover, setPropsForPopover] = useState({});
    const { onChangeHandler, swappable } = useContext(MenuContext);
    const [innerActiveState, setInnerActiveState] = useState(false);

    const customElement = isValidElementType(ComponentRender) && (
        <div className="menu__item_custom">
            <ComponentRender />
        </div>
    );

    const parentButtonClickHandler = () => {
        if (onChangeHandler) {
            // console.log("parentButtonClickHandler", index);
            setInnerActiveState((prev) => !prev);
            onChangeHandler({ index, id, isBack: innerActiveState, routeAction: true });
        }
    };

    const popoverCloseHandler = () => {
        // console.log(innerActiveState, activeElement, index, "popoverCloseHandler");
    };
    // console.log(activeElement, "activeElement");
    return swappable ? (
        <>
            {/* {typeof children !== "string" ? ( */}
            {/*    <> */}
            {/*        /!* Parent menu item *!/ */}
            {/*        <button */}
            {/*            type="button" */}
            {/*            className={classNames("menu__item", { */}
            {/*                menu__item_danger: danger, */}
            {/*                menu__item_disabled: disabled */}
            {/*            })} */}
            {/*            {...(disabled ? { tabIndex: -1 } : {})} */}
            {/*            {...propsForPopover} */}
            {/*            onClick={() => { */}
            {/*                if (onChangeHandler) { */}
            {/*                    onChangeHandler({ index, id, isBack: false, routeAction: true }); */}
            {/*                } */}
            {/*            }} */}
            {/*        > */}
            {/*            <span className="menu__cell"> */}
            {/*                {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />} */}
            {/*                <span className="menu__itemTitle">{title}</span> */}
            {/*            </span> */}

            {/*            <ChevronRight className="menu__icon menu__icon_after" size={20} /> */}
            {/*        </button> */}
            {/*        {divider && <Divider />} */}
            {/*        /!* menu list wrapper *!/ */}
            {/*        <div */}
            {/*            className={classNames("menu__list  ", { */}
            {/*                menu__list_current: activeElement, */}
            {/*                menu__item_disabled: disabled */}
            {/*            })} */}
            {/*        > */}
            {/*            /!* header *!/ */}
            {/*            {swappable && ( */}
            {/*                <button */}
            {/*                    type="button" */}
            {/*                    className="menu__header" */}
            {/*                    onClick={() => { */}
            {/*                        if (onChangeHandler) { */}
            {/*                            onChangeHandler({ index, id, isBack: true, routeAction: true }); */}
            {/*                        } */}
            {/*                    }} */}
            {/*                > */}
            {/*                    <ChevronLeft className="menu__icon menu__icon_before" size={20} /> */}
            {/*                    <p className="menu__headerTitle">{title}</p> */}
            {/*                </button> */}
            {/*            )} */}

            {/*            <Scrollbar className="menu__content"> */}
            {/*                {Children.count(children) > 0 ? ( */}
            {/*                    <span className="menu__itemTitle">{children}</span> */}
            {/*                ) : ( */}
            {/*                    <div className="menu__empty"> */}
            {/*                        <h1>{emptyText || "No data to show"} e</h1> */}
            {/*                    </div> */}
            {/*                )} */}
            {/*            </Scrollbar> */}
            {/*        </div> */}
            {/*    </> */}
            {/* ) : ( */}
            {/*    // Simple menu item */}
            {/*    <> */}
            {/*        {customElement || ( */}
            {/*            <button */}
            {/*                type="button" */}
            {/*                className={classNames("menu__item", { */}
            {/*                    menu__item_danger: danger, */}
            {/*                    menu__item_selected: selected, */}
            {/*                    menu__item_disabled: disabled */}
            {/*                })} */}
            {/*                onClick={() => { */}
            {/*                    if (onChangeHandler) { */}
            {/*                        onChangeHandler({ index, id, isBack: false, routeAction: false }); */}
            {/*                    } */}
            {/*                }} */}
            {/*                {...(disabled ? { tabIndex: -1 } : {})} */}
            {/*            > */}
            {/*                <span className="menu__cell"> */}
            {/*                    {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />} */}
            {/*                    <span className="menu__itemTitle">{children}</span> */}
            {/*                </span> */}
            {/*                {(selected && <CheckMark className="menu__icon menu__icon_after" size={20} />) || */}
            {/*                    (IconAfter && <IconAfter className="menu__icon menu__icon_after" size={20} />)} */}
            {/*            </button> */}
            {/*        )} */}
            {/*        {divider && <Divider />} */}
            {/*    </> */}
            {/* )} */}
        </>
    ) : (
        <>
            {typeof children !== "string" ? (
                <>
                    {/* Parent menu item */}
                    <button
                        type="button"
                        className={classNames("menu__item", {
                            menu__item_danger: danger,
                            menu__item_disabled: disabled,
                            menu__item_active: activeElement
                        })}
                        {...(disabled ? { tabIndex: -1 } : {})}
                        {...propsForPopover}
                        onClick={parentButtonClickHandler}
                    >
                        <span className="menu__cell">
                            {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                            <span className="menu__itemTitle">{title}</span>
                        </span>

                        <ChevronRight className="menu__icon menu__icon_after" size={20} />
                    </button>
                    {divider && <Divider />}
                    {/* menu list wrapper */}
                    <Popover
                        setProps={setPropsForPopover}
                        size={swappable ? "mobile" : "small"}
                        disableReposition
                        position="right-top"
                        withArrow={false}
                        padding={5}
                        onClose={popoverCloseHandler}
                        open={activeElement}
                    >
                        <PopoverBody withPadding={false}>
                            <div
                                className={classNames("menu__list  ", {
                                    menu__list_current: activeElement,
                                    menu__item_disabled: disabled
                                })}
                            >
                                {/* header */}
                                {swappable && (
                                    <button
                                        type="button"
                                        className="menu__header"
                                        onClick={() => {
                                            if (onChangeHandler) {
                                                onChangeHandler({ index, id, isBack: true, routeAction: true });
                                            }
                                        }}
                                    >
                                        <ChevronLeft className="menu__icon menu__icon_before" size={20} />
                                        <p className="menu__headerTitle">{title}</p>
                                    </button>
                                )}

                                <Scrollbar className="menu__content">
                                    {Children.count(children) > 0 ? (
                                        <span className="menu__itemTitle">{children}</span>
                                    ) : (
                                        <div className="menu__empty">
                                            <h1>{emptyText || "No data to show"} e</h1>
                                        </div>
                                    )}
                                </Scrollbar>
                            </div>
                        </PopoverBody>
                    </Popover>
                </>
            ) : (
                // Simple menu item
                <>
                    {customElement || (
                        <button
                            type="button"
                            className={classNames("menu__item", {
                                menu__item_danger: danger,
                                menu__item_selected: selected,
                                menu__item_disabled: disabled
                            })}
                            onClick={() => {
                                if (onChangeHandler) {
                                    onChangeHandler({ index, id, isBack: false, routeAction: false });
                                }
                            }}
                            {...(disabled ? { tabIndex: -1 } : {})}
                        >
                            <span className="menu__cell">
                                {IconBefore && <IconBefore className="menu__icon menu__icon_before" size={20} />}
                                <span className="menu__itemTitle">{children}</span>
                            </span>
                            {(selected && <CheckMark className="menu__icon menu__icon_after" size={20} />) ||
                                (IconAfter && <IconAfter className="menu__icon menu__icon_after" size={20} />)}
                        </button>
                    )}
                    {divider && <Divider />}
                </>
            )}
        </>
    );
};

export { IMenuItemProps, MenuItem as default };
