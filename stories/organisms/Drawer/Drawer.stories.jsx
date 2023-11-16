import React from 'react';

import DrawerComponent from 'src/lib/organisms/Drawer';
import { menuData } from './data';
import { args, category } from '../../assets/storybook.globals';

const positions = ['relative', 'absolute', 'fixed', 'sticky'];

export default {
    title: 'Organisms/Drawer',
    component: DrawerComponent,
    argTypes: {
        value: args({ control: 'text', category: category.states }),
        onOpen: args({ control: false, category: category.action }),
        title: args({ control: 'text', category: category.content }),
        onClose: args({ control: false, category: category.action }),
        onChange: args({ control: false, category: category.action }),
        menu: args({ control: 'object', category: category.content }),
        isOpen: args({ control: 'boolean', category: category.states }),
        className: args({ control: false, category: category.others }),
        height: args({ control: 'text', category: category.appearance }),
        defaultValue: args({ control: 'text', category: category.states }),
        onOutsideClick: args({ control: false, category: category.action }),
        defaultOpen: args({ control: 'boolean', category: category.states }),
        closeAfterSelect: args({ control: 'boolean', category: category.functionality }),
        closeWithOutsideClick: args({ control: 'boolean', category: category.functionality }),
        position: args({ control: 'select', options: positions, category: category.appearance })
    },
    args: {
        height: '97vh',
        menu: menuData,
        title: 'Menu Title',
        position: positions[0],
        closeAfterSelect: false,
        closeWithOutsideClick: false
    }
};

export const Drawer = ({ ...args }) => <DrawerComponent {...args} />;
