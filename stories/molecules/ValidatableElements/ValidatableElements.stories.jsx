import React, { useCallback, useState } from 'react';

import {
    ValidatableNumberInput as ValidatableNumberInputComponent,
    ValidatableDatePicker as ValidatableDatePickerComponent,
    ValidatableTextInput as ValidatableTextInputComponent,
    ValidatableCheckbox as ValidatableCheckboxComponent,
    ValidatableRadio as ValidatableRadioComponent
} from 'src/lib/molecules/ValidatableElements';
import { args, category } from '../../assets/storybook.globals';

const components = {
    ValidatableNumberInput: ValidatableNumberInputComponent,
    ValidatableDatePicker: ValidatableDatePickerComponent,
    ValidatableTextInput: ValidatableTextInputComponent,
    ValidatableCheckbox: ValidatableCheckboxComponent,
    ValidatableRadio: ValidatableRadioComponent
};

export default {
    title: 'Molecules/ValidatableElements',
    component: [
        ValidatableNumberInputComponent,
        ValidatableDatePickerComponent,
        ValidatableTextInputComponent,
        ValidatableCheckboxComponent,
        ValidatableRadioComponent
    ],
    subcomponents: {
        ValidatableNumberInputComponent,
        ValidatableDatePickerComponent,
        ValidatableTextInputComponent,
        ValidatableCheckboxComponent,
        ValidatableRadioComponent
    },
    argTypes: {
        type: args({ control: false, table: { disable: true } }),
        componentType: args({ control: false, table: { disable: true } }),
        required: args({ control: 'boolean', category: category.states })
    }
};

const Template = ({ ...args }) => {
    const [value, setValue] = useState(args.defaultValue || '');

    const handleChange = useCallback((e) => {
        setValue(e.target.value);
        // action('Input change');
    }, []);

    const handleDateChange = useCallback((value) => {
        setValue(value);
        // action('Input change');
    }, []);

    const Comp = components[args.componentType];

    return (
        <Comp
            value={value}
            onChange={args.componentType === 'ValidatableDatePicker' ? handleDateChange : handleChange}
            errorText="Something wrong"
            {...args}
        />
    );
};

const inputArgTypes = {
    className: args({ control: false, category: category.others }),
    placeholder: args({ control: 'text', category: category.content }),
    showErrorIcon: args({ control: 'boolean', category: category.states }),
    showIconOnValid: args({ control: 'boolean', category: category.states }),
    colorOnValid: args({ control: 'boolean', category: category.appearance }),
    showErrorWithTooltip: args({ control: 'boolean', category: category.states }),
    colorBorderOnError: args({ control: 'boolean', category: category.appearance }),
    showClickableTooltipOnError: args({ control: 'boolean', category: category.states })
};

export const TextInput = Template.bind({});
TextInput.args = {
    maxLength: 0,
    minLength: 0,
    className: '',
    isEmail: true,
    required: true,
    showErrorIcon: true,
    colorOnValid: true,
    showIconOnValid: true,
    colorBorderOnError: true,
    placeholder: 'Text field',
    showErrorWithTooltip: true,
    type: 'text',
    componentType: 'ValidatableTextInput',
    showClickableTooltipOnError: true
};
TextInput.argTypes = {
    ...inputArgTypes,
    minLength: args({ control: 'number', category: category.states }),
    maxLength: args({ control: 'number', category: category.states }),
    isEmail: args({ control: 'boolean', category: category.states })
};

export const NumberInput = Template.bind({});
NumberInput.args = {
    placeholder: 'Number field',
    step: 1,
    className: '',
    style: {},
    min: 11,
    max: 1000000,
    showErrorWithTooltip: false,
    required: false,
    colorBorderOnError: true,
    showErrorIcon: true,
    showClickableTooltipOnError: true,
    colorOnValid: true,
    showIconOnValid: true,
    type: 'number',
    componentType: 'ValidatableNumberInput'
};
NumberInput.argTypes = {
    ...inputArgTypes,
    min: args({ control: 'number', category: category.states }),
    max: args({ control: 'number', category: category.states }),
    step: args({ control: 'number', category: category.states }),
    style: args({ control: 'object', category: category.appearance })
};
export const DatePicker = Template.bind({});
DatePicker.args = {
    withRange: true,
    min: '12/May/2019',
    max: '29/May/2020',
    required: true,
    value: [null, null],
    withTime: true,
    showErrorWithTooltip: true,
    format: 'DD/MMM/YYYY',
    type: 'datePicker',
    componentType: 'ValidatableDatePicker'
};
DatePicker.argTypes = {
    max: args({ control: 'text', category: category.states }),
    min: args({ control: 'text', category: category.states }),
    format: args({ control: 'text', category: category.states }),
    value: args({ control: 'object', category: category.content }),
    withTime: args({ control: 'boolean', category: category.states }),
    withRange: args({ control: 'boolean', category: category.states }),
    showErrorWithTooltip: args({ control: 'boolean', category: category.states })
};
export const Checkbox = Template.bind({});
Checkbox.args = {
    label: 'Some label',
    type: 'checkbox',
    componentType: 'ValidatableCheckbox',
    required: false,
    isValid: false
};
Checkbox.argTypes = {
    label: args({ control: 'text', category: category.content }),
    isValid: args({ control: 'boolean', category: category.validation })
};
export const Radio = Template.bind({});
Radio.args = {
    label: 'Some label for radio',
    type: 'radio',
    componentType: 'ValidatableRadio',
    required: false,
    options: [
        { label: 'Label 1', value: 'Value 1' },
        { label: 'Label 2', value: 'Value 2' }
    ]
};
Radio.argTypes = {
    label: args({ control: 'array', category: category.content }),
    options: args({ control: 'array', category: category.content }),
    isValid: args({ control: 'boolean', category: category.validation }),
    onChange: args({ control: false, action: 'onChange', category: category.action })
};
