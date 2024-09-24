import React from 'react';

import DonutChartComponent from 'src/lib/molecules/Charts/DonutChart';
import { donutChartData } from './data';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

export default {
    title: 'Charts/DonutChart',
    component: DonutChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        legend: args({ control: false, ...propCategory.content }),
        tooltipContent: args({ control: 'text', ...propCategory.content }),
        size: args({ control: 'number', ...propCategory.appearance }),
        data: args({ control: 'object', ...propCategory.content }),
        title: args({ control: 'text', ...propCategory.content }),
        dataName: args({ control: 'text', ...propCategory.content }),
        noActivityText: args({ control: false, ...propCategory.content }),
        viewActivityText: args({ control: false, ...propCategory.content }),
        yAxisTitle: args({ control: false, ...propCategory.content }),
        innerSize: args({ control: 'number', ...propCategory.appearance }),
        opacity: args({ control: 'number', ...propCategory.appearance }),
        marginRight: args({ control: 'number', ...propCategory.appearance }),
        className: args({ control: false, ...propCategory.others }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        totalCount: args({ control: 'number', ...propCategory.content }),
        positioner: args({ control: false, ...propCategory.functionality }),
        showLegend: args({ control: 'boolean', ...propCategory.states }),
        isVerticalLegend: args({ control: 'boolean', ...propCategory.appearance }),
        screenType: args({ control: 'select', ...propCategory.appearance }),
        selectedData: args({ control: false, ...propCategory.content }),
        disablePieceClick: args({ control: 'boolean', ...propCategory.states }),
        centerText: args({ control: 'text', ...propCategory.content }),
        isTooltipVisible: args({ control: 'boolean', ...propCategory.appearance }),
        notApplicableSymbol: args({ control: false, ...propCategory.content }),
        decimalNumberPrecision: args({ control: 'number', ...propCategory.content }),
        customNameFormatter: args({ control: false, ...propCategory.functionality }),
        customLegendFormatter: args({ control: false, ...propCategory.functionality }),
        customTooltipFormatter: args({ control: false, ...propCategory.functionality }),
        isPercentUnitOfMeasure: args({ control: 'boolean', ...propCategory.content }),
        fixedTooltipContent: args({ control: 'text', ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    }
};

const Template = ({ ...args }) => {
    return <DonutChartComponent {...args} />;
};

export const DonutChart = Template.bind({});
DonutChart.args = {
    title: 'Title',
    isVerticalLegend: false,
    subtitle: 'Sub title',
    centerText: 'Center text',
    size: 300,
    dataName: 'Channels',
    noActivityText: 'No activity to display',
    viewActivityText: 'View Activity',
    innerSize: 200,
    fixedTooltipContent: 'table of content',
    data: donutChartData,
    isLoading: false,
    emptyText: 'No data to display'
};
