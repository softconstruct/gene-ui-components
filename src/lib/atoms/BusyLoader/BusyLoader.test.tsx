import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

// Components
import { Icon } from '../../../index';
import BubbleLoader from './BubbleLoader';
import BusyLoader from './index';

//Types
import { IBusyLoaderProps } from './index';

describe('BusyLoader Component', () => {
    let setup: ReactWrapper<IBusyLoaderProps>;
    beforeEach(() => (setup = mount(<BusyLoader />)));

    it('exists', () => expect(setup.exists()).toBeTruthy());

    it('"className" pass correct', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });

    it('"children" and "isBusy" props pass correct', () => {
        const children = <span>test</span>;
        const wrapper = setup.setProps({ children, isBusy: false });

        expect(wrapper.contains('test')).toBeTruthy();
    });

    it('"loadingText" prop pass correct', () => {
        const loadingText = 'loading text';
        const wrapper = setup.setProps({ loadingText });

        expect(wrapper.contains(loadingText)).toBeTruthy();
    });

    it.each<IBusyLoaderProps['spinnerSize']>(['small', 'medium', 'big'])('%s size passing correct', (spinnerSize) => {
        const wrapper = setup.setProps({ spinnerSize });

        expect(wrapper.props().spinnerSize).toBe(spinnerSize);
        expect(wrapper.find('.bc-icon-loader').hasClass(`s-${spinnerSize}`)).toBeTruthy();
    });

    it.each<IBusyLoaderProps['type']>(['spinner', 'bubbles', 'bar'])('%s type passing correct', (type) => {
        const wrapper = setup.setProps({ type });

        expect(wrapper.props().type).toBe(type);

        if (type === 'bar') {
            expect(wrapper.find('.bar-loader')).toBeTruthy();
        } else if (type === 'spinner') {
            expect(wrapper.find(Icon).exists()).toBeTruthy();
        } else if (type === 'bubbles') {
            expect(wrapper.find(BubbleLoader).exists()).toBeTruthy();
        }
    });
});
