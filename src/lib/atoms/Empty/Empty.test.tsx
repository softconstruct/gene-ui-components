import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

//Types
import { IEmptyProps } from './index';

//Components
import Empty from './index';

//helpers
import { sizes } from './utils';

describe('Empty', () => {
    let setup: ReactWrapper<IEmptyProps>;
    beforeEach(() => (setup = mount(<Empty />)));

    it('renders without crashing', () => expect(setup.exists()).toBeTruthy());

    it('renders className prop correctly', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('renders subTitle prop correctly', () => {
        const subTitle = 'subTitle';
        const wrapper = setup.setProps({ subTitle });

        expect(wrapper.contains(subTitle)).toBeTruthy();
    });

    it('renders title prop correctly', () => {
        const title = 'title';
        const wrapper = setup.setProps({ title });

        expect(wrapper.contains(title)).toBeTruthy();
    });

    it('renders withImage prop correctly', () => {
        const wrapper = setup.setProps({ withImage: true });

        expect(wrapper.find('.empty-state-image').exists()).toBeTruthy();
    });

    it.each<IEmptyProps['size']>(sizes)('should have %s size', (size) => {
        const wrapper = setup.setProps({ size });

        expect(wrapper.props().size).toBe(size);
        expect(wrapper.find('.empty-state-holder').hasClass(`s-${size}`)).toBeTruthy();
    });
});
