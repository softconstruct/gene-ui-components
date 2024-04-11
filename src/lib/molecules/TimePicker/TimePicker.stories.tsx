import React, { FC } from 'react';

import TimePickerComponent, { ITimePickerProps } from '../../../../src/lib/molecules/TimePicker/TimePicker';
import { Meta } from '@storybook/react';
import { args, category } from '../../../../stories/assets/storybook.globals';
import { screenTypes, timePickerConfig } from '../../../../src/configs';

const meta: {
    argTypes: {
        minuteFormat: any;
        onChange: any;
        positions: any;
        className: any;
        readOnly: any;
        separator: any;
        hourFormat: any;
        onBlur: any;
        showSeconds: any;
        appearance: any;
        screenType: any;
        disabled: any;
        screenTypes: any;
        secondFormat: any;
        value: any;
    };
    args: {
        showSeconds: boolean;
        minuteFormat: string[];
        appearance: any;
        screenType: any;
        className: string;
        disabled: boolean;
        readOnly: boolean;
        secondFormat: string[];
        separator: string;
        hourFormat: string[];
    };
    component: React.FunctionComponent<ITimePickerProps>;
    title: string;
} = {
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
        minuteFormat: ['mm', 'm'],
        secondFormat: ['ss', 's'],
        screenType: screenTypes[0],
        hourFormat: ['HH', 'H', 'hh', 'h'],
        appearance: timePickerConfig.appearance[1]
    }
};

export default meta;

const Template: FC<ITimePickerProps> = ({ ...args }) => <TimePickerComponent {...args} />;

export const Default = Template.bind({});
export const WithoutSecondsField = Template.bind({});
WithoutSecondsField.args = {
    showSeconds: false
};
