import React from 'react';
import { args, category } from '../../assets/storybook.globals';
import DatePickerComponent from '../../../src/lib/organisms/DatePicker';
import Toaster from '../../../src/lib/organisms/Toaster';
import dayjs from 'dayjs';

export default {
    title: 'Organisms/DatePickers',
    component: DatePickerComponent,
    subcomponents: {},
    argTypes: {
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        todayText: args({ control: 'text', category: category.content }),
        max: args({ control: 'date', category: category.functionality }),
        min: args({ control: 'date', category: category.functionality }),
        defaultValue: args({ control: 'date', category: category.states }),
        defaultPreview: args({ control: 'date', category: category.states }),
        markedDate: args({ control: 'date', category: category.functionality }),
        customOption: args({ control: 'text', category: category.functionality })
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
                defaultValue={dayjs().add(3, 'day')}
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
                onApply={(date) => {
                    toasterNotify(date);
                }}
            />
            <Toaster />
        </>
    );
};
