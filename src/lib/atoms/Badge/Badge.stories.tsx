import React, { FC } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
import { badgeConfig } from '../../../../src/configs';

import BadgeComponent from './index';
import Avatar from '../Avatar/index';

import { IBadgeProps } from './Badge';

const meta: Meta<typeof BadgeComponent> = {
    title: 'Atoms/Badge',
    component: BadgeComponent,
    argTypes: {
        count: args({ control: 'number', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        children: args({ control: 'text', ...propCategory.content }),
        dot: args({ control: 'boolean', ...propCategory.appearance }),
        maxCount: args({ control: 'number', ...propCategory.content }),
        size: args({ control: 'select', ...propCategory.appearance }),
        color: args({ control: 'select', ...propCategory.appearance })
    },
    args: {
        //@ts-ignore
        size: badgeConfig.size[0],
        //@ts-ignore
        color: badgeConfig.color[0],
        dot: false,
        count: 100,
        maxCount: 99
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

interface IBadgeExtended extends IBadgeProps {
    icon?: string;
}

type StoryTemplateType = Story & FC<IBadgeExtended>;

export const Default: StoryTemplateType = ({ icon = 'bc-icon-user', ...args }) => {
    return (
        <BadgeComponent {...args}>
            <Avatar shape="square" icon={icon} />
        </BadgeComponent>
    );
};

export const Doted: Story = (args: IBadgeProps) => {
    return <Default {...args} icon="bc-icon-apps" />;
};

Doted.args = {
    dot: true
};

export const MaxCount: Story = (args: IBadgeProps) => {
    return <Default icon="bc-icon-monospace" {...args} />;
};

MaxCount.args = {
    //@ts-ignore
    size: badgeConfig.size[1],
    maxCount: 10,
    count: 11
};

export const WithoutChildren: Story = (args: IBadgeProps) => <BadgeComponent {...args} />;

WithoutChildren.args = {
    //@ts-ignore
    size: badgeConfig.size[2],
    //@ts-ignore
    color: badgeConfig.color[1]
};
