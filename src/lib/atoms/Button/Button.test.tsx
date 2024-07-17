import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Button, { IButtonProps } from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('Button ', () => {
    let setup: ReactWrapper<IButtonProps>;
    beforeEach(() => (setup = mount(<Button />, { wrappingComponent: GeneUIProvider })));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
