import React from 'react';

import ButtonComponent from 'src/lib/atoms/Button';
import { args, category } from '../../assets/storybook.globals';
const colors = ['primary', 'confirm', 'danger', 'default'];

export default {
    title: 'Atoms/Button',
    component: ButtonComponent,
    argTypes: {
        icon: args({ control: 'text', category: category.content }),
        onClick: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        ariaLabel: args({ control: 'text', category: category.others }),
        active: args({ control: 'boolean', category: category.states }),
        children: args({ control: 'text', category: category.content }),
        loading: args({ control: 'boolean', category: category.states }),
        disabled: args({ control: 'boolean', category: category.states }),
        appearance: args({ control: 'select', category: category.appearance }),
        withShadow: args({ control: 'boolean', category: category.appearance }),
        color: args({ control: 'select', options: colors, category: category.appearance }),
        size: args({ control: 'select', defaultValue: 'default', category: category.appearance }),
        cornerRadius: args({ control: 'select', defaultValue: 'round', category: category.appearance }),
        flexibility: args({ control: 'select', defaultValue: 'default', category: category.appearance }),
        itemsDirection: args({ control: 'select', defaultValue: 'start', category: category.appearance })
    },
    args: {
        size: 'default',
        flexibility: 'default',
        itemsDirection: 'start',
        cornerRadius: 'round',
        icon: '',
        disabled: false,
        active: false,
        loading: false,
        withShadow: false
    }
};

const Template = ({ children, ...args }) => {
    return <ButtonComponent {...args}>{children}</ButtonComponent>;
};

export const Default = Template.bind({});
Default.args = {
    appearance: 'default',
    children: 'Button'
};

export const Outline = Template.bind({});
Outline.args = {
    appearance: 'outline',
    children: 'Button Outline'
};

export const Minimal = Template.bind({});
Minimal.args = {
    appearance: 'minimal',
    children: 'Button Minimal'
};

export const Grayscale = Template.bind({});
Grayscale.args = {
    appearance: 'grayscale',
    children: 'Button Grayscale'
};

export const Clean = Template.bind({});
Clean.args = {
    appearance: 'clean',
    children: 'Button Clean'
};
