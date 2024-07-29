import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import HelperText, { IHelperTextProps } from './index';

const meta: Meta<typeof HelperText> = {
    title: 'Atoms/HelperText',
    component: HelperText,
    argTypes: {
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as IHelperTextProps
};

export default meta;

const Template: FC<IHelperTextProps> = (args) => <HelperText {...args} />;

export const Default = Template.bind({});

Default.args = {} as IHelperTextProps;
