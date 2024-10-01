import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Checkbox, { ICheckboxProps } from './index';

const meta: Meta<typeof Checkbox> = {
    title: 'Molecules/Checkbox',
    component: Checkbox,
    argTypes: {
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as ICheckboxProps
};

export default meta;

const Template: FC<ICheckboxProps> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});

Default.args = {} as ICheckboxProps;
