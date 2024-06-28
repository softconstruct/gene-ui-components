import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Label, { ILabelProps } from './index';

describe('Label ', () => {
    let setup: ReactWrapper<ILabelProps>;
    beforeEach(() => (setup = mount(<Label />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
