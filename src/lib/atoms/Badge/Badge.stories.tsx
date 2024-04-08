import React, { FC } from 'react';
import { Meta } from '@storybook/react';

//helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
import { badgeConfig } from '../../../../src/configs';

// components
import BadgeComponent from './index';
import Avatar from '../Avatar/index';

//types
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
        size: badgeConfig.size[0] as IBadgeProps['size'],
        color: badgeConfig.color[0] as IBadgeProps['color'],
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
};

export const MaxCount = Template.bind({});

MaxCount.args = {
    size: badgeConfig.size[1] as IBadgeProps['size'],
    maxCount: 10,
    count: 11,
    icon: 'bc-icon-monospace'
};

export const WithoutChildren: FC<IBadgeProps> = ({ ...args }) => <BadgeComponent {...args} />;
