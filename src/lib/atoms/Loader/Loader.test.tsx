import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Loader, { ILoaderProps } from './index';

describe('Loader ', () => {
    let setup: ReactWrapper<ILoaderProps>;
    beforeEach(() => (setup = mount(<Loader />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
