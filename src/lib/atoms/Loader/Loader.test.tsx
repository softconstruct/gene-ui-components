import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Loader, { ILoaderProps } from './index';

describe('Loader ', () => {
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

    it.each<ILoaderProps['textDirection']>(['horizontal', 'vertical'])('should have %p direction', (textDirection) => {
        const wrapper = setup.setProps({ textDirection });
        expect(wrapper.find(`.loader_direction_${textDirection}`).exists()).toBeTruthy();
    });
});
