import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Pill, { IPillProps } from './index';

describe('Pill ', () => {
    let setup: ReactWrapper<IPillProps>;
    beforeEach(() => (setup = mount(<Pill />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
