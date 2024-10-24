import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Text, { ITextProps } from './index';

const content = 'content';

describe('Text ', () => {
    let setup: ReactWrapper<ITextProps>;
    beforeEach(() => (setup = mount(<Text>{content}</Text>)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders className prop correctly', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    // Your tests here
});
