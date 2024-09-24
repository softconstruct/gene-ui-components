import React from 'react';

import FunnelChartComponent from 'src/lib/molecules/Charts/FunnelChart';
import { funnelChartData } from './data';
import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';

export default {
    title: 'Charts/FunnelChart',
    component: FunnelChartComponent,
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        legend: args({ control: false, ...propCategory.content }),
        tooltip: args({ control: false, ...propCategory.content }),
        title: args({ control: 'text', ...propCategory.content }),
        funnelSizes: args({ control: false, ...propCategory.appearance }),
        subtitle: args({ control: 'text', ...propCategory.content }),
        opacity: args({ control: 'number', ...propCategory.appearance }),
        plotOptions: args({ control: false, ...propCategory.others }),
        data: args({ control: 'object', ...propCategory.content }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
    }
};

const Template = ({ ...args }) => {
    return (
        <div
            style={{
                width: '100rem'
            }}
        >
            <FunnelChartComponent {...args} />
        </div>
    );
};

export const FunnelChart = Template.bind({});
FunnelChart.args = {
    title: 'Title',
    subtitle: 'Sub title',
    data: funnelChartData,
    isLoading: false,
    emptyText: 'No data to display'
};
