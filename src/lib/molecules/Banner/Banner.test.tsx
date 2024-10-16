import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Banner, { IBannerProps } from './index';

const title = 'Title';

describe('Banner ', () => {
    let setup: ReactWrapper<IBannerProps>;
    beforeEach(() => (setup = mount(<Banner title={title} />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders title', () => {
        expect(setup.find('.banner__text').text()).toEqual(title);
    });

    it('renders type informative', () => {
        expect(setup.find('.banner_state_informative').exists()).toBeTruthy();
    });

    it('renders type warning', () => {
        const wrapper = setup.setProps({ type: 'warning' });
        expect(wrapper.find('.banner_state_warning').exists()).toBeTruthy();
    });

    it('renders type error', () => {
        const wrapper = setup.setProps({ type: 'error' });
        expect(wrapper.find('.banner_state_error').exists()).toBeTruthy();
    });

    it('should not be visible', () => {
        const wrapper = setup.setProps({ isVisible: false });
        expect(wrapper.find('.banner').exists()).toBeFalsy();
    });
});
