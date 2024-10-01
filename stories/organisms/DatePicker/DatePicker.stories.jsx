import React from 'react';
import dayjs from 'dayjs';

// Helpers
import { args, propCategory } from '../../assets/storybook.globals';

//Components
import DatePickerComponent from '../../../src/lib/organisms/DatePicker';
import Toaster from '../../../src/lib/organisms/Toaster';

export default {
    title: 'Organisms/DatePickers',
    component: DatePickerComponent,
    subcomponents: {},
    argTypes: {
        onChange: args({ control: false, ...propCategory.action }),
        className: args({ control: false, ...propCategory.others }),
        todayText: args({ control: 'text', ...propCategory.content }),
        max: args({ control: 'date', ...propCategory.functionality }),
        min: args({ control: 'date', ...propCategory.functionality }),
        defaultValue: args({ control: 'date', ...propCategory.states }),
        defaultPreview: args({ control: 'date', ...propCategory.states }),
        markedDate: args({ control: 'date', ...propCategory.functionality }),
        customOption: args({ control: 'text', ...propCategory.functionality })
    },
    args: {
        todayText: 'todayText'
    }
};
const toasterNotify = (dates) =>
    Toaster.success({
        title: 'Selected Date',
        message: `${dayjs(dates[0]).format('DD/MM/YYYY')} - ${dayjs(dates[1]).format('DD/MM/YYYY')}`
    });

export const Default = (args) => {
    return (
        <>
            <DatePickerComponent
                value={'2024-09-19T10:43:18.503Z'}
                markedDate={'2024-09-19T10:43:18.503Z'}
                {...args}
                onChange={(date) => {
                    args.onChange(date);
                    Toaster.success({
                        title: 'Selected Date',
                        message: dayjs(date).format('DD/MM/YYYY')
                    });
                }}
            />
            <Toaster />
        </>
    );
};

export const WeekPicker = (args) => {
    return (
        <>
            <DatePickerComponent.WeekPicker
                {...args}
                markedDate={'2024-09-19T10:43:18.503Z'}
                onChange={(date) => {
                    toasterNotify(date);
                    args.onChange(date);
                }}
            />
            <Toaster />
        </>
    );
};

export const MonthPicker = (args) => {
    return (
        <>
            <DatePickerComponent.MonthPicker
                {...args}
                onChange={(date) => {
                    args.onChange(date);
                    toasterNotify(date);
                }}
                max={new Date()}
                min={'Feb 27 2023'}
            />
            <Toaster />
        </>
    );
};
export const RangePicker = (args) => {
    return (
        <>
            <DatePickerComponent.RangePicker
                {...args}
                markedDate={'2024-09-19T10:43:18.503Z'}
                value={['2024-09-17T20:00:00.000Z', '2024-09-20T19:59:59.999Z']}
                onApply={(date) => {
                    toasterNotify(date);
                }}
            />
            <Toaster />
        </>
    );
};
