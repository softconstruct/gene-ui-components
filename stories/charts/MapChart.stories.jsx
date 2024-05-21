import React from 'react';

import MapChartComponent from 'src/lib/molecules/Charts/MapChart/index';

import { args, category } from '../assets/storybook.globals';
import { testData as data, regionData as testData, worldMapData } from '__data__';

const regionData = [
    ['am-er', 12],
    ['am-tv', 54],
    ['am-su', 73],
    ['am-sh', 17],
    ['am-gr', 35]
];
export default {
    title: 'Charts/MapChart',
    component: MapChartComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        selectedData: args({ control: false, category: category.content }),
        viewActivityText: args({ control: 'text', category: category.content }),
        withNavigation: args({ control: 'boolean', category: category.content }),
        withActivity: args({ control: 'boolean', category: category.states }),
        withTooltip: args({ control: 'boolean', category: category.content }),
        withLegend: args({ control: 'boolean', category: category.states }),
        opacity: args({ control: 'number', category: category.appearance }),
        data: args({ control: 'object', category: category.content }),
        mapData: args({ control: 'object', category: category.content }),
        colorAxis: args({ control: 'object', category: category.appearance }),
        series: args({ control: 'object', category: category.content }),
        joinBy: args({ control: false, category: category.others }),
        width: args({ control: 'text', category: category.appearance }),
        height: args({ control: 'number', category: category.appearance }),
        screenType: args({ control: 'select', category: category.appearance }),
        className: args({ control: false, category: category.others }),
        chartData: args({ control: false, category: category.content }),
        fixedTooltipContent: args({ control: 'text', category: category.content }),
        onPointOver: args({ control: false, category: category.action }),
        onPointClick: args({ control: false, category: category.functionality }),
        positionerCord: args({ control: false, category: category.appearance }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
    },
    args: {
        title: 'Title',
        data: data,
        mapData: worldMapData,
        // endAdornment: '',
        // description: '',
        // isDropdown: false,
        withNavigation: true,
        withActivity: true,
        withTooltip: true,
        withLegend: true,
        opacity: 0.05,
        selectedData: 'This tooltip can contain a table or any module',
        viewActivityText: 'View Activity',
        joinBy: ['iso-a3', 'code'],
        colorAxis: {
            dataClasses: [
                {
                    to: 50,
                    from: 30,
                    name: 'Profit',
                    color: '#4CD7E5'
                },
                {
                    to: 1000,
                    from: 50,
                    name: 'Loss',
                    color: '#FFA5C1'
                },
                {
                    to: 30,
                    from: 10,
                    name: 'Even',
                    color: '#FFE272'
                },
                {
                    from: 0,
                    to: 10,
                    name: 'No Activity',
                    color: '#ebebeb'
                }
            ]
        },
        series: [
            {
                data: regionData,
                mapData: testData,
                borderColor: '#acd7ec',
                borderWidth: 0.5,
                states: {
                    hover: {
                        brightness: 0.5
                    }
                }
            }
        ],
        isLoading: false,
        emptyText: 'No data to display'
    }
};
const Template = ({ ...args }) => <MapChartComponent {...args} />;

export let MapChart = Template.bind({});
