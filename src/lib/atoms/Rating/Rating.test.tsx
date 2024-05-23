import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Rating, { IRatingProps } from './index';

describe('Rating', () => {
    let setup: ReactWrapper<IRatingProps>;
    const jestFn = jest.fn();

    beforeEach(() => {
        setup = mount(<Rating />);
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders count prop correctly', () => {
        const count = 5;
        const wrapper = setup.setProps({ count });
        expect(wrapper.find('.rating__wrapper')).toHaveLength(count);
    });

    it('renders readonly prop correctly', () => {
        const wrapper = setup.setProps({ readonly: true });
        expect(wrapper.find('.rating__wrapper-readonly')).toBeDefined();
    });

    it('renders character prop correctly', () => {
        const character = '+';
        const wrapper = setup.setProps({ character });
        expect(wrapper.find('.rating__wrapper').at(0).text()).toContain(character);
    });

    it('renders size prop correctly', () => {
        const size = 'medium';
        const wrapper = setup.setProps({ size });
        expect(wrapper.find('.rating__wrapper').first().hasClass(`rating__wrapper-${size}`)).toBeTruthy();
    });

    it('renders onChange prop correctly', () => {
        const wrapper = setup.setProps({ onChange: jestFn, value: 3, defaultValue: 3 });
        wrapper.find('.rating__wrapper').first().simulate('click');
        expect(jestFn).toHaveBeenCalledWith(1);
    });

    it('renders bgColor prop correctly', () => {
        const wrapper = setup.setProps({ bgColor: 'blue' });
        expect(wrapper.find('.rating__icon').first().props().style?.color).toBe('blue');
    });

    it('renders color prop correctly', () => {
        const wrapper = setup.setProps({ color: 'blue' });
        expect(wrapper.find('.rating__element').find('.rating__icon').first().props().style?.color).toBe('blue');
    });
});
