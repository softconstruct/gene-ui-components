import React from 'react';

import SwitcherComponent from 'src/lib/atoms/Switcher/index';
import { checkboxRadioSwitcherConfig } from 'src/configs';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/Switcher',
    component: SwitcherComponent,
    argTypes: {
        onChange: args({ control: false, category: category.functionality }),
        size: args({
            control: 'select',
            options: checkboxRadioSwitcherConfig.size,
            category: category.appearance
        }),
        onText: args({ control: 'text', category: category.content }),
        offText: args({ control: 'text', category: category.content }),
        label: args({ control: 'text', category: category.content }),
        labelPosition: args({
            control: 'select',
            options: checkboxRadioSwitcherConfig.labelPosition,
            category: category.appearance
        }),
        labelAlignment: args({
            control: 'select',
            options: checkboxRadioSwitcherConfig.labelAlignment,
            category: category.appearance
        }),
        description: args({ control: 'text', category: category.content }),
        changeOnEnter: args({ control: 'boolean', category: category.states }),
        defaultChecked: args({ control: 'boolean', category: category.states }),
        checked: args({ control: 'boolean', category: category.states }),
        value: args({ control: false, category: category.content }),
        readOnly: args({ control: 'boolean', category: category.states }),
        disabled: args({ control: 'boolean', category: category.states }),
        required: args({ control: 'boolean', category: category.validation }),
        isValid: args({ control: 'boolean', category: category.validation }),
        errorText: args({ control: 'text', category: category.validation }),
        className: args({ control: false, category: category.others })
    },
    args: {
        labelAlignment: [...checkboxRadioSwitcherConfig.labelAlignment[0]],
        labelPosition: [...checkboxRadioSwitcherConfig.labelPosition[0]],
        onText: 'On',
        offText: 'Off',
        size: [...checkboxRadioSwitcherConfig.size[0]],
        label: 'Label',
        description: '',
        changeOnEnter: true,
        readOnly: false,
        disabled: false,
        required: false,
        isValid: true,
        errorText: 'Error text goes here',
        defaultChecked: true
    }
};

export const Switcher = ({ ...args }) => <SwitcherComponent {...args} />;
