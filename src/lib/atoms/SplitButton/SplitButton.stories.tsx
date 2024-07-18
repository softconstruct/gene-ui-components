import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import SplitButton, { ISplitButtonProps } from './index';

const meta: Meta<typeof SplitButton> = {
    title: 'Atoms/SplitButton',
    component: SplitButton,
    argTypes: {
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as ISplitButtonProps
};

export default meta;

const Template: FC<ISplitButtonProps> = (args) => <SplitButton {...args} />;

export const Default = Template.bind({});

Default.args = {} as ISplitButtonProps;
