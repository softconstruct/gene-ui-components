import { Meta, StoryObj } from '@storybook/react';
import LinkButton from './index';
import { args, category } from '../../../../stories/assets/storybook.globals';

const meta = {
    component: LinkButton,
    title: 'Atoms/LinkButton',
    argTypes: {
        href: args({ control: 'text', category: category.content }),
        onClick: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        children: args({ control: 'text', category: category.content }),
        ariaLabel: args({ control: 'text', category: category.others }),
        onMouseDown: args({ control: false, category: category.action }),
        iconAfter: args({ control: 'text', category: category.content }),
        iconBefore: args({ control: 'text', category: category.content }),
        isDisabled: args({ control: 'boolean', category: category.states })
    }
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
    args: {
        iconAfter: 'bc-icon-arrow-right'
    }
};
