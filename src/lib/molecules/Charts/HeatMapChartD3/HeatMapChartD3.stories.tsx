import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, category } from '../../../../../stories/assets/storybook.globals';

// Components
import HeatMapChartD3 from './HeatMapChartD3';

// Types
import { IHeatMapChartD3Props } from './HeatMapChartD3';

// Data
import { ColorBreakpoints, HeadMapChartIndAxesData, HeatMapChartData } from '../../../../../stories/charts/data';

const tooltipFormatter = (a, b, c) => `<b>${a}</b> gwei on <br><b>${b}</b> at <b>${c}</b>`;

const legendAppearances = {
    vertical: 'vertical',
    horizontal: 'horizontal'
};

const meta: Meta<typeof HeatMapChartD3> = {
    title: 'Charts/HeatMapChartD3',
    component: HeatMapChartD3,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        chartHeight: args({ control: 'text', category: category.appearance }),
        subTitle: args({ control: 'text', category: category.content }),
        enabledLegend: args({ control: 'boolean', category: category.states }),
        data: args({ control: 'object', category: category.content }),
        colorBreakpoints: args({ control: 'object', category: category.appearance }),
        legendThresholds: args({ control: 'number', category: category.appearance }),
        tooltipFormatter: args({ control: false, category: category.action }),
        legendLayout: args({ control: 'select', options: legendAppearances, category: category.appearance }),
        xAxisCategories: args({ control: 'object', category: category.content }),
        yAxisCategories: args({ control: 'object', category: category.content }),
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
        colorBreakpoints: ColorBreakpoints,
        isLoading: false,
        legendThresholds: 5,
        emptyText: 'No data to display'
    }
};

export default meta;

const Template: FC<IHeatMapChartD3Props> = (args) => <HeatMapChartD3 {...args} />;

export const Default = Template.bind({});
