import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { Globe, LightBulb } from "@geneui/icons";
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Menu, { IMenuProps } from "./index";
import MenuItem from "./MenuItem";

const meta: Meta<typeof Menu> = {
    title: "Molecules/Menu",
    component: Menu,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
    },
    args: {} as IMenuProps
};

export default meta;

const Template: FC<IMenuProps> = (props) => {
    return <Menu {...props} />;
};

const data = [
    { title: "item 1", selected: false, id: "1233", value: "name1", IconBefore: Globe },
    { title: "item 2", selected: false, id: "123fd343", value: "name3", IconAfter: LightBulb },
    {
        title: "item 3",
        selected: false,
        id: "1236343",
        value: "name4",
        IconBefore: Globe,
        children: [
            { title: "item 44", selected: false, id: "1d23s3", value: "name55" },
            {
                title: "item 555",
                selected: false,
                id: "12as3343",
                value: "name355",
                children: [
                    { title: "item 44", selected: false, id: "1s23s3", value: "name55" },
                    { title: "item 555", selected: false, id: "12as33f43", value: "name355" },
                    {
                        title: "item 35555",
                        selected: false,
                        id: "123sdsd6343",
                        value: "name4ff",
                        defaultOpened: true,
                        children: [
                            { title: "item 44", selected: false, id: "123s3", value: "name55" },
                            { title: "item 555", selected: true, id: "1d2as3343", value: "name355" }
                        ]
                    }
                ]
            },
            {
                title: "item 35555",
                selected: false,
                id: "123sdsd6343",
                value: "name4ff",
                children: [
                    { title: "item 44", selected: false, id: "1fgf23s3", value: "name55" },
                    { title: "item 555", selected: true, id: "12as334df3", value: "name355" }
                ]
            }
        ]
    }
];

const MenuItemRecusion = (menuData) => {
    return menuData.map((el, i) => {
        return (
            <MenuItem
                key={el.id}
                selected={el.selected}
                index={i}
                title={el.children ? el.title : ""}
                defaultOpened={el.defaultOpened}
                IconBefore={el.IconBefore}
                IconAfter={el.IconAfter}
            >
                {el.children ? MenuItemRecusion(el.children) : el.title}
            </MenuItem>
        );
    });
};

const TemplateNext: FC<IMenuProps> = () => {
    const [menuData, setMenuData] = useState(data);
    const updateMenuData = (menu, paths, depth = 0) => {
        return menu.map((item, index) => {
            const isSelected = index === paths[depth] && depth === paths.length - 1;
            const hasChildren = item.children && item.children.length > 0;

            return {
                ...item,
                selected: isSelected,
                children: hasChildren ? updateMenuData(item.children, paths, depth + 1) : item.children
            };
        });
    };

    const control = (paths) => {
        const updatedMenuData = updateMenuData(menuData, paths);
        setMenuData(updatedMenuData);
    };

    const Elements = MenuItemRecusion(menuData);
    return (
        <div style={{ height: "98vh" }}>
            <Menu control={control}>{Elements}</Menu>
        </div>
    );
};

export const Default = Template.bind({});
export const Swipe = TemplateNext.bind({});

Default.args = {} as IMenuProps;
