import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import TextLink, { ITextLinkProps } from './index';

describe('TextLink ', () => {
    let setup: ReactWrapper<ITextLinkProps>;
    beforeEach(() => (setup = mount(<TextLink />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    // Your tests here
});
