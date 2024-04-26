import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import data from './../../../../../stories/charts/Map/woldMapData';

//Components
import GeneUIProvider from '../../../providers/GeneUIProvider';
import MapChartD3 from '.';

//Types
import { IMapChartD3Props } from '.';

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
        setup = mount(<MapChartD3 mapData={data} isLoading={false} />);
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

    // TODO
    // it('renders with screenType props', () => {
    //     const screenType = 'desktop';
    //     const wrapper = setup.setProps({ screenType });
    //
    //     // expect(wrapper.find('.charts__map-chart').hasClass(className)).toBeTruthy();
    // });
});
