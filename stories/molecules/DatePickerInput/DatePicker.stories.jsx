import React, { useState } from 'react';

import DatePicker from 'src/lib/molecules/DatePickerInput';
import { inputConfig, popoverConfig } from '../../../src/configs';
import { args, category, componentStage } from '../../assets/storybook.globals';

const { flexibility, appearance: appearances, size, cornerRadius, labelAppearance } = inputConfig;

const action = { category: category.action };
const states = { category: category.states };
const content = { category: category.content };
const appearance = { category: category.appearance };
const validation = { category: category.validation };
const functionality = { category: category.functionality };
const others = { category: category.others };

export default {
    title: 'Molecules/DatePickerInput-d',
    component: DatePicker,
    argTypes: {
        value: args({ control: 'text', ...content }),
        title: args({ control: 'text', ...content }),
        className: args({ control: false, ...others }),
        min: args({ control: 'date', ...functionality }),
        max: args({ control: 'date', ...functionality }),
        disabled: args({ control: 'boolean', ...states }),
        readOnly: args({ control: 'boolean', ...states }),
        placeholder: args({ control: 'text', ...content }),
        format: args({ control: 'text', ...functionality }),
        pickerProps: args({ control: 'object', ...content }),
        isValid: args({ control: 'boolean', ...validation }),
        required: args({ control: 'boolean', ...validation }),
        markedDate: args({ control: 'text', ...functionality }),
        withTime: args({ control: 'boolean', ...functionality }),
        clearable: args({ control: 'boolean', ...functionality }),
        onApply: args({ control: false, action: 'apply', ...action }),
        onBlur: args({ control: false, action: 'onBlur', ...action }),
        withoutPicker: args({ control: 'boolean', ...functionality }),
        frozenDateRange: args({ control: 'object', ...functionality }),
        size: args({ control: 'select', options: size, ...appearance }),
        onFocus: args({ control: false, action: 'onFocus', ...action }),
        onChange: args({ control: false, action: 'onChange', ...action }),
        appearance: args({ control: 'select', options: appearances, ...appearance }),
        flexibility: args({ control: 'select', options: flexibility, ...appearance }),
        cornerRadius: args({ control: 'select', options: cornerRadius, ...appearance }),
        labelAppearance: args({ control: 'select', options: labelAppearance, ...appearance }),
        popoverAlign: args({ control: 'select', options: popoverConfig.align, ...appearance })
    },
    args: {
        format: '',
        size: size[2],
        title: 'title',
        required: false,
        withTime: false,
        disabled: false,
        readOnly: false,
        clearable: true,
        withoutPicker: false,
        placeholder: 'Placeholder',
        appearance: appearances[0],
        flexibility: flexibility[0],
        cornerRadius: cornerRadius[0],
        labelAppearance: labelAppearance[2],
        popoverAlign: popoverConfig.align[7],
        componentStage: {
            type: componentStage.deprecated
        }
    }
};

export const Default = ({ ...args }) => {
    return (
        <>
            <DatePicker value={''} {...args} />
        </>
    );
};

export const WithRange = ({ ...args }) => {
    const [date, setDate] = useState('');

    const handleChange = (value) => {
        setDate(value);
    };
    const range = [null, null];
    return (
        <DatePicker.WithRange
            {...args}
            pickerProps={{ withApply: true, onApply: () => {}, defaultValue: date }}
            value={date}
            onChange={(e) => {
                handleChange(e);
            }}
        />
    );
};

WithRange.args = {
    min: '2021-08-11 18:58:13',
    max: new Date()
};
