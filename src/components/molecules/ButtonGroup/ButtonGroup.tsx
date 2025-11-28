import React, { Children, cloneElement, FC, isValidElement, JSX, ReactNode, useEffect, useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";

import { ThreeDotsHorizontal } from "@geneui/icons";

// Components
import Button, { IButtonProps } from "@components/atoms/Button";
import { IMenuItemProps, Menu, MenuItem } from "@components/molecules/Menu";

// Styles
import "./ButtonGroup.scss";

interface IButtonGroupProps {
    /**
     * Additional class for the parent element.
     * This prop should be used to set placement properties for the element relative to its parent using BEM conventions.
     */
    className?: string;
    /**
     * The content of the button group, expected to be a series of Button components.
     */
    children: ReactNode;
    /**
     * The size of the buttons in the group. This will be applied to all buttons, including the dropdown trigger.
     * The type is inherited from the Button component's props for consistency.
     * Possible values: `large | medium | small | "smallNudge"`
     */
    size?: IButtonProps["size"];
}

const MAX_VISIBLE_BUTTONS = 3;

/**
 * A button group clusters multiple buttons together. Use button groups in toolbars, forms, and modals, etc.
 */
const ButtonGroup: FC<IButtonGroupProps> = ({ className, children, size = "medium" }) => {
    const [menuPropsForPopover, setMenuPropsForPopover] = useState({});
    const [splitChildren, setSplitChildren] = useState(children);
    const [menuData, setMenuData] = useState<IMenuItemProps[]>([]);
    const [childArray, setChildArray] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (!children) return;
        const clonedChildren = Children.map(children, (el) => {
            if (isValidElement(el)) {
                const generatedId = el.props.id || `button-group-${nanoid()}`;
                return cloneElement(el, {
                    ...el.props,
                    size: size as IButtonProps["size"],
                    id: generatedId
                });
            }
            return el;
        });
        const childrenArray = Children.toArray(clonedChildren) as JSX.Element[];
        setChildArray(childrenArray);

        if (Array.isArray(clonedChildren) && clonedChildren?.length <= MAX_VISIBLE_BUTTONS) {
            setSplitChildren(clonedChildren);
            setMenuData([]);
        } else {
            const visibleChildren = childrenArray.slice(0, MAX_VISIBLE_BUTTONS);
            const hiddenChildren = childrenArray.slice(MAX_VISIBLE_BUTTONS);
            setSplitChildren(visibleChildren);
            setMenuData(
                hiddenChildren.map((child) => ({
                    id: child.props.id,
                    title: child.props.children,
                    IconBefore: child.props.Icon,
                    danger: child.props.appearance === "danger",
                    disabled: child.props.disabled
                }))
            );
        }
    }, [children, size]);

    const menuSelectHandler = (menuItem: IMenuItemProps) => {
        const selectedChild = childArray.find((child) => child.props.id === menuItem.id);
        if (selectedChild) {
            selectedChild.props.onClick?.();
        }
    };

    if (childArray.length === 0) return null;

    return (
        <div className={classNames("buttonGroup", className)}>
            {splitChildren}
            {menuData.length > 0 && (
                <>
                    <Button
                        Icon={ThreeDotsHorizontal}
                        layout="text"
                        appearance="secondary"
                        size={size as IButtonProps["size"]}
                        {...menuPropsForPopover}
                    />
                    <Menu
                        onChange={menuSelectHandler}
                        setPropsForPopover={setMenuPropsForPopover}
                        position="bottom-right"
                    >
                        {menuData.map((item) => {
                            return (
                                <MenuItem
                                    key={item.id}
                                    id={item.id}
                                    IconBefore={item.IconBefore}
                                    danger={item.danger}
                                    disabled={item.disabled}
                                >
                                    {item.title}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </>
            )}
        </div>
    );
};

export { IButtonGroupProps, ButtonGroup as default };
