import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import Badge, { IBadgeProps } from './index';

const meta: Meta<typeof Badge> = {
    title: 'Atoms/Badge',
    component: Badge,
    argTypes: {
        size: args({ control: false, ...propCategory.others })
    },
    args: {
        size: 'fill the size prop value'
    } as IBadgeProps
};

export default meta;

const Template: FC<IBadgeProps> = (args) => <Badge {...args} />;

export const Default = Template.bind({});

Default.args = {} as IBadgeProps;
