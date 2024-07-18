import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import TextField, { ITextFieldProps } from './index';

const meta: Meta<typeof TextField> = {
    title: 'Molecules/TextField',
    component: TextField,
    argTypes: {
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as ITextFieldProps
};

export default meta;

const Template: FC<ITextFieldProps> = (args) => <TextField {...args} />;

export const Default = Template.bind({});

Default.args = {} as ITextFieldProps;
