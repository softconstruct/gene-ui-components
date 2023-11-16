import React from 'react';

import TitleComponent from 'src/lib/atoms/Title/index';
import { args, category } from '../../assets/storybook.globals';

import { titleConfig } from 'configs';

export default {
    title: 'Atoms/Title',
    component: TitleComponent,
    argTypes: {
        text: args({ control: 'text', category: category.content }),
        icon: args({ control: 'text', category: category.content }),
        actions: args({ control: 'text', category: category.content }),
        color: args({
            control: 'select',
            defaultValue: titleConfig.color[0],
            options: titleConfig.color,
            category: category.appearance
        }),
        withLine: args({ control: 'boolean', category: category.appearance }),
        className: args({ control: false, category: category.others })
    },
    args: {
        actions: 'Text'
    }
};

const Template = ({ text, ...args }) => <TitleComponent text={text} {...args}></TitleComponent>;

export const Title = Template.bind({});
Title.args = {
    text: 'Some Text',
    icon: 'bc-icon-align-center',
    color: titleConfig.color[0],
    withLine: true
};
