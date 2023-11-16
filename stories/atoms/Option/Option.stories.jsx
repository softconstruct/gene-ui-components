import React from 'react';

import OptionComponent from 'src/lib/atoms/Option/index';

import { optionConfig, screenTypes } from 'configs';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/Option',
    component: OptionComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        titlePosition: args({
            control: 'select',
            defaultValue: optionConfig.titlePosition.start,
            category: category.appearance
        }),
        description: args({ control: 'text', category: category.content }),
        assignedValue: args({ control: 'text', category: category.content }),
        color: args({
            control: 'select',
            defaultValue: optionConfig.color[0],
            options: optionConfig.color,
            category: category.appearance
        }),
        active: args({ control: 'boolean', category: category.states }),
        checkMark: args({ control: 'boolean', category: category.functionality }),
        forwardMark: args({ control: 'boolean', category: category.functionality }),
        sticky: args({
            control: 'select',
            defaultValue: optionConfig.sticky[0],
            options: optionConfig.sticky,
            category: category.appearance
        }),
        screenType: args({
            control: 'select',
            defaultValue: screenTypes[0],
            options: screenTypes,
            category: category.appearance
        }),
        leftCustomElement: args({ control: 'text', category: category.content }),
        rightCustomElement: args({ control: 'text', category: category.content }),
        content: args({ control: 'text', category: category.content }),
        onClick: args({ control: false, category: category.action }),
        disabled: args({ control: 'boolean', category: category.states }),
        className: args({ control: false, category: category.others }),
        forwardedRef: args({ control: false, category: category.others }),
        icon: args({ control: 'text', category: category.content }),
        border: args({
            control: 'select',
            defaultValue: optionConfig.border[0],
            options: optionConfig.border,
            category: category.appearance
        })
    }
};

const Template = ({ ...args }) => <OptionComponent {...args} />;

export const Option = Template.bind({});
Option.args = {
    title: 'Option title',
    description: 'Description',
    icon: 'bc-icon-apps',
    color: optionConfig.color[0],
    active: false,
    checkMark: false,
    forwardMark: false,
    assignedValue: '12',
    border: optionConfig.border[0],
    sticky: optionConfig.sticky[0],
    screenType: screenTypes[0],
    disabled: false
};
