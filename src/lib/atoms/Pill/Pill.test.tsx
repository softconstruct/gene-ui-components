import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { Dot } from '@geneui/icons';

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
        const wrapper = setup.setProps({ Icon: <Dot /> });
        expect(wrapper.find(Dot).exists()).toBeTruthy();
    });

    it('renders isIconAfter prop correctly', () => {
        const wrapper = setup.setProps({ isIconAfter: true });
        expect(wrapper.find('.pill').hasClass('pill_icon_after')).toBeTruthy();
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