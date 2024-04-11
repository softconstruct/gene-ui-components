import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import ButtonComponent from './index';

// Types
import { IButtonProps } from './index';

// Configs
import { ButtonConfig } from './Button';

const meta: Meta<typeof ButtonComponent> = {
    title: 'Atoms/Button',
    component: ButtonComponent,
    argTypes: {
        icon: args({ control: 'text', ...propCategory.content }),
        onClick: args({ control: false, ...propCategory.action }),
        className: args({ control: false, ...propCategory.others }),
        ariaLabel: args({ control: 'text', ...propCategory.others }),
        active: args({ control: 'boolean', ...propCategory.states }),
        children: args({ control: 'text', ...propCategory.content }),
        loading: args({ control: 'boolean', ...propCategory.states }),
        disabled: args({ control: 'boolean', ...propCategory.states }),
        appearance: args({
            control: 'select',
            defaultValue: 'default',
            options: ButtonConfig.appearance,
            ...propCategory.appearance
        }),
        withShadow: args({ control: 'boolean', ...propCategory.appearance }),
        color: args({ control: 'select', options: ButtonConfig.color, ...propCategory.appearance }),
        size: args({
            control: 'select',
            options: ButtonConfig.size,

            ...propCategory.appearance
        }),
        cornerRadius: args({
            control: 'select',
            options: ButtonConfig.cornerRadius,
            defaultValue: 'round',
            ...propCategory.appearance
        }),
        flexibility: args({
            control: 'select',
            options: ButtonConfig.flexibility,
            defaultValue: 'default',
            ...propCategory.appearance
        }),
        itemsDirection: args({
            control: 'select',
            defaultValue: 'start',
            options: ButtonConfig.itemsDirection,
            ...propCategory.appearance
        })
    },
    args: {
        appearance: 'default',
        size: 'default',
        cornerRadius: 'round',
        flexibility: 'default',
        itemsDirection: 'start'
    }
};

export default meta;

const Template: FC<IButtonProps> = ({ children, ...args }) => {
    return <ButtonComponent {...args}>{children}</ButtonComponent>;
};

export const Default = Template.bind({});
Default.args = {
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
