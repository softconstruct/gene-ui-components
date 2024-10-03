import React from 'react';

// Helpers
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

// Components
import TreeMapChartComponent from 'src/lib/molecules/Charts/TreeMapChart';

// data
import { points, treeMapChartData } from './treeMapData';

const total = treeMapChartData.reduce((acc, item) => acc + item.value, 0);

const layoutAlgorithms = ['strip', 'stripes', 'squarified', 'sliceAndDice'];

export default {
    title: 'Charts/TreeMapChart',
    component: TreeMapChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        data: args({ control: 'array', ...propCategory.content }),
        title: args({ control: 'text', ...propCategory.content }),
        tooltip: args({ control: 'text', ...propCategory.content }),
        dataName: args({ control: 'text', ...propCategory.content }),
        withLegend: args({ control: 'boolean', ...propCategory.states }),
        categories: args({ control: false, ...propCategory.content }),
        pointWidth: args({ control: false, ...propCategory.content }),
        plotOptions: args({ control: false, ...propCategory.others }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        decimalNumberPrecision: args({ control: false, ...propCategory.content }),
        layoutAlgorithm: args({ control: 'select', options: layoutAlgorithms, ...propCategory.appearance }),
        series: args({ control: false, ...propCategory.content }),
        total: args({ control: 'number', ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    },
    args: {
        title: '',
        subtitle: '',
        isLoading: false,
        emptyText: 'No data to display'
    }
};

const Template = ({ ...args }) => <TreeMapChartComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    total: total,
    data: treeMapChartData
};
export const WithMoreData = Template.bind({});
WithMoreData.args = {
    total: 4,
    data: points
};
