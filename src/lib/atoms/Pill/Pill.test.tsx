import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Pill, { IPillProps } from './index';

describe('Pill', () => {
    let setup: ReactWrapper<IPillProps>;
    beforeEach(() => (setup = mount(<Pill />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders text prop correctly', () => {
        const text = 'test';
        const wrapper = setup.setProps({ text });
        expect(wrapper.text()).toBe(text);
    });

    it('renders isIconAfter prop correctly', () => {
        const wrapper = setup.setProps({ isIconAfter: true });
        expect(wrapper.find('.pill_icon_after').exists()).toBeTruthy();
    });

    it('renders isFill prop correctly', () => {
        const wrapper = setup.setProps({ isFill: true });
        expect(wrapper.find('.pill_fill').exists()).toBeTruthy();
    });

    it('renders without text prop', () => {
        const wrapper = setup.setProps({ text: '' });
        expect(wrapper.text()).toBeFalsy();
    });

    it.each<IPillProps['size']>(['medium', 'small', 'small_nudge'])(
        'checking a component with a prop size : %p',
        (size) => {
            const wrapper = setup.setProps({ size });
            expect(wrapper.find(`.pill_size_${size}`).exists()).toBeTruthy();
        }
    );

    it.each<IPillProps['color']>([
        'informative',
        'neutral',
        'error',
        'success',
        'warning',
        'purple',
        'lagoon',
        'magenta',
        'slate',
        'inverse'
    ])('checking a component with a prop color : %p', (color) => {
        const wrapper = setup.setProps({ color });
        expect(wrapper.find(`.pill_color_${color}`).exists()).toBeTruthy();
    });
});
