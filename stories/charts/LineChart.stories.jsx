import React from 'react';

import LineChartComponent from 'src/lib/molecules/Charts/LineChart';
import { monthsList } from './data';
import { args, category } from '../assets/storybook.globals';

export default {
    title: 'Charts/LineChart',
    component: LineChartComponent,
    argTypes: {
        curved: args({ control: 'boolean', category: category.appearance }),
        tooltip: args({ control: 'text', category: category.content }),
        title: args({ control: 'text', category: category.content }),
        categories: args({ control: 'object', category: category.content }),
        plotOptions: args({ control: false, category: category.others }),
        sharedTooltip: args({ control: 'boolean', category: category.states }),
        subtitle: args({ control: 'text', category: category.content }),
        gridLineDashStyle: args({ control: false, category: category.appearance }),
        series: args({ control: 'object', category: category.content }),
        isLoading: args({ content: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
    }
};

const Template = ({ ...args }) => <LineChartComponent {...args} />;

export const LineChart = Template.bind({});
LineChart.args = {
    curved: true,
    sharedTooltip: true,
    series: [
        {
            color: '#9e90ed',
            fillOpacity: 0.3,
            type: 'areaspline',
            data: [-57, 65, 10, -20, 100, 120],
            name: 'Channel 1'
        },
        {
            color: '#4f96eb',
            data: [30, 18, 33, 60, 80, 40],
            name: 'Channel 2'
        },
        {
            color: '#00c6db',
            data: [40, 21, 4, 16, 50, 70],
            name: 'Channel 3'
        },
        {
            color: '#ff81c0',
            dashStyle: 'shortdot',
            type: 'areaspline',
            fillOpacity: 0.3,
            data: [10, 40, 14, 56, 70, 100],
            name: 'Channel 4'
        }
    ],
    categories: monthsList,
    isLoading: false,
    emptyText: 'No data to display'
};
