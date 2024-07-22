import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Badge, { IBadgeProps } from './index';

describe('Badge ', () => {
    let setup: ReactWrapper<IBadgeProps>;
    beforeEach(() => (setup = mount(<Badge />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
