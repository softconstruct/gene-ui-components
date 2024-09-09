import React from 'react';

import TimePickerComponent from 'src/lib/molecules/TimePicker';
import { args, category } from '../../assets/storybook.globals';
import { screenTypes, timePickerConfig } from '../../../src/configs';

export default {
    title: 'Molecules/TimePicker',
    component: TimePickerComponent,
    argTypes: {
        positions: args({
            control: 'select',
            options: ['bottom', 'top', 'left', 'right'],
            category: category.appearance
        }),
        onBlur: args({ control: false, category: category.action }),
        value: args({ control: 'text', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        separator: args({ control: 'text', category: category.content }),
        disabled: args({ control: 'boolean', category: category.states }),
        readOnly: args({ control: 'boolean', category: category.states }),
        showSeconds: args({ control: 'boolean', category: category.states }),
        screenTypes: args({ control: false, options: screenTypes, category: category.states }),
        secondFormat: args({ control: 'select', options: ['ss', 's'], category: category.states }),
        minuteFormat: args({ control: 'select', options: ['mm', 'm'], category: category.states }),
        screenType: args({ control: 'select', options: screenTypes, category: category.appearance }),
        hourFormat: args({ control: 'select', options: ['HH', 'H', 'hh', 'h'], category: category.states }),
        appearance: args({ control: 'select', options: timePickerConfig.appearance, category: category.appearance })
    },
    args: {
        className: '',
        separator: ':',
        disabled: false,
        readOnly: false,
        showSeconds: true,
        minuteFormat: 'mm',
        secondFormat: 'ss',
        screenType: screenTypes[0],
        hourFormat: 'HH',
        appearance: timePickerConfig.appearance[1]
    }
};

const Template = ({ ...args }) => <TimePickerComponent {...args} />;

export const Default = Template.bind({});
export const WithoutSecondsField = Template.bind({});
WithoutSecondsField.args = {
    showSeconds: false
};
