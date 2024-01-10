import { Meta, StoryObj } from '@storybook/react';
import AvatarComponent from './index';
import { args, category } from '../../../../stories/assets/storybook.globals';

const meta = {
    title: 'Atoms/Avatar',
    component: AvatarComponent,
    argTypes: {
        children: args({ control: 'text', category: category.content }),
        size: args({ control: 'select', category: category.appearance }),
        shape: args({ control: 'select', defaultValue: 'circle', category: category.appearance }),
        color: args({ control: 'select', defaultValue: 'default', category: category.appearance }),
        icon: args({ control: 'text', category: category.content }),
        src: args({ control: 'text', category: category.content }),
        onClick: args({ control: false, category: category.action })
    }
} satisfies Meta<typeof AvatarComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'US',
        size: 'default',
        shape: 'circle'
    }
};

export const Square: Story = {
    args: {
        icon: 'bc-icon-monospace',
        size: 'medium',
        shape: 'square',
        color: 'green'
    }
};

export const Circled: Story = {
    args: {
        src: 'https://www.w3schools.com/howto/img_avatar.png',
        size: 'big',
        shape: 'circle'
    }
};
