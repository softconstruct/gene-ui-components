import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

//Components
import MapChartD3, { IMapChartD3Props } from '.';
import GeneUIProvider from '../../../providers/GeneUIProvider';
import { BusyLoader, Empty } from '../../../../index';

//Data
// @ts-ignore
import { regionData as data } from '__data__';

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

    beforeEach(() => {
        setup = mount(<MapChartD3 mapData={data} isLoading={false} />, { wrappingComponent: GeneUIProvider });
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('render with title', () => {
        const title = 'test-data';
        const wrapper = setup.setProps({ title });

        expect(wrapper.find('.map-chart__title-wrapper').text()).toEqual(title);
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

        expect(wrapper.find('.map-chart').hasClass(className)).toBeTruthy();
    });

    it('renders with withLegend props', () => {
        const withLegend = true;
        const wrapper = setup.setProps({ withLegend, colorAxis });

        expect(wrapper.find('.map-chart__legends').exists()).toBeTruthy();
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

        expect(wrapper.find('.map-chart__activity-box__mobile').exists()).toBeTruthy();
    });

    it('renders with withNavigation props', () => {
        const withNavigation = true;
        const wrapper = setup.setProps({ withNavigation });

        expect(wrapper.find('.map-chart__actions__box').exists()).toBeTruthy();
    });

    it('renders with viewActivityContent props', () => {
        const viewActivityContent = <span>test viewActivityData node</span>;
        const withActivity = true;
        const screenType = 'mobile';
        const wrapper = setup.setProps({ viewActivityContent, withActivity, screenType });

        expect(wrapper.find('.activity__mobile-content__body').exists()).toBeTruthy();
    });
});
