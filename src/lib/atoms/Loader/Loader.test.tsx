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

    it('renders isLoading prop correctly', () => {
        const wrapper = setup.setProps({ isLoading: true });
        expect(wrapper.find('.loader').exists()).toBeTruthy();
    });

    it('renders text prop correctly', () => {
        const text = 'test';
        const wrapper = setup.setProps({ text });
        expect(wrapper.text()).toBe(text);
    });

    it('renders hide loader', () => {
        const wrapper = setup.setProps({ isLoading: false });
        expect(wrapper.find('.loader').exists()).toBeFalsy();
    });

    it.each<ILoaderProps['textPosition']>(['after', 'below'])('should have %p position', (textPosition) => {
        const wrapper = setup.setProps({ textPosition });
        expect(wrapper.find('.loader').hasClass(`loader_direction_${textPosition}`)).toBeTruthy();
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

    it('renders children and isBusy prop correctly', () => {
        const children = <span>test</span>;
        const wrapper = setup.setProps({ children, isLoading: false });

        expect(wrapper.contains('test')).toBeTruthy();
    });
});
