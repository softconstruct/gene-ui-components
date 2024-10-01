import React from 'react';

import MapChartComponent from 'src/lib/molecules/Charts/MapChart/index';

import { args, propCategory, SCREENSHOT_DELAY } from '../assets/storybook.globals';
import data from './Map/data';
import testData from './Map/regionData';
import worldMapData from './Map/woldMapData';

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
    parameters: {
        chromatic: { delay: SCREENSHOT_DELAY }
    },
    argTypes: {
        title: args({ control: 'text', ...propCategory.content }),
        selectedData: args({ control: false, ...propCategory.content }),
        viewActivityText: args({ control: 'text', ...propCategory.content }),
        withNavigation: args({ control: 'boolean', ...propCategory.content }),
        withActivity: args({ control: 'boolean', ...propCategory.states }),
        withTooltip: args({ control: 'boolean', ...propCategory.content }),
        withLegend: args({ control: 'boolean', ...propCategory.states }),
        opacity: args({ control: 'number', ...propCategory.appearance }),
        data: args({ control: 'object', ...propCategory.content }),
        mapData: args({ control: 'object', ...propCategory.content }),
        colorAxis: args({ control: 'object', ...propCategory.appearance }),
        series: args({ control: 'object', ...propCategory.content }),
        joinBy: args({ control: false, ...propCategory.others }),
        width: args({ control: 'text', ...propCategory.appearance }),
        height: args({ control: 'number', ...propCategory.appearance }),
        screenType: args({ control: 'select', ...propCategory.appearance }),
        className: args({ control: false, ...propCategory.others }),
        chartData: args({ control: false, ...propCategory.content }),
        fixedTooltipContent: args({ control: 'text', ...propCategory.content }),
        onPointOver: args({ control: false, ...propCategory.action }),
        onPointClick: args({ control: false, ...propCategory.functionality }),
        positionerCord: args({ control: false, ...propCategory.appearance }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content })
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
