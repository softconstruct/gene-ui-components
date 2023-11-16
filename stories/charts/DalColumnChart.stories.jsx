import React from 'react';

import DalColumnChartComponent from 'src/lib/molecules/Charts/DalColumnChart';
import { dalColumnData, dashStyles, drillDownData } from './data';
import { args, category } from '../assets/storybook.globals';

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
    argTypes: {
        min: args({ control: 'number', category: category.content }),
        max: args({ control: 'number', category: category.content }),
        title: args({ control: 'text', category: category.content }),
        columnData: args({ control: false, category: category.content }),
        lineData: args({ control: 'object', category: category.content }),
        sizes: args({ control: 'object', category: category.appearance }),
        color: args({ control: 'text', category: category.appearance }),
        dataName: args({ control: 'text', category: category.content }),
        categories: args({ control: 'object', category: category.content }),
        subtitle: args({ control: 'text', category: category.content }),
        drilldownTitleXAxis: args({ control: 'text', category: category.content }),
        drilldownTitleYAxis: args({ control: 'text', category: category.content }),
        gridLineDashStyle: args({ control: false, category: category.appearance }),
        resetButtonPosition: args({ control: false, category: category.appearance }),
        drillUpText: args({ control: 'text', category: category.content }),
        drillDown: args({ control: 'object', category: category.others }),
        crosshair: args({ control: false, category: category.appearance }),
        xAxisText: args({ control: 'text', category: category.content }),
        yAxisText: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        tooltip: args({ control: 'text', category: category.content }),
        plotOptions: args({ control: 'object', category: category.others }),
        restProps: args({ control: false, category: category.others }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
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
