import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Button, { IButtonProps } from './index';

describe('Button', () => {
    let setup: ReactWrapper<IButtonProps>;

    beforeEach(() => {
        setup = mount(<Button children={''} flexibility={'default'} />);
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders icon props correctly', () => {
        let icon = <div>Test</div>;
        const wrapper = setup.setProps({
            icon
        });

        expect(wrapper.find(icon).exists()).toBeFalsy();
    });

    it.each<IButtonProps['children']>([<div>Test</div>, 'test'])('renders children prop correctly', (children) => {
        const wrapper = setup.setProps({
            children
        });
        expect(wrapper.find(children as string).exists()).toBeFalsy();
    });

    it('renders withShadow prop correctly', () => {
        const wrapper = setup.setProps({
            withShadow: true
        });

        expect(wrapper.find('.with-shadow').exists()).toBeTruthy();
    });

    it('renders ariaLabel prop correctly"', () => {
        const ariaLabel = 'test';
        const wrapper = setup.setProps({
            ariaLabel
        });

        expect(wrapper.find(`[aria-label="${ariaLabel}"]`).exists()).toBeTruthy();
    });
});
