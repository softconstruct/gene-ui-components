import React from 'react';

import DalColumnChartComponent from 'src/lib/molecules/Charts/DalColumnChart';
import { dalColumnData, dashStyles, drillDownData } from './data';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

const categories = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

const series = [];

categories.forEach((i) => {
    return series.push({
        tooltip: {
            headerFormat: null,
            pointFormatter: function () {
                return `<div style="font-size: 1.2rem">Hour ${this.name} <br> ${this.y}</div>`;
            }
        },
        id: i,
        data: drillDownData
    });
});

export default {
    title: 'Charts/DalColumnChart',
    component: DalColumnChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        min: args({ control: 'number', ...propCategory.content }),
        max: args({ control: 'number', ...propCategory.content }),
        title: args({ control: 'text', ...propCategory.content }),
        columnData: args({ control: false, ...propCategory.content }),
        lineData: args({ control: 'object', ...propCategory.content }),
        sizes: args({ control: 'object', ...propCategory.appearance }),
        color: args({ control: 'text', ...propCategory.appearance }),
        dataName: args({ control: 'text', ...propCategory.content }),
        categories: args({ control: 'object', ...propCategory.content }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        drilldownTitleXAxis: args({ control: 'text', ...propCategory.content }),
        drilldownTitleYAxis: args({ control: 'text', ...propCategory.content }),
        gridLineDashStyle: args({ control: false, ...propCategory.appearance }),
        resetButtonPosition: args({ control: false, ...propCategory.appearance }),
        drillUpText: args({ control: 'text', ...propCategory.content }),
        drillDown: args({ control: 'object', ...propCategory.others }),
        crosshair: args({ control: false, ...propCategory.appearance }),
        xAxisText: args({ control: 'text', ...propCategory.content }),
        yAxisText: args({ control: 'text', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        tooltip: args({ control: 'text', ...propCategory.content }),
        plotOptions: args({ control: 'object', ...propCategory.others }),
        restProps: args({ control: false, ...propCategory.others }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    }
};

const Template = ({ ...args }) => {
    return <DalColumnChartComponent {...args} />;
};

export const DalColumnChart = Template.bind({});
DalColumnChart.args = {
    plotOptions: {
        series: {
            borderRadius: 5,
            animation: {
                duration: 3000,
                easing: 'easeOutBounce'
            }
        }
    },
    gridLineDashStyle: dashStyles[5],
    title: 'Dual axes line and column Chart',
    subtitle: '',
    categories: categories,
    min: 0,
    max: 200,
    lineData: [87, 55, 100, 110, 110, 110, 120],
    columnData: dalColumnData,
    drillDown: {
        series: series
    },
    isLoading: false,
    emptyText: 'No data to display'
};
