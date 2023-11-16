import React from 'react';

import CheckboxGroupComponent from 'src/lib/organisms/CheckboxGroup';
import { checkboxRadioSwitcherConfig } from '../../utils/propTables/CheckboxProp';
import { args, category } from '../../assets/storybook.globals';

const options = [
    {
        label: 'Option 1',
        value: 1
    },
    {
        label: 'Option 2',
        value: 2
    },
    {
        label: 'Option 3',
        value: 3,
        disabled: true
    }
];

export default {
    title: 'Organisms/CheckboxGroup',
    component: CheckboxGroupComponent,
    argTypes: {
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
        value: args({ control: false, category: category.content }),
        data: args({ control: 'array', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        disabled: args({ control: 'boolean', category: category.states }),
        description: args({ control: 'text', category: category.content }),
        errorText: args({ control: 'text', category: category.validation }),
        checkAllText: args({ control: 'text', category: category.content }),
        isValid: args({ control: 'boolean', category: category.validation }),
        required: args({ control: 'boolean', category: category.validation }),
        defaultSelected: args({ control: 'array', category: category.states }),
        readOnly: args({ control: 'boolean', category: category.functionality }),
        showSelectAll: args({ control: 'boolean', category: category.functionality }),
        size: args({ control: 'select', options: checkboxRadioSwitcherConfig.size, category: category.appearance })
    },
    args: {
        data: options,
        isValid: true,
        readOnly: false,
        description: 'description',
        required: false,
        disabled: false,
        showSelectAll: false,
        checkAllText: 'check All Text',
        errorText: 'Error text goes here',
        size: checkboxRadioSwitcherConfig.size[0],
        defaultSelected: [options[1].value, options[0].value],
        labelPosition: checkboxRadioSwitcherConfig.labelPosition[0],
        labelAlignment: checkboxRadioSwitcherConfig.labelAlignment[0]
    }
};

export const Default = ({ ...args }) => <CheckboxGroupComponent {...args} />;

export const WithCheckAll = ({ ...args }) => <CheckboxGroupComponent {...args} />;

WithCheckAll.args = {
    data: options,
    description: '',
    showSelectAll: true
};
