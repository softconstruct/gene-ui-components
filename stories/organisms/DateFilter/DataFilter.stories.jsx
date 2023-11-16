import React, { useState } from 'react';

import DateFilterComponent from 'src/lib/organisms/DateFilter';
import dayjs from 'dayjs';
import './style.scss';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Organisms/DateFilter',
    component: DateFilterComponent,
    argTypes: {
        value: args({ control: 'text', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        buttonProps: args({ control: false, category: category.others }),
        pickerProps: args({ control: false, category: category.others }),
        format: args({ control: 'text', category: category.functionality }),
        filters: args({ control: false, category: category.functionality })
    }
};

export const Default = ({ ...args }) => {
    const [value, setValue] = useState(() => [dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()]);

    return (
        <div className="dateFilterWrapper">
            <DateFilterComponent {...args} value={value} onChange={setValue} />
        </div>
    );
};

Default.args = {
    format: 'MM/DD/YYYY',
    className: '',
    pickerProps: {
        placeholder: 'MM/DD/YYYY - MM/DD/YYYY'
    }
};

export const FormWithDate = ({ ...args }) => (
    <DateFilterComponent
        required
        filters={{
            today: 'Today',
            yesterday: 'Yesterday',
            thisWeek: 'This Week',
            thisMonth: 'This Month',
            lastMonth: 'Last Month'
        }}
        pickerProps={{
            cornerRadius: 'smooth-radius',
            appearance: 'minimal'
        }}
        {...args}
    />
);
