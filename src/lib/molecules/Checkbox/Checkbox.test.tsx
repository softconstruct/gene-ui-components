import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Checkbox, { ICheckboxProps } from './index';

describe('Checkbox ', () => {
    let setup: ReactWrapper<ICheckboxProps>;
    beforeEach(() => (setup = mount(<Checkbox />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
