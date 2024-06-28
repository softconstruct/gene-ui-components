import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Label, { ILabelProps } from './index';

const meta: Meta<typeof Label> = {
    title: 'Atoms/Label',
    component: Label,
    argTypes: {
        prop: args({ control: false, ...propCategory.others })
    },
    args: {
        prop: 'fill the prop prop value'
    } as ILabelProps
};

export default meta;

const Template: FC<ILabelProps> = (args) => <Label {...args} />;

export const Default = Template.bind({});

Default.args = {} as ILabelProps;
