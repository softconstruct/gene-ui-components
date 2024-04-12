import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

// Components
import Badge from './index';

// Types
import { IBadgeProps } from './index';

describe('Badge Component', () => {
    let setup: ReactWrapper<IBadgeProps>;
    const count = 100;

    beforeEach(() => (setup = mount(<Badge />)));

    it('exists', () => expect(setup.exists()).toBeTruthy());

    it('"className" pass correct', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('"count" prop pass correct', () => {
        const wrapper = setup.setProps({ count });

        expect(wrapper.contains(count)).toBeTruthy();
    });

    it('"maxCount" prop pass correct', () => {
        const maxCount = 99;
        const wrapper = setup.setProps({ count, maxCount });

        expect(wrapper.contains(`${maxCount}+`)).toBeTruthy();
    });

    it('"children" prop pass correct', () => {
        const children = <span>test</span>;
        const wrapper = setup.setProps({ children });

        expect(wrapper.contains('test')).toBeTruthy();
    });

    it('"dot" pass correct', () => {
        const dot = true;
        const wrapper = setup.setProps({ dot, count });

        expect(wrapper.contains(count)).toBeFalsy();
    });

    it.each<IBadgeProps['size']>(['big', 'medium', 'default', 'huge'])('%s size passing correct', (size) => {
        const wrapper = setup.setProps({ size, count });

        expect(wrapper.props().size).toBe(size);
        expect(wrapper.find('.badge__content').hasClass(`badge__content-${size}`)).toBeTruthy();
    });

    it.each<IBadgeProps['color']>(['danger', 'primary'])('%s color passing correct', (color) => {
        const wrapper = setup.setProps({ color, count });

        expect(wrapper.props().color).toBe(color);
        expect(wrapper.find('.badge__content').hasClass(`badge__content-${color}`)).toBeTruthy();
    });
});
