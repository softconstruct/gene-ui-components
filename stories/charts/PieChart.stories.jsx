import React from 'react';

import PieChartComponent from 'src/lib/molecules/Charts/PieChart';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

import { pieChartData } from './data';

export default {
    title: 'Charts/PieChart',
    component: PieChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        showLegend: args({ control: 'boolean', ...propCategory.states }),
        customTooltipFormatter: args({ control: false, ...propCategory.action }),
        customLegendFormatter: args({ control: false, ...propCategory.action }),
        decimalNumberPrecision: args({ control: false, ...propCategory.content }),
        data: args({ control: 'object', ...propCategory.content }),
        fixedTooltipContent: args({ control: 'text', ...propCategory.content }),
        legendIsVertical: args({ control: 'boolean', ...propCategory.appearance }),
        seriesProps: args({ control: false, ...propCategory.content }),
        positionerCord: args({ control: false, ...propCategory.appearance }),
        tooltipContent: args({ control: 'text', ...propCategory.content }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        opacity: args({ control: 'number', ...propCategory.appearance }),
        marginRight: args({ control: 'number', ...propCategory.appearance }),
        screenType: args({ control: 'select', ...propCategory.appearance }),
        className: args({ control: false, ...propCategory.others }),
        noActivityText: args({ control: 'text', ...propCategory.content }),
        title: args({ control: 'text', ...propCategory.content }),
        size: args({ control: 'number', ...propCategory.appearance }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
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
