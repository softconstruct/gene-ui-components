import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import ButtonComponent, { IButtonProps } from './index';

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
        appearance: args({ control: 'select', defaultValue: 'default', ...propCategory.appearance }),
        withShadow: args({ control: 'boolean', ...propCategory.appearance }),
        color: args({ control: 'select', ...propCategory.appearance }),
        size: args({ control: 'select', ...propCategory.appearance }),
        cornerRadius: args({ control: 'select', defaultValue: 'round', ...propCategory.appearance }),
        flexibility: args({ control: 'select', defaultValue: 'default', ...propCategory.appearance }),
        itemsDirection: args({ control: 'select', defaultValue: 'start', ...propCategory.appearance })
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
} as IButtonProps;

export const Outline = Template.bind({});
Outline.args = {
    appearance: 'outline',
    children: 'Button Outline'
} as IButtonProps;

export const Minimal = Template.bind({});
Minimal.args = {
    appearance: 'minimal',
    children: 'Button Minimal'
} as IButtonProps;

export const Grayscale = Template.bind({});
Grayscale.args = {
    appearance: 'grayscale',
    children: 'Button Grayscale'
} as IButtonProps;

export const Clean = Template.bind({});
Clean.args = {
    appearance: 'clean',
    children: 'Button Clean'
} as IButtonProps;
