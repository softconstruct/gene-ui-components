import React from 'react';

import AvatarComponent from 'src/lib/atoms/Avatar';
import { args, category } from '../../assets/storybook.globals';
export default {
    title: 'Atoms/Avatar',
    component: AvatarComponent,
    control: 'select',
    darkMode: {
        stylePreview: true
    },
    // src, icon, size, color, shape, onClick, children
    argTypes: {
        children: args({ control: 'text', category: category.content }),
        size: args({ control: 'select', category: category.appearance }),
        shape: args({ control: 'select', defaultValue: 'circle', category: category.appearance }),
        color: args({ control: 'select', defaultValue: 'default', category: category.appearance }),
        icon: args({ control: 'text', category: category.content }),
        src: args({ control: 'text', category: category.content }),
        onClick: args({ control: false, category: category.action })
    }
};
const Template = ({ children, ...args }) => <AvatarComponent {...args}>{children}</AvatarComponent>;

export let Default = Template.bind({});
Default.args = {
    children: 'US',
    size: 'default',
    shape: 'circle'
};

export const Square = Template.bind({});
Square.args = {
    icon: 'bc-icon-monospace',
    size: 'medium',
    shape: 'square',
    color: 'green'
};

export const Circled = Template.bind({});
Circled.args = {
    src: 'https://www.w3schools.com/howto/img_avatar.png',
    size: 'big',
    shape: 'circle'
};
