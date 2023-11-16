import React from 'react';

import ScatterChartComponent from 'src/lib/molecules/Charts/ScatterChart';
import { args, category } from '../assets/storybook.globals';

const data = [
    51.6, 59.0, 49.2, 63.0, 53.6, 59.0, 47.6, 69.8, 66.8, 75.2, 55.2, 54.2, 62.5, 42.0, 50.0, 49.8, 49.2, 73.2, 47.8,
    68.8, 50.6, 82.5, 57.2, 87.8, 72.8, 54.5, 59.8, 67.3, 67.8, 47.0, 46.2, 55.0, 83.0, 54.4, 45.8, 53.6, 73.2, 52.1,
    67.9, 56.6, 62.3, 58.5, 54.5, 50.2, 60.3, 58.3, 56.2, 50.2, 72.9, 59.8, 61.0, 69.1, 55.9, 46.5, 54.3, 54.8, 60.7,
    60.0, 62.0, 60.3, 52.7, 74.3, 62.0, 73.1, 80.0, 54.7, 53.2, 75.7, 61.1, 55.7, 48.7, 52.3, 50.0, 59.3, 62.5, 55.7,
    54.8, 45.9, 70.6, 67.2, 69.4, 58.2, 59.8, 49.0, 63.4, 58.2, 48.6, 57.8, 53.6, 73.2, 56.2, 70.6, 56.6, 105, 47.6,
    63.0, 50.2, 60.2, 62.0, 49.2, 58.0, 59.8, 46.4, 64.4, 57.8, 54.6, 64.5, 51.8, 59.5, 56.8, 55.0, 55.9
];

const zoomType = ['x', 'y', 'xy'];

export default {
    title: 'Charts/ScatterChart',
    component: ScatterChartComponent,
    argTypes: {
        label: args({ control: 'text', category: category.content }),
        showValue: args({ control: 'boolean', category: category.states }),
        tooltip: args({ control: 'text', category: category.content }),
        zoomType: args({ control: 'select', options: zoomType, category: category.appearance }),
        data: args({ control: 'object', category: category.content }),
        color: args({ control: 'text', category: category.appearance }),
        name: args({ control: 'text', category: category.content }),
        yAxisText: args({ control: 'text', category: category.content }),
        xAxisText: args({ control: 'text', category: category.content }),
        title: args({ control: 'text', category: category.content }),
        subtitle: args({ control: 'text', category: category.content }),
        gridLineDashStyle: args({ control: false, category: category.appearance }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
    }
};

const Template = ({ ...args }) => <ScatterChartComponent {...args} />;

export const ScatterChart = Template.bind({});
ScatterChart.args = {
    data,
    color: '#4f96eb',
    name: 'Client ID',
    label: 'Count of Players',
    isLoading: false,
    emptyText: 'No data to display'
};
