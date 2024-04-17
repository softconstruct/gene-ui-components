import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import MapChartD3, { IMapChartD3Props } from '.';
import data from './../../../../../stories/charts/Map/woldMapData';

describe('D3 Map chart', () => {
    let setup: ReactWrapper<IMapChartD3Props>;

    beforeEach(() => {
        setup = mount(<MapChartD3 width={900} height={600} mapData={data} />);
    });

    it('with prop "mapData"', () => {
        const mapData = data;
        const wrapper = setup.setProps({ mapData });
        console.log(expect(wrapper.prop('mapData')));
    });
});
