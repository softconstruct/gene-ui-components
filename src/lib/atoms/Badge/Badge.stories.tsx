import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import BadgeComponent, { IBadgeProps } from './index';
import Avatar from '../Avatar';

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
        size: 'default',
        color: 'danger',
        dot: false,
        count: 100,
        maxCount: 99
    }
};

export default meta;

interface IBadgeExtended extends IBadgeProps {
    icon?: string;
}

const Template: FC<IBadgeExtended> = ({ icon = 'bc-icon-user', ...args }) => {
    return (
        <BadgeComponent {...args}>
            <Avatar shape="square" icon={icon} />
        </BadgeComponent>
    );
};

export const Default = Template.bind({});

export const Doted = Template.bind({});

Doted.args = {
    dot: true,
    icon: 'bc-icon-apps'
} as IBadgeExtended;

export const MaxCount = Template.bind({});

MaxCount.args = {
    size: 'medium',
    maxCount: 10,
    count: 11,
    icon: 'bc-icon-monospace'
} as IBadgeExtended;

export const WithoutChildren: FC<IBadgeProps> = ({ ...args }) => <BadgeComponent {...args} />;
