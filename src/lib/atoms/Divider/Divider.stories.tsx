import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import DividerComponent, { IDividerProps } from './index';

const meta: Meta<typeof DividerComponent> = {
    title: 'Atoms/Divider',
    component: DividerComponent,
    argTypes: {
        type: args({ control: 'select', ...propCategory.appearance }),
        size: args({ control: 'text', ...propCategory.appearance }),
        withSpace: args({ control: 'boolean', ...propCategory.appearance }),
        className: args({ control: false, ...propCategory.others })
    },
    args: {
        size: '50px',
        withSpace: true
    }
};

export default meta;

const Template: FC<IDividerProps> = ({ ...args }) => <DividerComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    type: 'horizontal'
};

export const Vertical = Template.bind({});
Vertical.args = {
    type: 'vertical'
};
