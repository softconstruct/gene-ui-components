import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Grid, { IGridProps } from './index';

describe('Grid ', () => {
    let setup: ReactWrapper<IGridProps>;
    beforeEach(() => (setup = mount(<Grid />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
