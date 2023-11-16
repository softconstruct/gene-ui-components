import React from 'react';

import ColumnRangeChart from 'src/lib/molecules/Charts/ColumnRangeChart';
import { columnRangeData, columnRangeDataFixed } from './data';
import { args, category } from '../assets/storybook.globals';

export default {
    title: 'Charts/ColumnRange',
    component: ColumnRangeChart,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        subTitle: args({ control: 'text', category: category.content }),
        showLegend: args({ control: 'boolean', category: category.states }),
        showTooltip: args({ control: 'boolean', category: category.states }),
        showColumnLabel: args({ control: 'boolean', category: category.content }),
        showUnitOnTooltip: args({ control: 'boolean', category: category.appearance }),
        categories: args({ control: 'array', category: category.content }),
        data: args({ control: 'object', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
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
