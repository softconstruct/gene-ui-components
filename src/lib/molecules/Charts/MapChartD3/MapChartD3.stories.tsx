import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, propCategory } from '../../../../../stories/assets/storybook.globals';

// Component
import MapChartD3, { IMapChartD3Props } from './index';

// Data
import { regionData as testData, worldMapData } from '__data__';

const regionData = [
    {
        id: 'AM.ER',
        value: 12
    },
    {
        id: 'AM.TV',
        value: 54
    },
    {
        id: 'AM.SU',
        value: 73
    },
    {
        id: 'AM.SH',
        value: 17
    },
    {
        id: 'AM.GR',
        value: 35
    }
];

const meta: Meta<typeof MapChartD3> = {
    title: 'Charts/MapChartD3',
    component: MapChartD3,
    argTypes: {
        title: args({ control: 'text', ...propCategory.content }),
        viewActivityData: args({ control: false, ...propCategory.content }),
        viewActivityName: args({ control: 'text', ...propCategory.content }),
        withNavigation: args({ control: 'boolean', ...propCategory.functionality }),
        withActivity: args({ control: 'boolean', ...propCategory.states }),
        withTooltip: args({ control: 'boolean', ...propCategory.content }),
        regionData: args({ control: 'object', ...propCategory.content }),
        tooltipRenderer: args({ control: 'text', ...propCategory.content }),
        withLegend: args({ control: 'boolean', ...propCategory.functionality }),
        brightness: args({ control: 'number', ...propCategory.appearance }),
        mapData: args({ control: 'object', ...propCategory.content }),
        colorAxis: args({ control: 'object', ...propCategory.appearance }),
        screenType: args({ control: 'select', ...propCategory.appearance }),
        className: args({ control: false, ...propCategory.others }),
        onPointOver: args({ control: false, ...propCategory.action }),
        onPointClick: args({ control: false, ...propCategory.action }),
        isLoading: args({ control: 'boolean', ...propCategory.states }),
        emptyText: args({ control: 'text', ...propCategory.content }),
        zoomedFeatureId: args({ control: 'string', ...propCategory.appearance }),
        defaultZoomScale: args({ control: 'number', ...propCategory.appearance }),
        defaultTranslateExtent: args({ control: 'object', ...propCategory.appearance }),
        defaultScaleExtent: args({ control: 'object', ...propCategory.appearance })
    },
    args: {
        mapData: testData,
        withNavigation: true,
        withActivity: true,
        withTooltip: true,
        withLegend: true,
        brightness: 0.5,
        viewActivityData: 'This tooltip can contain a table or any module',
        viewActivityName: 'View Activity',
        regionData: regionData,
        colorAxis: {
            dataClasses: [
                {
                    from: 30,
                    to: 50,
                    name: 'Profit',
                    color: '#4CD7E5'
                },
                {
                    from: 50,
                    to: 1000,
                    name: 'Loss',
                    color: '#FFA5C1'
                },
                {
                    from: 10,
                    to: 30,
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
        isLoading: false,
        emptyText: 'No data to display',
        defaultZoomScale: 1,
        defaultScaleExtent: [1, 8],
        defaultTranslateExtent: [0, 0],
        tooltipRenderer: (activeFeature) => <div style={{ padding: '7px 14px' }}>{activeFeature.properties.name}</div>
    }
};

const Template: FC<IMapChartD3Props> = ({ ...args }) => (
    <div style={{ height: '800px' }}>
        <MapChartD3 {...args} />
    </div>
);

export default meta;

export const Default = Template.bind({});

export const WorldMap = Template.bind({});

WorldMap.args = {
    mapData: worldMapData
};
