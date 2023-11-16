import React from 'react';

import CheckboxComponent from 'src/lib/molecules/Checkbox';
import { args, category } from '../../assets/storybook.globals';
import { checkboxRadioSwitcherConfig } from '../../../src/configs';

const others = { category: category.others };
const states = { category: category.states };
const action = { category: category.action };
const content = { category: category.content };
const appearance = { category: category.appearance };
const validation = { category: category.validation };

export default {
    title: 'Molecules/Checkbox',
    component: CheckboxComponent,
    argTypes: {
        value: args({ control: 'text', ...content }),
        label: args({ control: 'text', ...content }),
        className: args({ control: false, ...others }),
        tabIndex: args({ control: 'number', ...others }),
        checked: args({ control: 'boolean', ...states }),
        required: args({ control: 'boolean', ...states }),
        readOnly: args({ control: 'boolean', ...states }),
        disabled: args({ control: 'boolean', ...states }),
        description: args({ control: 'text', ...content }),
        errorText: args({ control: 'text', ...validation }),
        isValid: args({ control: 'boolean', ...validation }),
        labelTooltip: args({ control: 'boolean', ...states }),
        indeterminate: args({ control: 'boolean', ...states }),
        defaultChecked: args({ control: 'boolean', ...states }),
        onChange: args({ control: false, action: 'onChange', ...action }),
        onKeyPress: args({ control: false, action: 'onKeyPress', ...action }),
        onMouseEnter: args({ control: false, action: 'onMouseEnter', ...action }),
        onMouseLeave: args({ control: false, action: 'onMouseLeave', ...action }),
        onWrapperClick: args({ control: false, action: 'onWrapperClick', ...action }),
        size: args({ control: 'select', options: checkboxRadioSwitcherConfig.size, ...appearance }),
        labelPosition: args({ control: 'select', options: checkboxRadioSwitcherConfig.labelPosition, ...appearance }),
        labelAlignment: args({ control: 'select', options: checkboxRadioSwitcherConfig.labelAlignment, ...appearance })
    },
    args: {
        isValid: true,
        readOnly: false,
        disabled: false,
        required: false,
        labelTooltip: true,
        indeterminate: false,
        defaultChecked: false,
        label: 'Custom label',
        description: 'description'
    }
};

const Template = ({ ...args }) => <CheckboxComponent {...args} />;

export const Checkbox = Template.bind({});
