import React, { FocusEvent, MouseEvent } from 'react';
import { ReactWrapper, mount } from 'enzyme';
import * as TestsUtils from 'react-dom/test-utils';
// Components
import TextLink, { ITextLinkProps } from './index';

const act = typeof React.act === 'function' ? React.act : TestsUtils.act;
describe('TextLink', () => {
    let setup: ReactWrapper<ITextLinkProps>;
    const mockFn = jest.fn();
    beforeEach(() => (setup = mount(<TextLink text="test" href={'testHref'} />)));

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders text prop correctly', () => {
        expect(setup.text()).toBe('test');
    });

    it('renders href prop correctly', () => {
        expect(setup.find('a').prop('href')).toBe('testHref');
    });

    it('renders iconBefore prop correctly', async () => {
        const wrapper = setup.setProps({ iconBefore: true });
        expect(wrapper.find('.textLink_iconBefore').exists()).toBeTruthy();
    });

    it('renders underline prop correctly', () => {
        const wrapper = setup.setProps({ underline: true });
        expect(wrapper.find('.textLink_underline').exists()).toBeTruthy();
    });

    it('renders disabled prop correctly', () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find('.textLink_disabled').exists()).toBeTruthy();
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

    it.each<ITextLinkProps['rel']>(['nofollow', 'none'])('checking a component with a prop rel : %p', (rel) => {
        const wrapper = setup.setProps({ rel });
        expect(wrapper.find('.textLink').props().rel).toBe(rel);
    });

    it.each<ITextLinkProps['appearance']>(['inverse', 'secondary', 'primary'])(
        'should have "%s" appearance',
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find(`textLink_color_${appearance}`)).toBeTruthy();
        }
    );
    it.each<ITextLinkProps['target']>(['blank', 'self'])('should have "%s" target', (target) => {
        const wrapper = setup.setProps({ target });
        expect(wrapper.find('.textLink').props().target).toBe(`_${target}`);
    });
});
