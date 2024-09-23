import React from 'react';

// Helpers
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

// Components
import StackedBarChart from 'src/lib/molecules/Charts/StackedBarChart';

// Data
import { stackedBarDataNegative, stackedBarDataPositive } from './data';

export default {
    title: 'Charts/StackedBar',
    component: StackedBarChart,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        title: args({ control: 'text', ...propCategory.content }),
        subTitle: args({ control: 'text', ...propCategory.content }),
        background: args({ control: 'boolean', ...propCategory.appearance }),
        showLegend: args({ control: 'boolean', ...propCategory.states }),
        showTooltip: args({ control: 'boolean', ...propCategory.states }),
        showColumnLabel: args({ control: 'boolean', ...propCategory.content }),
        showUnitOnTooltip: args({ control: 'boolean', ...propCategory.appearance }),
        showByPercentage: args({ control: 'boolean', ...propCategory.appearance }),
        categories: args({ control: 'array', ...propCategory.content }),
        data: args({ control: 'object', ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
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
