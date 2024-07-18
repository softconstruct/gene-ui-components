import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import TextField, { ITextFieldProps } from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('TextField ', () => {
    let setup: ReactWrapper<ITextFieldProps>;
    beforeEach(() => (setup = mount(<TextField />, { wrappingComponent: GeneUIProvider })));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
