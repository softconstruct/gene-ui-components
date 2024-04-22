import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

// Components
import Badge, { IBadgeProps } from './index';

describe('Badge ', () => {
    let setup: ReactWrapper<IBadgeProps>;
    const count = 100;

    beforeEach(() => (setup = mount(<Badge />)));

    it('renders without crashing', () => expect(setup.exists()).toBeTruthy());

    it('renders className prop correctly', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('renders count prop correctly', () => {
        const wrapper = setup.setProps({ count });

        expect(wrapper.contains(count)).toBeTruthy();
    });

    it('renders maxCount prop correctly', () => {
        const maxCount = 99;
        const wrapper = setup.setProps({ count, maxCount });

        expect(wrapper.contains(`${maxCount}+`)).toBeTruthy();
    });

    it('renders children prop correctly', () => {
        const children = <span>test</span>;
        const wrapper = setup.setProps({ children });

        expect(wrapper.contains('test')).toBeTruthy();
    });

    it('renders dot prop correctly', () => {
        const dot = true;
        const wrapper = setup.setProps({ dot, count });

        expect(wrapper.contains(count)).toBeFalsy();
    });

    it.each<IBadgeProps['size']>(['big', 'medium', 'default', 'huge'])('should have %s size', (size) => {
        const wrapper = setup.setProps({ size, count });

        expect(wrapper.props().size).toBe(size);
        expect(wrapper.find('.badge__content').hasClass(`badge__content-${size}`)).toBeTruthy();
    });

    it.each<IBadgeProps['color']>(['danger', 'primary'])('should have %s color', (color) => {
        const wrapper = setup.setProps({ color, count });

        expect(wrapper.props().color).toBe(color);
        expect(wrapper.find('.badge__content').hasClass(`badge__content-${color}`)).toBeTruthy();
    });
});
