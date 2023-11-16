import React from 'react';

import PieChartComponent from 'src/lib/molecules/Charts/PieChart';
import { args, category } from '../assets/storybook.globals';

import { pieChartData } from './data';

export default {
    title: 'Charts/PieChart',
    component: PieChartComponent,
    argTypes: {
        showLegend: args({ control: 'boolean', category: category.states }),
        customTooltipFormatter: args({ control: false, category: category.action }),
        customLegendFormatter: args({ control: false, category: category.action }),
        decimalNumberPrecision: args({ control: false, category: category.content }),
        data: args({ control: 'object', category: category.content }),
        fixedTooltipContent: args({ control: 'text', category: category.content }),
        legendIsVertical: args({ control: 'boolean', category: category.appearance }),
        seriesProps: args({ control: false, category: category.content }),
        positionerCord: args({ control: false, category: category.appearance }),
        tooltipContent: args({ control: 'text', category: category.content }),
        subtitle: args({ control: 'text', category: category.content }),
        opacity: args({ control: 'number', category: category.appearance }),
        marginRight: args({ control: 'number', category: category.appearance }),
        screenType: args({ control: 'select', category: category.appearance }),
        className: args({ control: false, category: category.others }),
        noActivityText: args({ control: 'text', category: category.content }),
        title: args({ control: 'text', category: category.content }),
        size: args({ control: 'number', category: category.appearance }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
    }
};

const Template = ({ ...args }) => <PieChartComponent {...args} />;

export const PieChart = Template.bind({});
PieChart.args = {
    title: 'Title',
    subtitle: 'Sub title',
    noActivityText: 'No activity to display',
    size: 300,
    data: pieChartData,
    fixedTooltipContent: '',
    isLoading: false,
    emptyText: 'No data to display'
};
