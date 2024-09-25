import React from 'react';

import StackedColumnChartComponent from 'src/lib/molecules/Charts/StackedColumnChart';
import { dashStyles, weekDaysFullList } from './data';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

export default {
    title: 'Charts/StackedColumnChart',
    component: StackedColumnChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        data: args({ control: false, ...propCategory.content }),
        title: args({ control: 'text', ...propCategory.content }),
        tooltip: args({ control: 'text', ...propCategory.content }),
        dataName: args({ control: false, ...propCategory.content }),
        withLegend: args({ control: 'boolean', ...propCategory.states }),
        categories: args({ control: 'array', ...propCategory.content }),
        pointWidth: args({ control: 'number', ...propCategory.appearance }),
        plotOptions: args({ control: false, ...propCategory.others }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        opacity: args({ control: 'number', ...propCategory.appearance }),
        series: args({ control: 'array', ...propCategory.content }),
        emptyDataValue: args({ control: 'number', ...propCategory.content }),
        gridLineDashStyle: args({ control: 'text', ...propCategory.appearance }),
        min: args({ control: 'number', ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    }
};

const Template = ({ ...args }) => <StackedColumnChartComponent {...args} />;

export const StackedColumnChart = Template.bind({});
StackedColumnChart.args = {
    title: 'Title',
    subtitle: 'Sub title',
    categories: weekDaysFullList,
    min: 0,
    pointWidth: 30,
    series: [
        {
            data: [5, 3, 4, 7, 2, 1, 3],
            name: 'Third name'
        },
        {
            name: 'Second name',
            data: [2, 2, 3, 2, 1, 3, 4]
        },
        {
            name: 'First name',
            data: [3, 4, 4, 2, 5, 6, 8]
        }
    ],
    gridLineDashStyle: dashStyles[5],
    isLoading: false,
    emptyText: 'No data to display'
};
