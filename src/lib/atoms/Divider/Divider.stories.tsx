import React, { FC } from 'react';
import { args, category } from '../../../../stories/assets/storybook.globals';
import { Meta } from '@storybook/react';

// Components
import DividerComponent, { IDividerProps } from './index';

const meta: Meta<typeof DividerComponent> = {
    title: 'Atoms/Divider',
    component: DividerComponent,
    argTypes: {
        type: args({ control: 'select', category: category.appearance }),
        size: args({ control: 'text', category: category.appearance }),
        withSpace: args({ control: 'boolean', category: category.appearance }),
        className: args({ control: false, category: category.others })
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
