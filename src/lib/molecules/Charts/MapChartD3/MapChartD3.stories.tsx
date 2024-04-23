import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, category } from '../../../../../stories/assets/storybook.globals';
import testData from './../../../../../stories/charts/Map/regionData';

// Component
import MapChartD3 from './index';

// Types
import { IMapChartD3Props } from './index';

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
        title: args({ control: 'text', category: category.content }),
        selectedData: args({ control: false, category: category.content }),
        viewActivityText: args({ control: 'text', category: category.content }),
        withNavigation: args({ control: 'boolean', category: category.content }),
        withActivity: args({ control: 'boolean', category: category.states }),
        withTooltip: args({ control: 'boolean', category: category.content }),
        regionData: args({ control: 'object', category: category.content }),
        withLegend: args({ control: 'boolean', category: category.states }),
        brightness: args({ control: 'number', category: category.appearance }),
        mapData: args({ control: 'object', category: category.content }),
        colorAxis: args({ control: 'object', category: category.appearance }),
        width: args({ control: 'number', category: category.appearance }),
        height: args({ control: 'number', category: category.appearance }),
        screenType: args({ control: 'select', category: category.appearance }),
        className: args({ control: false, category: category.others }),
        onPointOver: args({ control: false, category: category.action }),
        onPointClick: args({ control: false, category: category.functionality }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content }),
        zoomedFeatureId: args({ control: 'string', category: category.appearance }),
        defaultZoomScale: args({ control: 'number', category: category.appearance }),
        defaultTranslateExtent: args({ control: 'object', category: category.appearance }),
        defaultScaleExtent: args({ control: 'object', category: category.appearance })
    },
    args: {
        title: '',
        width: 900,
        height: 600,
        mapData: testData,
        withNavigation: true,
        withActivity: true,
        withTooltip: true,
        withLegend: true,
        brightness: 0.5,
        selectedData: 'This tooltip can contain a table or any module',
        viewActivityText: 'View Activity',
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
        zoomedFeatureId: '',
        defaultZoomScale: 1,
        defaultScaleExtent: [1, 8],
        defaultTranslateExtent: [0, 0]
    }
};

const Template: FC<IMapChartD3Props> = ({ ...args }) => (
    <div style={{ height: `${args.height + 200}px` }}>
        <MapChartD3 {...args} />
    </div>
);

export default meta;

export const Default = Template.bind({});
