import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import Tooltip, { ITooltipProps } from './Tooltip';
import { tooltipData } from '../../../../../../stories/__data__/HeatMapChartD3';

describe('Tooltip', () => {
    let setup: ReactWrapper<ITooltipProps>;

    beforeEach(() => {
        setup = mount(<Tooltip {...tooltipData} />);
    });

    it('should have x property', () => {
        expect(setup.props().x).toEqual(tooltipData.x);
    });

    it('should have y property', () => {
        expect(setup.props().y).toEqual(tooltipData.y);
    });

    it('renders text prop correctly', () => {
        expect(setup.find('.heatMapTooltip').text()).toEqual(tooltipData.text);
    });
});
