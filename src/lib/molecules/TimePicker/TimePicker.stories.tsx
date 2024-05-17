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
        className: args({ control: false, ...propCategory.appearance }),
        separator: args({ control: 'text', ...propCategory.appearance }),
        disabled: args({ control: 'boolean', ...propCategory.states }),
        readOnly: args({ control: 'boolean', ...propCategory.states }),
        showSeconds: args({ control: 'boolean', ...propCategory.appearance }),
        screenTypes: args({ control: false, ...propCategory.appearance }),
        secondFormat: args({ control: 'select', ...propCategory.appearance }),
        minuteFormat: args({ control: 'select', ...propCategory.appearance }),
        screenType: args({ control: 'select', ...propCategory.appearance }),
        hourFormat: args({ control: 'select', ...propCategory.appearance }),
        appearance: args({ control: 'select', ...propCategory.appearance })
    },
    args: {
        positions: ['bottom', 'top', 'left', 'right'],
        className: '',
        separator: ':',
        disabled: false,
        readOnly: false,
        showSeconds: true,
        minuteFormat: 'mm',
        secondFormat: 'ss',
        screenType: screenTypes[0],
        hourFormat: 'hh',
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
