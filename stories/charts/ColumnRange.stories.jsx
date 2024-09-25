import React from 'react';

// Helpers
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

// Components
import ColumnRangeChart from 'src/lib/molecules/Charts/ColumnRangeChart';

// Data
import { columnRangeData, columnRangeDataFixed } from './data';

export default {
    title: 'Charts/ColumnRange',
    component: ColumnRangeChart,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        title: args({ control: 'text', ...propCategory.content }),
        subTitle: args({ control: 'text', ...propCategory.content }),
        showLegend: args({ control: 'boolean', ...propCategory.states }),
        showTooltip: args({ control: 'boolean', ...propCategory.states }),
        showColumnLabel: args({ control: 'boolean', ...propCategory.content }),
        showUnitOnTooltip: args({ control: 'boolean', ...propCategory.appearance }),
        categories: args({ control: 'array', ...propCategory.content }),
        data: args({ control: 'object', ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    },
    args: {
        title: 'Column range chart story',
        subTitle: 'Sub title',
        showLegend: true,
        showTooltip: true,
        showColumnLabel: true,
        showUnitOnTooltip: true,
        categories: Array.from({ length: 5 }, (_, i) => `Action ${++i}`),
        data: columnRangeDataFixed,
        isLoading: false,
        emptyText: 'No data to display'
    }
};
const Template = ({ ...args }) => <ColumnRangeChart {...args} />;

export let Default = Template.bind({});
export let IntersectedDataset = Template.bind({});

IntersectedDataset.args = {
    title: 'Column range chart story with intersected dataset',
    data: columnRangeData
};
