import React from 'react';

import LabelComponent from 'src/lib/atoms/Label/index';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/Label',
    component: LabelComponent,
    argTypes: {
        font: args({ control: 'select', category: category.appearance }),
        children: args({ control: 'text', category: category.content }),
        size: args({ control: 'select', category: category.appearance }),
        className: args({ control: false, category: category.others })
    }
};

const Template = ({ children, ...args }) => <LabelComponent {...args}>{children}</LabelComponent>;

export const Label = Template.bind({});
Label.args = {
    size: 'content',
    font: 'semiBold',
    children: 'Some Label'
};
