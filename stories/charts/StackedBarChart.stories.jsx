import React from 'react';
import { args, category } from '../assets/storybook.globals';
import StackedBarChart from 'src/lib/molecules/Charts/StackedBarChart';
import { stackedBarDataNegative, stackedBarDataPositive } from './data';

export default {
    title: 'Charts/StackedBar',
    component: StackedBarChart,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        subTitle: args({ control: 'text', category: category.content }),
        background: args({ control: 'boolean', category: category.appearance }),
        showLegend: args({ control: 'boolean', category: category.states }),
        showTooltip: args({ control: 'boolean', category: category.states }),
        showColumnLabel: args({ control: 'boolean', category: category.content }),
        showUnitOnTooltip: args({ control: 'boolean', category: category.appearance }),
        showByPercentage: args({ control: 'boolean', category: category.appearance }),
        categories: args({ control: 'array', category: category.content }),
        data: args({ control: 'object', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
    },
    args: {
        title: 'Title',
        subTitle: 'Sub title',
        background: true,
        showLegend: true,
        showTooltip: true,
        showColumnLabel: true,
        showUnitOnTooltip: true,
        showByPercentage: false,
        categories: Array.from({ length: 5 }, (_, i) => `Action ${++i}`),
        data: stackedBarDataPositive,
        isLoading: false,
        emptyText: 'No data to display'
    }
};
const Template = ({ ...args }) => <StackedBarChart {...args} />;

export let Default = Template.bind({});
export let NegativeData = Template.bind({});
NegativeData.args = {
    subTitle: 'with negative data',
    data: stackedBarDataNegative
};
export let NegativeDataByPercentage = Template.bind({});
NegativeDataByPercentage.args = {
    subTitle: 'with negative data and by percentage',
    data: stackedBarDataNegative,
    showByPercentage: true
};
