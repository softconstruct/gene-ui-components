import React from 'react';

import DonutChartComponent from 'src/lib/molecules/Charts/DonutChart';
import { donutChartData } from './data';
import { args, category } from '../assets/storybook.globals';

export default {
    title: 'Charts/DonutChart',
    component: DonutChartComponent,
    argTypes: {
        legend: args({ control: false, category: category.content }),
        tooltipContent: args({ control: 'text', category: category.content }),
        size: args({ control: 'number', category: category.appearance }),
        data: args({ control: 'object', category: category.content }),
        title: args({ control: 'text', category: category.content }),
        dataName: args({ control: 'text', category: category.content }),
        noActivityText: args({ control: false, category: category.content }),
        viewActivityText: args({ control: false, category: category.content }),
        yAxisTitle: args({ control: false, category: category.content }),
        innerSize: args({ control: 'number', category: category.appearance }),
        opacity: args({ control: 'number', category: category.appearance }),
        marginRight: args({ control: 'number', category: category.appearance }),
        className: args({ control: false, category: category.others }),
        subtitle: args({ control: 'text', category: category.content }),
        totalCount: args({ control: 'number', category: category.content }),
        positioner: args({ control: false, category: category.functionality }),
        showLegend: args({ control: 'boolean', category: category.states }),
        isVerticalLegend: args({ control: 'boolean', category: category.appearance }),
        screenType: args({ control: 'select', category: category.appearance }),
        selectedData: args({ control: false, category: category.content }),
        disablePieceClick: args({ control: 'boolean', category: category.states }),
        centerText: args({ control: 'text', category: category.content }),
        isTooltipVisible: args({ control: 'boolean', category: category.appearance }),
        notApplicableSymbol: args({ control: false, category: category.content }),
        decimalNumberPrecision: args({ control: 'number', category: category.content }),
        customNameFormatter: args({ control: false, category: category.functionality }),
        customLegendFormatter: args({ control: false, category: category.functionality }),
        customTooltipFormatter: args({ control: false, category: category.functionality }),
        isPercentUnitOfMeasure: args({ control: 'boolean', category: category.content }),
        fixedTooltipContent: args({ control: 'text', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
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
