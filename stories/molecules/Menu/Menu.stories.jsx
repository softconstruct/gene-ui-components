import React, { useState } from 'react';

import MenuComponent from 'src/lib/molecules/Menu';
import { data } from './data';
import { screenTypes } from '../../../src/configs';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Molecules/Menu',
    component: MenuComponent,
    argTypes: {
        onNext: args({ control: false, category: category.action }),
        onSelect: args({ control: false, category: category.action }),
        data: args({ control: 'object', category: category.content }),
        onBack: args({ control: false, action: 'onBack', category: category.action }),
        scrollToActiveElement: args({ control: 'boolean', category: category.functionality }),
        screenType: args({ control: 'select', options: screenTypes, category: category.appearance })
    },
    args: {
        data,
        scrollToActiveElement: true,
        screenType: args({ control: 'select', options: screenTypes, category: category.appearance }),
        initialIndexStack: []
    }
};

export const Menu = ({ ...args }) => {
    return <MenuComponent {...args} />;
};
