import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Avatar, { IAvatarProps } from './index';

describe('Avatar ', () => {
    let setup: ReactWrapper<IAvatarProps>;
    beforeEach(() => (setup = mount(<Avatar />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
