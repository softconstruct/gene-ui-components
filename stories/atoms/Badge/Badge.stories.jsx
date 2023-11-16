import React from 'react';

import BadgeComponent from 'src/lib/atoms/Badge';
import Avatar from 'src/lib/atoms/Avatar';
import { args, category } from '../../assets/storybook.globals';
import { badgeConfig } from '../../../src/configs';

export default {
    title: 'Atoms/Badge',
    component: BadgeComponent,
    argTypes: {
        icon: args({ control: 'text', category: category.content }),
        count: args({ control: 'number', category: category.content }),
        className: args({ control: false, category: category.others }),
        children: args({ control: 'text', category: category.content }),
        dot: args({ control: 'boolean', category: category.appearance }),
        maxCount: args({ control: 'number', category: category.content }),
        size: args({ control: 'select', options: badgeConfig.size, category: category.appearance }),
        color: args({ control: 'select', options: badgeConfig.color, category: category.appearance })
    },
    args: {
        size: badgeConfig.size[0],
        dot: false,
        color: badgeConfig.color[0],
        count: 100,
        maxCount: 99
    }
};

const Template = ({ icon, ...args }) => {
    return (
        <BadgeComponent {...args}>
            <Avatar shape="square" icon={icon} />
        </BadgeComponent>
    );
};

export const Default = Template.bind({});
Default.args = {
    count: 0,
    maxCount: 0,
    icon: 'bc-icon-user'
};

export const Doted = Template.bind({});
Doted.args = {
    dot: true,
    icon: 'bc-icon-apps'
};

export const MaxCount = Template.bind({});
MaxCount.args = {
    size: badgeConfig.size[1],
    maxCount: 10,
    count: 11,
    icon: 'bc-icon-monospace'
};

export const WithoutChildren = ({ ...args }) => <BadgeComponent {...args} />;
WithoutChildren.args = {
    size: badgeConfig.size[2],
    color: badgeConfig.color[1]
};
