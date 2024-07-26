import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Divider, { IDividerProps } from './index';

describe('Divider ', () => {
    let setup: ReactWrapper<IDividerProps>;
    beforeEach(() => (setup = mount(<Divider />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
