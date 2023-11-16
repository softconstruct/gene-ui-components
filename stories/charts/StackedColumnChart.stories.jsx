import React from 'react';

import StackedColumnChartComponent from 'src/lib/molecules/Charts/StackedColumnChart';
import { dashStyles, weekDaysFullList } from './data';
import { args, category } from '../assets/storybook.globals';

const data = [75, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6];

export default {
    title: 'Charts/StackedColumnChart',
    component: StackedColumnChartComponent,
    argTypes: {
        data: args({ control: false, category: category.content }),
        title: args({ control: 'text', category: category.content }),
        tooltip: args({ control: 'text', category: category.content }),
        dataName: args({ control: false, category: category.content }),
        withLegend: args({ control: 'boolean', category: category.states }),
        categories: args({ control: 'array', category: category.content }),
        pointWidth: args({ control: 'number', category: category.appearance }),
        plotOptions: args({ control: false, category: category.others }),
        subtitle: args({ control: 'text', category: category.content }),
        opacity: args({ control: 'number', category: category.appearance }),
        series: args({ control: 'array', category: category.content }),
        emptyDataValue: args({ control: 'number', category: category.content }),
        gridLineDashStyle: args({ control: 'text', category: category.appearance }),
        min: args({ control: 'number', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
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
