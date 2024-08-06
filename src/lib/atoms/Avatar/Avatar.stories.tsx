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
        src: args({ control: 'text', ...propCategory.functionality }),
        fullName: args({ control: 'text', ...propCategory.functionality }),
        onClick: args({ control: 'false', ...propCategory.functionality }),
        isDisabled: args({ control: 'boolean', ...propCategory.states })
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
