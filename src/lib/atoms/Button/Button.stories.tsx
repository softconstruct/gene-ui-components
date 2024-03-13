import React, { FC } from 'react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
import { Meta } from '@storybook/react';

// Components
import ButtonComponent, { IButtonProps } from './index';

const colors = ['primary', 'confirm', 'danger', 'default'];

const cornerRadius = ['round', 'smooth'];

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
        appearance: args({ control: 'select', ...propCategory.appearance }),
        withShadow: args({ control: 'boolean', ...propCategory.appearance }),
        color: args({ control: 'select', options: colors, ...propCategory.appearance }),
        size: args({ control: 'select', defaultValue: 'default', ...propCategory.appearance }),
        cornerRadius: args({
            control: 'select',
            defaultValue: 'round',
            options: cornerRadius,
            ...propCategory.appearance
        }),
        flexibility: args({ control: 'select', defaultValue: 'default', ...propCategory.appearance }),
        itemsDirection: args({ control: 'select', defaultValue: 'start', ...propCategory.appearance })
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

export default meta;

const Template: FC<IButtonProps> = ({ children, ...args }) => {
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
