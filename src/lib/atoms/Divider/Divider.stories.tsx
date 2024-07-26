import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Divider, { IDividerProps } from './index';

const meta: Meta<typeof Divider> = {
    title: 'Atoms/Divider',
    component: Divider,
    argTypes: {
        type: args({ control: false, ...propCategory.others })
    },
    args: {
        type: 'fill the type prop value'
    } as IDividerProps
};

export default meta;

const Template: FC<IDividerProps> = (args) => <Divider {...args} />;

export const Default = Template.bind({});

Default.args = {} as IDividerProps;
