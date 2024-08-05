import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import Legend, { ILegendProps } from './Legend';
import { legendData, tooltipData } from '../test/data';

describe('Legend', () => {
    let setup: ReactWrapper<ILegendProps>;

    beforeEach(() => {
        setup = mount(<Legend {...legendData} />);
    });

    it('should have style property', () => {
        expect(setup.props().style).toEqual(legendData.style);
    });

    it('should have min property', () => {
        expect(setup.props().min).toEqual(legendData.min);
    });

    it('should have max property', () => {
        expect(setup.props().max).toEqual(legendData.max);
    });

    it('should have currentNumber property', () => {
        expect(setup.props().currentNumber).toEqual(legendData.currentNumber);
    });

    it('should have colorBreakpoints property', () => {
        expect(setup.props().colorBreakpoints).toEqual(legendData.colorBreakpoints);
    });

    it('should have legendThresholds property', () => {
        expect(setup.props().legendThresholds).toEqual(legendData.legendThresholds);
    });

    it('should have legendLayout property', () => {
        expect(setup.props().legendLayout).toEqual(legendData.legendLayout);
    });

    it('should have legendLayout property', () => {
        expect(setup.props().height).toEqual(legendData.height);
    });
});
