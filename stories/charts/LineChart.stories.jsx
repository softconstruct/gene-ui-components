import React from 'react';

import LineChartComponent from 'src/lib/molecules/Charts/LineChart';
import { monthsList } from './data';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

export default {
    title: 'Charts/LineChart',
    component: LineChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        curved: args({ control: 'boolean', ...propCategory.appearance }),
        tooltip: args({ control: 'text', ...propCategory.content }),
        title: args({ control: 'text', ...propCategory.content }),
        categories: args({ control: 'object', ...propCategory.content }),
        plotOptions: args({ control: false, ...propCategory.others }),
        sharedTooltip: args({ control: 'boolean', ...propCategory.states }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        gridLineDashStyle: args({ control: false, ...propCategory.appearance }),
        series: args({ control: 'object', ...propCategory.content }),
        isLoading: args({ content: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
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
