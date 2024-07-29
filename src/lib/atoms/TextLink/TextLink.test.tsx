import React, { FocusEvent, MouseEvent } from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import TextLink, { ITextLinkProps } from './index';

describe('TextLink', () => {
    let setup: ReactWrapper<ITextLinkProps>;
    const mockFn = jest.fn();
    beforeEach(() => (setup = mount(<TextLink children="test" />)));

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders children prop correctly', () => {
        expect(setup.text()).toBe('test');
    });
    it('renders disabled prop correctly', () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find('.textLink_disabled').exists()).toBeTruthy();
    });

    it('renders underline prop correctly', () => {
        const wrapper = setup.setProps({ underline: true });
        expect(wrapper.find('.textLink_underline').exists()).toBeTruthy();
    });

    it('renders onClick prop correctly', () => {
        const wrapper = setup.setProps({ onClick: mockFn });
        const event = {
            currentTarget: {
                innerHTML: 'test'
            }
        } as MouseEvent<HTMLAnchorElement>;
        wrapper.find('a').props().onClick!(event);
        expect(mockFn).toHaveBeenCalledWith(event);
    });
    it('renders onFocus prop correctly', () => {
        const wrapper = setup.setProps({ onFocus: mockFn });
        const event = {
            currentTarget: {
                innerHTML: 'test'
            }
        } as FocusEvent<HTMLAnchorElement>;

        wrapper.find('a').props().onFocus!(event);

        expect(mockFn).toHaveBeenCalledWith(event);
    });

    it.each<ITextLinkProps['rel']>(['nofollow', 'none'])('checking a component with a prop rel : %p', (rel) => {
        const wrapper = setup.setProps({ rel });
        expect(wrapper.find('.textLink').props().rel).toBe(rel);
    });

    it.each<ITextLinkProps['appearance']>(['inverse', 'secondary', 'primary'])(
        'checking a component with a prop appearance : %p',
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find(`textLink_color_${appearance}`)).toBeTruthy();
        }
    );
    it.each<ITextLinkProps['target']>(['blank', 'self'])('checking a component with a prop target : %p', (target) => {
        const wrapper = setup.setProps({ target });
        expect(wrapper.find('.textLink').props().target).toBe(`_${target}`);
    });
});
