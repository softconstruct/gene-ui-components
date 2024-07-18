import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import SplitButton, { ISplitButtonProps } from './index';

describe('SplitButton ', () => {
    let setup: ReactWrapper<ISplitButtonProps>;
    beforeEach(() => (setup = mount(<SplitButton />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
