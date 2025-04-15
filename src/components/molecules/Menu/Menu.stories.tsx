import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import Button from "@components/atoms/Button";

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
        swappable: args({ control: "boolean", ...propCategory.appearance }),
        onChange: args({ control: "false", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.content }),
        setPropsForPopover: args({ control: "false", ...propCategory.functionality }),
        loadingText: args({ control: "text", ...propCategory.content }),
        isLoading: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance })
    },
    args: {} as IMenuProps
};

const MenuItemRecursion = (menuData) => {
    return menuData.map((el) => {
        return (
            <MenuItem
                key={el.id}
                selected={el.selected}
                title={el.children ? el.title : ""}
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

export default meta;

type Story = StoryObj<IMenuProps>;

const StoryComponent: FC = (props) => {
    const [menuData, setMenuData] = useState(data);
    const [propsForPopover, setPropsForPopover] = useState({});

    const updateSelection = (menu, id) => {
        return menu.map((item) => {
            const isSelected = item.id === id;
            const updatedItem = { ...item, selected: isSelected };

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
            <Button {...propsForPopover}>test</Button>
            <Menu {...props} onChange={onChange} setPropsForPopover={setPropsForPopover}>
                {Elements}
            </Menu>
        </div>
    );
};

export const Default: Story = {
    render: (props) => <StoryComponent {...props} />
};

export const Swappable: Story = {
    render: (props) => <StoryComponent {...props} />,
    args: { swappable: true }
};
