import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

// Components
import BusyLoader, { IBusyLoaderProps } from './index';
import Icon from '../Icon';

describe('BusyLoader ', () => {
    let setup: ReactWrapper<IBusyLoaderProps>;
    beforeEach(() => (setup = mount(<BusyLoader />)));

    it('renders without crashing', () => expect(setup.exists()).toBeTruthy());

    it('renders className prop correctly', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('renders children and isBusy prop correctly', () => {
        const children = <span>test</span>;
        const wrapper = setup.setProps({ children, isBusy: false });

        expect(wrapper.contains('test')).toBeTruthy();
    });

    it('renders loadingText prop correctly', () => {
        const loadingText = 'loading text';
        const wrapper = setup.setProps({ loadingText });

        expect(wrapper.contains(loadingText)).toBeTruthy();
    });

    it.each<IBusyLoaderProps['spinnerSize']>(['small', 'medium', 'big'])('should have %s size', (spinnerSize) => {
        const wrapper = setup.setProps({ spinnerSize });

        expect(wrapper.props().spinnerSize).toBe(spinnerSize);
        expect(wrapper.find('.bc-icon-loader').hasClass(`s-${spinnerSize}`)).toBeTruthy();
    });

    it('should have bar type', () => {
        const wrapper = setup.setProps({ type: 'bar' });

        expect(wrapper.find('.bar-loader')).toBeTruthy();
    });

    it('should have spinner type', () => {
        const wrapper = setup.setProps({ type: 'spinner' });

        expect(wrapper.find(Icon).exists()).toBeTruthy();
    });

    it('should have bubbles type', () => {
        const wrapper = setup.setProps({ type: 'bubbles' });

        expect(wrapper.find('.bubble-loader')).toBeTruthy();
    });
});
