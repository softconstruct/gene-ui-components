import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { data } from "./__shared/data";
// Components
import Menu, { IMenuProps } from "./index";
import MenuItem from "./MenuItem";

const meta: Meta<typeof Menu> = {
    title: "Molecules/Menu",
    component: Menu,
    subcomponents: { MenuItem },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        isLoading: args({ control: "boolean", ...propCategory.state })
    },
    args: {} as IMenuProps
};

export default meta;

const MenuItemRecursion = (menuData) => {
    return menuData.map((el, i) => {
        return (
            <MenuItem
                key={el.id}
                selected={el.selected}
                index={i}
                title={el.children ? el.title : ""}
                defaultOpened={el?.defaultOpened}
                IconBefore={el.IconBefore}
                IconAfter={el.IconAfter}
                danger={el.danger}
                disabled={el.disabled}
                isLoading={el.isLoading}
                id={el.id}
                divider={el.divider}
                loadingText={el.loadingText}
                emptyText={el.emptyText}
                ComponentRender={el.ComponentRender}
            >
                {el.children ? MenuItemRecursion(el.children) : el.title}
            </MenuItem>
        );
    });
};

const TemplateNext: FC<IMenuProps> = (props) => {
    const [menuData, setMenuData] = useState(data);
    const updateSelection = (menu, id) => {
        return menu.map((item) => {
            const isSelected = item.id === id;
            const updatedItem = {
                ...item,
                selected: isSelected
            };

            if (item.children) {
                updatedItem.children = updateSelection(item.children, id);
            }

            return updatedItem;
        });
    };

    const onChange = (paths, id) => {
        const updatedMenuData = updateSelection(menuData, id);
        setMenuData(updatedMenuData);
    };

    const Elements = MenuItemRecursion(menuData);
    return (
        <div style={{ height: "98vh" }}>
            <Menu {...props} onChange={onChange}>
                {Elements}
            </Menu>
        </div>
    );
};

export const Default = TemplateNext.bind({});

Default.args = {} as IMenuProps;
