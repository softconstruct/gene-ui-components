import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
import { screenTypes, timePickerConfig } from '../../../../src/configs';

// Component
import TimePicker, { ITimePickerProps } from './';

const meta: Meta<typeof TimePicker> = {
    title: 'Molecules/TimePicker',
    component: TimePicker,
    argTypes: {
        positions: args({
            control: 'select',
            options: ['bottom', 'top', 'left', 'right'],
            category: propCategory.appearance
        }),
        onBlur: args({ control: false, category: propCategory.action }),
        value: args({ control: 'text', category: propCategory.content }),
        onChange: args({ control: false, category: propCategory.action }),
        className: args({ control: false, category: propCategory.others }),
        separator: args({ control: 'text', category: propCategory.content }),
        disabled: args({ control: 'boolean', category: propCategory.states }),
        readOnly: args({ control: 'boolean', category: propCategory.states }),
        showSeconds: args({ control: 'boolean', category: propCategory.states }),
        screenTypes: args({ control: false, options: screenTypes, category: propCategory.states }),
        secondFormat: args({ control: 'select', options: ['ss', 's'], category: propCategory.states }),
        minuteFormat: args({ control: 'select', options: ['mm', 'm'], category: propCategory.states }),
        screenType: args({ control: 'select', options: screenTypes, category: propCategory.appearance }),
        hourFormat: args({ control: 'select', options: ['HH', 'H', 'hh', 'h'], category: propCategory.states }),
        appearance: args({ control: 'select', options: timePickerConfig.appearance, category: propCategory.appearance })
    },
    args: {
        className: '',
        separator: ':',
        disabled: false,
        readOnly: false,
        showSeconds: true,
        minuteFormat: ['mm', 'm'],
        secondFormat: ['ss', 's'],
        screenType: screenTypes[0],
        hourFormat: ['HH', 'H', 'hh', 'h'],
        appearance: timePickerConfig.appearance[1]
    }
};

export default meta;

const Template: FC<ITimePickerProps> = ({ ...args }) => <TimePicker {...args} />;

export const Default = Template.bind({});
export const WithoutSecondsField = Template.bind({});
WithoutSecondsField.args = {
    showSeconds: false
};
