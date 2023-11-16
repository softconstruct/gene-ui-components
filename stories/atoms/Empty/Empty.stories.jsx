import React from 'react';

import EmptyComponent from 'src/lib/atoms/Empty/index';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/Empty',
    component: EmptyComponent,
    argTypes: {
        appearance: args({ control: 'select', defaultValue: 'with-circles', category: category.appearance }),
        type: args({ control: 'select', defaultValue: 'data', category: category.content }),
        size: args({ control: 'select', defaultValue: 'big', category: category.appearance }),
        title: args({ control: 'text', category: category.content }),
        subTitle: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        withImage: args({ control: 'boolean', category: category.functionality })
    },
    args: {
        appearance: 'with-circles',
        size: 'big',
        title: 'No Data to Display',
        subTitle: 'Duis tempus justo nec nunc accumsan eleifend.'
    }
};

const Template = ({ ...args }) => <EmptyComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    type: 'data',
    withImage: true
};

export const WithNoImage = Template.bind({});
WithNoImage.args = {
    type: 'message',
    withImage: false
};
