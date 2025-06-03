import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Button from "@components/atoms/Button";
import { IMenuProps, Menu, MenuItem } from "@components/molecules/Menu/index";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { data } from "../../../../stories/data/__menu";

const meta: Meta<typeof Menu> = {
    title: "Molecules/Menu",
    component: Menu,
    subcomponents: { MenuItem },
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        swappable: args({ control: "boolean", ...propCategory.appearance }),
        onChange: args({ control: "false", ...propCategory.action }),
        children: args({ control: "false", ...propCategory.content }),
        setPropsForPopover: args({ control: "false", ...propCategory.functionality }),
        loadingText: args({ control: "text", ...propCategory.content }),
        loading: args({ control: "boolean", ...propCategory.states }),
        open: args({ control: "boolean", ...propCategory.states }),
        size: args({ control: "select", ...propCategory.appearance }),
        openSelectedPath: args({ control: "boolean", ...propCategory.appearance }),
        position: args({
            control: "select",
            ...propCategory.appearance,
            options: [
                "bottom-center",
                "bottom-left",
                "bottom-right",
                "left-bottom",
                "left-center",
                "left-top",
                "right-bottom",
                "right-center",
                "right-top",
                "top-center",
                "top-left",
                "top-right",
                "auto"
            ]
        })
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
                loading={el.loading}
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

    const handleMenuChange = (id) => {
        const updateSelected = (items, targetId) => {
            return items.map((item) => {
                const isSelected = item.id === id;
                const updatedItem = { ...item, selected: isSelected };

                if (item.children) {
                    updatedItem.children = updateSelected(item.children, targetId);
                }

                return updatedItem;
            });
        };

        setMenuData(updateSelected(menuData, id));
    };

    const Elements = MenuItemRecursion(menuData);

    return (
        <div style={{ height: "98vh" }}>
            <Button {...propsForPopover}>test</Button>
            <Menu {...props} onChange={handleMenuChange} setPropsForPopover={setPropsForPopover}>
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
