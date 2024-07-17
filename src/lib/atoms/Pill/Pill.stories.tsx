import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Pill, { IPillProps } from './index';

const meta: Meta<typeof Pill> = {
    title: 'Atoms/Pill',
    component: Pill,
    argTypes: {
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as IPillProps
};

export default meta;

const Template: FC<IPillProps> = (args) => <Pill {...args} />;

export const Default = Template.bind({});

Default.args = {} as IPillProps;
