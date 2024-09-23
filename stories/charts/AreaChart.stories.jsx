import React from 'react';

import AreaChartComponent from 'src/lib/molecules/Charts/AreaChart';
import { dashStyles } from './data';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

const categories = ['January', 'February', 'March', 'April', 'May', 'June'];

export default {
    title: 'Charts/AreaChart',
    component: AreaChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        sharedTooltip: args({ control: 'text', ...propCategory.content }),
        tooltip: args({ control: false, ...propCategory.content }),
        screenType: args({ control: 'select', ...propCategory.appearance }),
        plotOptions: args({ control: false, ...propCategory.others }),
        title: args({ control: 'text', ...propCategory.content }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        yAxisTitle: args({ control: 'text', ...propCategory.content }),
        withMarker: args({ control: false, ...propCategory.appearance }),
        showNavigator: args({ control: false, ...propCategory.content }),
        gridLineDashStyle: args({ control: false, ...propCategory.appearance }),
        yCrosshairStyle: args({ control: false, ...propCategory.appearance }),
        xCrosshairStyle: args({ control: false, ...propCategory.appearance }),
        emptyColor: args({ control: 'select', ...propCategory.appearance }),
        series: args({ control: 'object', ...propCategory.content }),
        categories: args({ control: 'object', defaultValue: categories, ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    },
    args: {
        label1: 'Channel 1',
        dashStyle1: dashStyles[0],
        label2: 'Channel 2',
        dashStyle2: dashStyles[0],
        label3: 'Channel 3',
        dashStyle3: dashStyles[0],
        label4: 'Channel 4',
        dashStyle4: dashStyles[0],
        isLoading: false,
        series: [
            { name: 'Channel 1', dashStyle: dashStyles[0], color: '#d987de', data: [60, 20, 70, 10, -30, 0] },
            { name: 'Channel 2', dashStyle: dashStyles[0], color: '#01ecc5', data: [10, 15, 10, 9, 5, -10] },
            { name: 'Channel 3', dashStyle: dashStyles[0], color: '#00c6db', data: [0, 45, 15, 50, 20, 40] },
            { name: 'Channel 4', dashStyle: dashStyles[0], color: '#ff81c0', data: [10, 30, -40, 15, 30, 15] }
        ],
        emptyText: 'No data to display'
    }
};
const Template = ({ ...args }) => {
    return <AreaChartComponent {...args} />;
};

export const AreaChart = Template.bind({});
AreaChart.args = {
    sharedTooltip: true,
    categories
};
