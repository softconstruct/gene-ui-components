import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import HelperText, { IHelperTextProps } from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('HelperText ', () => {
    let setup: ReactWrapper<IHelperTextProps>;
    beforeEach(() => (setup = mount(<HelperText />, { wrappingComponent: GeneUIProvider })));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
