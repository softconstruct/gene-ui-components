import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import { args, category } from 'stories/assets/storybook.globals';

import LinkButtonCmp, { ILinkButtonProps } from '.';

const meta: Meta<typeof LinkButtonCmp> = {
    title: 'Atoms/LinkButton',
    component: LinkButtonCmp,
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
    },
    args: {
        iconAfter: 'bc-icon-arrow-down'
    }
} as Meta<typeof LinkButtonCmp>;

export default meta;
// type Story = StoryObj<typeof LinkButtonCmp>;

// export const Playground: Story = {
//     render: (args) => <LinkButton {...args} />
// };

export const LinkButton = (args: ILinkButtonProps) => <LinkButtonCmp {...args} />;
