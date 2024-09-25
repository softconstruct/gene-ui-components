import React from 'react';

// Helpers
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

// Components
import HeatMapChartComponent from 'src/lib/molecules/Charts/HeatMapChart';

// Data
import { HeatMapChartData, HeadMapChartIndAxesData } from './data';

const legendAppearances = {
    vertical: 'vertical',
    horizontal: 'horizontal',
    proximate: 'proximate'
};

const tooltipFormatter = (a, b, c) => `<b>${a}</b> gwei on <br><b>${b}</b> at <b>${c}</b>`;

export default {
    title: 'Charts/HeatMapChart',
    component: HeatMapChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        title: args({ control: 'text', ...propCategory.content }),
        chartHeight: args({ control: 'text', ...propCategory.appearance }),
        subTitle: args({ control: 'text', ...propCategory.content }),
        enabledLegend: args({ control: 'boolean', ...propCategory.states }),
        data: args({ control: 'object', ...propCategory.content }),
        tooltipFormatter: args({ control: false, ...propCategory.action }),
        legendLayout: args({ control: 'select', options: legendAppearances, ...propCategory.appearance }),
        xAxisCategories: args({ control: 'object', ...propCategory.content }),
        yAxisCategories: args({ control: 'object', ...propCategory.content }),
        yAxisTitle: args({ control: false, ...propCategory.content }),
        yAxisNeedReverse: args({ control: 'boolean', ...propCategory.appearance }),
        legendHeight: args({ control: 'text', ...propCategory.appearance }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
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
