import React from 'react';
import { ReactWrapper, ShallowWrapper, mount, shallow } from 'enzyme';
import Button, { IButtonProps } from './index';

describe('Button Component', () => {
    type WrapperType<T> = (prop?: Partial<IButtonProps>, isShallow?: boolean) => T;
    type GetType<T extends keyof IButtonProps> = Pick<IButtonProps, T>[T];
    let setup: WrapperType<ShallowWrapper | ReactWrapper>;

    beforeEach(() => {
        setup = (props, isShallow = false) => {
            let button = <Button {...props} />;
            return isShallow ? shallow(button) : mount(button);
        };
    });

    it('checking if a component exists', () => {
        const wrapper = setup();
        expect(wrapper.exists()).toBeTruthy();
    });

    it('check conditional rendering', () => {
        const wrapper = setup({
            loading: true
        });
        expect(wrapper.find('.btn-loader-holder').exists()).toBeTruthy();
    });

    it('check with "icon" props', () => {
        let icon = <div>Test</div>;
        const wrapper = setup({
            icon
        });

        expect(wrapper.find(icon).exists()).toBeFalsy();
    });

    it.each<GetType<'children'>>([<div>Test</div>, 'test'])('check with children  props', (children) => {
        const wrapper = setup({
            children
        });

        expect(wrapper.find(children as string).exists()).toBeFalsy();
    });

    it('check with conditional class', () => {
        const wrapper = setup({
            withShadow: true
        });

        expect(wrapper.find('.with-shadow').exists()).toBeTruthy();
    });

    it('check with prop "ariaLabel"', () => {
        const ariaLabel = 'test';
        const wrapper = setup({
            ariaLabel
        });

        expect(wrapper.find(`[aria-label="${ariaLabel}"]`).exists()).toBeTruthy();
    });
});
