import React from 'react';

import BarChartComponent from 'src/lib/molecules/Charts/BarChart';
import { dashStyles, monthsList } from './data';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

export default {
    title: 'Charts/BarChart',
    component: BarChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        gridLineDashStyle: args({ control: 'select', options: dashStyles, ...propCategory.appearance }),
        min: args({ control: 'number', ...propCategory.content }),
        max: args({ control: 'number', ...propCategory.content }),
        xAxisRest: args({ control: false, ...propCategory.others }),
        yAxisRest: args({ control: false, ...propCategory.others }),
        title: args({ control: 'text', ...propCategory.content }),
        categories: args({ control: 'object', ...propCategory.content }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        sharedTooltip: args({ control: 'boolean', ...propCategory.states }),
        series: args({ control: 'object', ...propCategory.content }),
        colors: args({ control: 'select', ...propCategory.appearance }),
        plotOptions: args({ control: 'object', ...propCategory.others }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    },
    args: {
        label1: 'Channel 1',
        label2: 'Channel 2',
        label3: 'Channel 3',
        label4: 'Channel 4',
        plotOptions: {
            column: {
                borderWidth: 1
            },
            series: {
                borderRadius: 5,
                animation: {
                    duration: 2500,
                    easing: 'easeOutBounce'
                }
            }
        },
        sharedTooltip: false,
        gridLineDashStyle: dashStyles[5],
        title: 'Title',
        subtitle: 'Sub title',
        categories: monthsList,
        min: 0,
        series: [
            { name: 'Channel 1', data: [75, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4] },
            { name: 'Channel 2', data: [155, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3] },
            { name: 'Channel 3', data: [220, 138.8, 39.3, 41.4, 147.0, 48.3, 59.0, 59.6, 52.4, 165.2, 59.3, 51.2] },
            { name: 'Channel 4', data: [125, 33.2, 34.5, 39.7, 52.6, 75.5, 157.4, 60.4, 47.6, 39.1, 46.8, 51.1] }
        ],
        isLoading: false,
        emptyText: 'No data to display'
    }
};

const Template = ({ ...args }) => {
    return <BarChartComponent {...args} />;
};

export const BarChart = Template.bind({});
