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
        positions: args({ control: 'select', ...propCategory.appearance }),
        onBlur: args({ control: false, ...propCategory.action }),
        value: args({ control: 'text', ...propCategory.content }),
        onChange: args({ control: false, ...propCategory.action }),
        className: args({ control: false, ...propCategory.others }),
        separator: args({ control: 'text', ...propCategory.content }),
        disabled: args({ control: 'boolean', ...propCategory.states }),
        readOnly: args({ control: 'boolean', ...propCategory.states }),
        showSeconds: args({ control: 'boolean', ...propCategory.states }),
        screenTypes: args({ control: false, ...propCategory.states }),
        secondFormat: args({ control: 'select', ...propCategory.states }),
        minuteFormat: args({ control: 'select', ...propCategory.states }),
        screenType: args({ control: 'select', ...propCategory.appearance }),
        hourFormat: args({ control: 'select', ...propCategory.states }),
        appearance: args({ control: 'select', ...propCategory.appearance })
    },
    args: {
        positions: ['bottom', 'top', 'left', 'right'],
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
    } as ITimePickerProps
};

export default meta;

const Template: FC<ITimePickerProps> = ({ ...args }) => <TimePicker {...args} />;

export const Default = Template.bind({});
export const WithoutSecondsField = Template.bind({});
WithoutSecondsField.args = {
    showSeconds: false
};
