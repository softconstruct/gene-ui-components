import React from 'react';

import ColumnChartComponent from 'src/lib/molecules/Charts/ColumnChart';
import { dashStyles, weekDaysList } from './data';
import { args, category } from '../assets/storybook.globals';

const data = [80, 1, 120, 220, 80, 130, 60];

export default {
    title: 'Charts/ColumnChart',
    component: ColumnChartComponent,
    argTypes: {
        data: args({ control: 'object', category: category.content }),
        color: args({ control: 'string', category: category.appearance }),
        title: args({ control: 'text', category: category.content }),
        width: args({ control: 'text', category: category.appearance }),
        height: args({ control: 'text', category: category.appearance }),
        prefix: args({ control: false, category: category.content }),
        tooltip: args({ control: 'text', category: category.content }),
        dataName: args({ control: 'text', category: category.content }),
        subtitle: args({ control: 'text', category: category.content }),
        withEmptyBG: args({ control: 'boolean', category: category.appearance }),
        categories: args({ control: 'object', category: category.content }),
        plotOptions: args({ control: 'object', category: category.others }),
        gridLineDashStyle: args({ control: false, category: category.appearance }),
        decimalNumberPrecision: args({ control: 'number', category: category.content }),
        max: args({ control: 'number', category: category.content }),
        min: args({ control: 'number', category: category.content }),
        currency: args({ control: 'text', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
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
