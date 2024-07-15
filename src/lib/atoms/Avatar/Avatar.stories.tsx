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
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as IAvatarProps
};

export default meta;

const Template: FC<IAvatarProps> = (args) => <Avatar {...args} />;

export const Default = Template.bind({});

Default.args = {} as IAvatarProps;
