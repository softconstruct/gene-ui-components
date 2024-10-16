import React, { MouseEvent } from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { Square } from '@geneui/icons'; // TODO: replace with the person icon

// Components
import Avatar, { IAvatarProps } from './index';

describe('Avatar ', () => {
    let setup: ReactWrapper<IAvatarProps>;
    beforeEach(() => (setup = mount(<Avatar />)));
    const mockFn = jest.fn();

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders fullName prop correctly', () => {
        const wrapperLarge = setup.setProps({ fullName: 'test data', size: 'large' });
        expect(wrapperLarge.text()).toBe('t d');
        setup.update();
        const wrapperSmall = setup.setProps({ fullName: 'test data', size: 'small' });
        expect(wrapperSmall.text()).toBe('t');
    });

    it('renders src prop correctly', () => {
        const src = 'test';
        const wrapper = setup.setProps({ src });

        expect(wrapper.find('img').props().src).toBe(src);
    });

    it('renders isDisabled prop correctly', () => {
        const wrapper = setup.setProps({ isDisabled: true });

        expect(wrapper.find('.avatar').hasClass('avatar_disabled')).toBeTruthy();
    });

    it('renders isLoading prop correctly', () => {
        const wrapper = setup.setProps({ isLoading: true });

        expect(wrapper.find('skeleton')).toBeTruthy();
    });

    it('renders Icon prop correctly', () => {
        const wrapper = setup.setProps({ Icon: Square });

        expect(wrapper.find(Square)).toBeTruthy();
    });

    it('renders Icon default prop correctly', () => {
        const wrapper = setup.setProps({});

        expect(wrapper.find(Square)).toBeTruthy();
    });

    it("handles user's click", () => {
        const wrapper = setup.setProps({ onClick: mockFn });
        const event = {
            currentTarget: {
                innerHTML: 'test'
            }
        } as MouseEvent<HTMLButtonElement>;
        wrapper.find('button').props().onClick!(event);
        expect(mockFn).toHaveBeenCalledWith(event);
    });

    it.each<IAvatarProps['color']>(['blue', 'green', 'lagoon', 'neutral', 'orange', 'purple', 'red'])(
        'should have %s color',
        (color) => {
            const wrapper = setup.setProps({ color });
            expect(wrapper.find('.avatar').hasClass(`avatar_color_${color}`)).toBeTruthy();
        }
    );

    it.each<IAvatarProps['size']>(['6Xlarge', 'large', 'medium', 'small'])('should have %s size', (size) => {
        const wrapper = setup.setProps({ size });

        expect(wrapper.find('.avatar').hasClass(`avatar_size_${size}`)).toBeTruthy();
    });

    it('renders className prop correctly', () => {
        const className = 'test-class';
        const wrapper = setup.setProps({ className });

        expect(wrapper.hasClass(className)).toBeTruthy();
    });
});
