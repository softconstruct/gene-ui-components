import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import data from './../../../../../stories/charts/Map/woldMapData';
import * as d3 from 'd3';

//Components
import MapChartD3 from '.';
import GeneUIProvider from '../../../providers/GeneUIProvider';

//Types
import { IMapChartD3Props } from '.';
import * as jsdom from 'jsdom';

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
        const canvasWrapper = new jsdom.JSDOM('<!doctype html><div><canvas></canvas></div>').window.document.body;
        const d3Canvas = d3.select(canvasWrapper).select('div').node();
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
    //     let jestSpy = jest.spyOn(React, 'useState');
    //     // jestSpy.mockImplementation((init) => [init, setState]);
    //     const wrapper = setup.setProps({ screenType });
    //
    //     // expect(wrapper.find('.charts__map-chart').hasClass(className)).toBeTruthy();
    // });

    // it('handles handleClick', () => {
    //     const wrapper = setup;
    //
    //     wrapper.find('canvas').simulate('handleClick');
    //     expect(handleClick).toHaveBeenCalled();
    // });
});
