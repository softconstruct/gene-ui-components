import React, { useState } from 'react';

//Helpers
import { args, propCategory } from '../../assets/storybook.globals';

// Components
import DateFilterComponent from 'src/lib/organisms/DateFilter';

// Styles
import './style.scss';

export default {
    title: 'Organisms/DateFilter',
    component: DateFilterComponent,
    argTypes: {
        value: args({ control: 'text', ...propCategory.content }),
        onChange: args({ control: false, ...propCategory.action }),
        className: args({ control: false, ...propCategory.others }),
        buttonProps: args({ control: false, ...propCategory.others }),
        pickerProps: args({ control: false, ...propCategory.others }),
        format: args({ control: 'text', ...propCategory.functionality }),
        filters: args({ control: false, ...propCategory.functionality })
    }
};

export const Default = ({ ...args }) => {
    const [value, setValue] = useState(() => ['2024-09-15T20:00:00.000Z', '2024-09-22T19:59:59.999Z']);

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
