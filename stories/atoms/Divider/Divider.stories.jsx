import React from 'react';

import DividerComponent from 'src/lib/atoms/Divider/index';
import { args, category } from '../../assets/storybook.globals';

export default {
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

const Template = ({ ...args }) => <DividerComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    type: 'horizontal'
};

export const Vertical = Template.bind({});
Vertical.args = {
    type: 'vertical'
};
