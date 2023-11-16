import React from 'react';

import FunnelChartComponent from 'src/lib/molecules/Charts/FunnelChart';
import { funnelChartData } from './data';
import { args, category } from '../assets/storybook.globals';

export default {
    title: 'Charts/FunnelChart',
    component: FunnelChartComponent,
    argTypes: {
        legend: args({ control: false, category: category.content }),
        tooltip: args({ control: false, category: category.content }),
        title: args({ control: 'text', category: category.content }),
        funnelSizes: args({ control: false, category: category.appearance }),
        subtitle: args({ control: 'text', category: category.content }),
        opacity: args({ control: 'number', category: category.appearance }),
        plotOptions: args({ control: false, category: category.others }),
        data: args({ control: 'object', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
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
