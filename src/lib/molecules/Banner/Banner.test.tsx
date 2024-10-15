import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Banner, { IBannerProps } from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('Banner ', () => {
    let setup: ReactWrapper<IBannerProps>;
    beforeEach(() => (setup = mount(<Banner />, { wrappingComponent: GeneUIProvider })));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
