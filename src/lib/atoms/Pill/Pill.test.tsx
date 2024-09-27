import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { Globe } from '@geneui/icons';

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

    it('renders Icon prop correctly', () => {
        const wrapper = setup.setProps({ Icon: <Globe /> });
        expect(wrapper.find(Globe).exists()).toBeTruthy();
    });

    it('renders withDot prop correctly', () => {
        const wrapper = setup.setProps({ iconAlignment: 'after', withDot: true, text: 'test' });
        expect(wrapper.find('.pill').hasClass('pill_icon_before')).toBeTruthy();
    });

    it('renders isFill prop correctly', () => {
        const wrapper = setup.setProps({ isFill: true });
        expect(wrapper.find('.pill').hasClass('pill_fill')).toBeTruthy();
    });

    it('renders without text prop', () => {
        const wrapper = setup.setProps({ text: '' });
        expect(wrapper.text()).toBeFalsy();
    });

    it.each<IPillProps['size']>(['medium', 'small', 'small_nudge'])(
        'checking a component with a prop size : %p',
        (size) => {
            const wrapper = setup.setProps({ size });
            expect(wrapper.find('.pill').hasClass(`pill_size_${size}`)).toBeTruthy();
        }
    );

    it.each<IPillProps['iconAlignment']>(['after', 'before'])(
        'renders iconAlignment : %p prop correctly ',
        (iconAlignment) => {
            const wrapper = setup.setProps({ iconAlignment, Icon: <Globe />, text: 'test' });
            wrapper.update();
            expect(wrapper.find('.pill').hasClass(`pill_icon_${iconAlignment}`)).toBeTruthy();
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
        expect(wrapper.find('.pill').hasClass(`pill_color_${color}`)).toBeTruthy();
    });
});
