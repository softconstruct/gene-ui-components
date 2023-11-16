import React from 'react';

import HeatMapChartComponent from 'src/lib/molecules/Charts/HeatMapChart';
import { args, category } from '../assets/storybook.globals';
import { HeatMapChartData, HeadMapChartIndAxesData } from './data';
const tooltipFormatter = (a, b, c) => `<b>${a}</b> gwei on <br><b>${b}</b> at <b>${c}</b>`;
const legendAppearances = {
    vertical: 'vertical',
    horizontal: 'horizontal',
    proximate: 'proximate'
};

export default {
    title: 'Charts/HeatMapChart',
    component: HeatMapChartComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        chartHeight: args({ control: 'text', category: category.appearance }),
        subTitle: args({ control: 'text', category: category.content }),
        enabledLegend: args({ control: 'boolean', category: category.states }),
        data: args({ control: 'object', category: category.content }),
        tooltipFormatter: args({ control: false, category: category.action }),
        legendLayout: args({ control: 'select', options: legendAppearances, category: category.appearance }),
        xAxisCategories: args({ control: 'object', category: category.content }),
        yAxisCategories: args({ control: 'object', category: category.content }),
        yAxisTitle: args({ control: false, category: category.content }),
        yAxisNeedReverse: args({ control: 'boolean', category: category.appearance }),
        legendHeight: args({ control: 'text', category: category.appearance }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
    },
    args: {
        chartHeight: '700px',
        title: 'Title',
        tooltipFormatter: tooltipFormatter,
        subTitle: 'subTitle',
        enabledLegend: true,
        data: HeatMapChartData,
        xAxisCategories: HeadMapChartIndAxesData.XAxisData,
        yAxisCategories: HeadMapChartIndAxesData.YAxisData,
        isLoading: false,
        emptyText: 'No data to display'
    }
};
const Template = ({ ...args }) => <HeatMapChartComponent {...args} />;

export let HeatMapChart = Template.bind({});
