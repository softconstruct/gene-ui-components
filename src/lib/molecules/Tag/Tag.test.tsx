import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Tag, { ITagProps } from './index';

describe('Tag ', () => {
    let setup: ReactWrapper<ITagProps>;
    beforeEach(() => (setup = mount(<Tag />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
