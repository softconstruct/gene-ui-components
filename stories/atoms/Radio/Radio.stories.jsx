import React, { useState, useCallback } from 'react';
import RadioComponent from 'src/lib/atoms/Radio/index';
import { checkboxRadioSwitcherConfig } from 'configs';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/Radio',
    component: RadioComponent,
    argTypes: {
        size: args({
            control: 'select',
            defaultValue: checkboxRadioSwitcherConfig.size[0],
            options: checkboxRadioSwitcherConfig.size,
            category: category.appearance
        }),
        label: args({ control: 'text', category: category.content }),
        description: args({ control: 'text', category: category.content }),
        labelPosition: args({
            control: 'select',
            defaultValue: checkboxRadioSwitcherConfig.labelPosition[0],
            options: checkboxRadioSwitcherConfig.labelPosition,
            category: category.appearance
        }),
        labelAlignment: args({
            control: 'select',
            defaultValue: checkboxRadioSwitcherConfig.labelAlignment[0],
            options: checkboxRadioSwitcherConfig.labelAlignment,
            category: category.appearance
        }),
        readOnly: args({ control: 'boolean', category: category.states }),
        disabled: args({ control: 'boolean', category: category.states }),
        required: args({ control: 'boolean', category: category.validation }),
        isValid: args({ control: 'boolean', category: category.validation }),
        errorText: args({ control: 'text', category: category.validation }),
        value: args({ control: false, category: category.content }),
        onChange: args({ control: false, category: category.functionality }),
        checked: args({ control: 'boolean', category: category.states }),
        type: args({ control: 'select', category: category.content }),
        className: args({ control: false, category: category.others }),
        name: args({ control: false, category: category.content })
    }
};

const Template = ({ ...args }) => {
    const [checked, setChecked] = useState(false);
    const handleChange = useCallback(() => {
        setChecked((prev) => !prev);
    }, []);
    return <RadioComponent checked={checked} onChange={handleChange} {...args} />;
};

export const Radio = Template.bind({});
Radio.args = {
    size: checkboxRadioSwitcherConfig.size[0],
    label: 'Label',
    labelPosition: checkboxRadioSwitcherConfig.labelPosition[0],
    labelAlignment: checkboxRadioSwitcherConfig.labelAlignment[0],
    description: '',
    readOnly: false,
    disabled: false,
    required: false,
    isValid: true,
    errorText: 'Error text goes here',
    type: 'tab',
    checked: true
};
