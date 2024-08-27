import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Avatar, { IAvatarProps } from './index';

const meta: Meta<typeof Avatar> = {
    title: 'Atoms/Avatar',
    component: Avatar,
    argTypes: {
        size: args({ control: 'select', ...propCategory.appearance }),
        color: args({ control: 'select', ...propCategory.appearance }),
        src: args({ control: 'text', ...propCategory.content }),
        fullName: args({ control: 'text', ...propCategory.content }),
        onClick: args({ control: 'false', ...propCategory.action }),
        isDisabled: args({ control: 'boolean', ...propCategory.states }),
        Icon: args({ control: 'false', ...propCategory.content })
    },
    args: {
        size: '6Xlarge',
        color: 'lagoon',
        fullName: 'name lastName',
        isDisabled: false
    }
};

export default meta;

const Template: FC<IAvatarProps> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});

Default.args = {} as IAvatarProps;
