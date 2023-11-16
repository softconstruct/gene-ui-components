import React from 'react';

import TimeComponent from 'src/lib/atoms/Time/index';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/Time',
    component: TimeComponent,
    argTypes: {
        showIcon: args({ control: 'boolean', category: category.content }),
        format: args({ control: 'text', category: category.functionality }),
        startDate: args({ control: false, category: category.functionality }),
        showSeconds: args({ control: 'boolean', category: category.functionality })
    },
    args: {
        showIcon: true
    }
};

const Template = ({ ...args }) => <TimeComponent {...args} />;

export const DateAndTime = Template.bind({});
DateAndTime.args = {
    format: 'DD/MM/YYYY HH:mm:ss',
    showSeconds: true
};
DateAndTime.argTypes = {
    showSeconds: args({
        table: {
            disable: true
        }
    })
};
export const TimeWithFormat = Template.bind({});
TimeWithFormat.args = {
    showSeconds: false
};
