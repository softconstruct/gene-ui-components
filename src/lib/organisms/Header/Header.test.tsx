import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Header, { IHeaderProps } from './index';

describe('Header ', () => {
    let setup: ReactWrapper<IHeaderProps>;
    beforeEach(() => (setup = mount(<Header />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
