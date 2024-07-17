import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Button, { IButtonProps } from './index';

const meta: Meta<typeof Button> = {
    title: 'Atoms/Button',
    component: Button,
    argTypes: {
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as IButtonProps
};

export default meta;

const Template: FC<IButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {} as IButtonProps;
