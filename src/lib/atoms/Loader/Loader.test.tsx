import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Loader, { ILoaderProps } from './index';

describe('Loader', () => {
    let setup: ReactWrapper<ILoaderProps>;
    beforeEach(() => (setup = mount(<Loader />)));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders show prop correctly', () => {
        const wrapper = setup.setProps({ show: true });
        expect(wrapper.find('.loader').exists()).toBeTruthy();
    });

    it('renders text prop correctly', () => {
        const text = 'test';
        const wrapper = setup.setProps({ text });
        expect(wrapper.text()).toBe(text);
    });

    it('renders hide loader', () => {
        const wrapper = setup.setProps({ show: false });
        expect(wrapper.find('.loader').exists()).toBeFalsy();
    });

    it.each<ILoaderProps['labelPosition']>(['after', 'below'])('should have %p position', (labelPosition) => {
        const wrapper = setup.setProps({ labelPosition });
        expect(wrapper.find('.loader').hasClass(`loader_direction_${labelPosition}`)).toBeTruthy();
    });

    it.each<ILoaderProps['size']>(['2xLarge', 'xLarge', 'large', 'medium', 'small', 'smallNudge'])(
        'should have %p size',
        (size) => {
            const wrapper = setup.setProps({ size });
            expect(wrapper.find('.loader').hasClass(`loader_size_${size}`)).toBeTruthy();
        }
    );

    it.each<ILoaderProps['appearance']>(['brand', 'neutral', 'inverse'])('should have %p appearance', (appearance) => {
        const wrapper = setup.setProps({ appearance });
        expect(wrapper.find('.loader').hasClass(`loader_color_${appearance}`)).toBeTruthy();
    });
});
