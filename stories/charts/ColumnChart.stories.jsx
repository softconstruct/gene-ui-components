import React from 'react';

import ColumnChartComponent from 'src/lib/molecules/Charts/ColumnChart';
import { dashStyles, weekDaysList } from './data';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

const data = [80, 1, 120, 220, 80, 130, 60];

export default {
    title: 'Charts/ColumnChart',
    component: ColumnChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        data: args({ control: 'object', ...propCategory.content }),
        color: args({ control: 'string', ...propCategory.appearance }),
        title: args({ control: 'text', ...propCategory.content }),
        width: args({ control: 'text', ...propCategory.appearance }),
        height: args({ control: 'text', ...propCategory.appearance }),
        prefix: args({ control: false, ...propCategory.content }),
        tooltip: args({ control: 'text', ...propCategory.content }),
        dataName: args({ control: 'text', ...propCategory.content }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        withEmptyBG: args({ control: 'boolean', ...propCategory.appearance }),
        categories: args({ control: 'object', ...propCategory.content }),
        plotOptions: args({ control: 'object', ...propCategory.others }),
        gridLineDashStyle: args({ control: false, ...propCategory.appearance }),
        decimalNumberPrecision: args({ control: 'number', ...propCategory.content }),
        max: args({ control: 'number', ...propCategory.content }),
        min: args({ control: 'number', ...propCategory.content }),
        currency: args({ control: 'text', ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    }
};

const Template = ({ ...args }) => {
    return <ColumnChartComponent {...args} />;
};

export const ColumnChart = Template.bind({});
ColumnChart.args = {
    plotOptions: {
        series: {
            animation: {
                duration: 3000,
                easing: 'easeOutBounce'
            }
        }
    },
    gridLineDashStyle: dashStyles[5],
    title: 'Title',
    color: '#01ecc5',
    subtitle: 'Sub title',
    currency: '$',
    categories: weekDaysList,
    dataName: 'Rake',
    min: 0,
    max: 250,
    withEmptyBG: false,
    data: data,
    isLoading: false,
    emptyText: 'No data to display'
};
