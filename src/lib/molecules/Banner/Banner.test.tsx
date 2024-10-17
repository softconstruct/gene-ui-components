import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Banner, { IBannerProps } from './index';

const text = 'Title';

describe('Banner ', () => {
    let setup: ReactWrapper<IBannerProps>;
    beforeEach(() => (setup = mount(<Banner text={text} type="informational" />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders text', () => {
        expect(setup.find('.banner__text').text()).toEqual(text);
    });

    it('renders type informational', () => {
        expect(setup.find('.banner_state_informational').exists()).toBeTruthy();
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
        const wrapper = setup.setProps({ visible: false });
        wrapper.update();
        expect(wrapper.find('.banner').exists()).toBeFalsy();
    });
});
