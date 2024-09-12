import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import HeatMapChartD3, { IHeatMapChartD3Props } from './HeatMapChartD3';
import { LegendAppearances } from './Legend';
import {
    colorBreakpoints,
    data,
    xAxisCategories,
    yAxisCategories
} from '../../../../../stories/__data__/HeatMapChartD3';

export const title = 'Test title';
export const subTitle = 'Test sub title';
export const emptyText = 'No data to display';

describe('HeatMapChartD3', () => {
    let setup: ReactWrapper<IHeatMapChartD3Props>;

    beforeEach(() => {
        setup = mount(
            <HeatMapChartD3
                data={data}
                xAxisCategories={xAxisCategories}
                yAxisCategories={yAxisCategories}
                title={title}
                subTitle={subTitle}
            />
        );
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders title prop correctly', () => {
        expect(setup.find('.mapTitle').text()).toEqual(title);
    });

    it('renders sub title prop correctly', () => {
        expect(setup.find('.mapSubTitle').text()).toEqual(subTitle);
    });

    it('should have data property', () => {
        expect((setup.props().data?.length ?? 0) > 0).toBeTruthy();
    });

    it('should have colorBreakpoints property', () => {
        setup.setProps({ colorBreakpoints });
        expect(setup.props().colorBreakpoints).toEqual(colorBreakpoints);
    });

    it('should have xAxisCategories property', () => {
        expect(setup.props().xAxisCategories).toEqual(xAxisCategories);
    });

    it('should have yAxisCategories property', () => {
        expect(setup.props().yAxisCategories).toEqual(yAxisCategories);
    });

    it('renders canvas', () => {
        expect(setup.find('.canvas-wrapper').exists()).toBeTruthy();
    });

    it('renders legend vertical', () => {
        setup.setProps({ enabledLegend: true });
        expect(setup.find('.legend').exists()).toBeTruthy();
    });

    it('renders legend horizontally', () => {
        setup.setProps({ enabledLegend: true, legendLayout: LegendAppearances.Horizontal });
        expect(setup.find('.legend-horizontal').exists()).toBeTruthy();
    });

    it('renders legend with correct thresholds', () => {
        const count = 3;
        setup.setProps({ enabledLegend: true, legendThresholds: count });
        const thresholds = setup.find('div.legend > div.yAxis');
        expect(thresholds.childAt(count - 1).exists()).toBeTruthy();
        expect(thresholds.childAt(count).exists()).toBeFalsy();
    });

    it('renders loading correctly', () => {
        setup.setProps({ isLoading: true });
        expect(setup.find('.bc-icon-loader').exists()).toBeTruthy();
    });

    it('renders empty content correctly', () => {
        setup.setProps({ data: undefined, emptyText });
        expect(setup.find('.empty-state-title').text()).toEqual(emptyText);
    });
});
