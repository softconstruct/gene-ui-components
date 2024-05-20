import React, { ReactElement } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import data from './../../../../../stories/charts/Map/woldMapData';

//Components
import MapChartD3 from '.';
import GeneUIProvider from '../../../providers/GeneUIProvider';

//Types
import { IMapChartD3Props } from '.';
import { MapChartFeature } from './MapChartD3';
import { BusyLoader, Empty, Popover } from '../../../../index';

const tooltipRenderer: (activeFeature: MapChartFeature) => ReactElement = (activeFeature) => (
    <div style={{ padding: '7px 14px' }}>{activeFeature.properties.name}</div>
);

const colorAxis = {
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
};

describe('D3 Map chart', () => {
    let setup: ReactWrapper<IMapChartD3Props>;
    const setState = jest.fn();

    let jestSpy = jest.spyOn(React, 'useState');
    jestSpy.mockImplementation((init) => [init, setState]);

    beforeEach(() => {
        setup = mount(<MapChartD3 mapData={data} isLoading={false} />, { wrappingComponent: GeneUIProvider });
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('render with title', () => {
        const title = 'test-data';
        const wrapper = setup.setProps({ title });

        expect(wrapper.find('.chart__title').text()).toEqual(title);
    });

    it('should have mapData prop', () => {
        const mapData = data;
        const wrapper = setup.setProps({ mapData });

        expect(wrapper.props().mapData).toHaveProperty('features');
        expect(wrapper.props().mapData.features.length).toBeGreaterThan(0);
        expect(wrapper.find('.canvas-wrapper').exists()).toBeTruthy();
    });

    it('renders with className props', () => {
        const className = 'testClassName';
        const wrapper = setup.setProps({ className });

        expect(wrapper.find('.charts__map-chart').hasClass(className)).toBeTruthy();
    });

    it('renders with withLegend props', () => {
        const withLegend = true;
        const wrapper = setup.setProps({ withLegend, colorAxis });

        expect(wrapper.find('.chart__legends').exists()).toBeTruthy();
    });

    it('renders with emptyText props', () => {
        const emptyText = 'test empty text';
        const mapData = [];
        const wrapper = setup.setProps({ emptyText, mapData });

        expect(wrapper.find(Empty).exists()).toBeTruthy();
    });

    it('renders with isLoading props', () => {
        const isLoading = true;
        const wrapper = setup.setProps({ isLoading });

        expect(wrapper.find(BusyLoader).exists()).toBeTruthy();
    });

    it('renders with withActivity props', () => {
        const withActivity = true;
        const screenType = 'mobile';
        const wrapper = setup.setProps({ withActivity, screenType });

        expect(wrapper.find('.chart__activity-table').exists()).toBeTruthy();
    });

    it('renders with withNavigation props', () => {
        const withNavigation = true;
        const wrapper = setup.setProps({ withNavigation });
        wrapper.setState('isViewActive', () => false);

        expect(wrapper.find('.actions__box').exists()).toBeTruthy();
    });

    it('renders with selectedData props', () => {
        const selectedData = <span>test selectedData node</span>;
        const withActivity = true;
        const screenType = 'mobile';
        const wrapper = setup.setProps({ selectedData, withActivity, screenType });

        expect(wrapper.find('.chart-activity-body').exists()).toBeTruthy();
    });
});
