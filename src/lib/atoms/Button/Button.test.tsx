import React, { MouseEvent } from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Button, { IButtonProps } from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('Button ', () => {
    let setup: ReactWrapper<IButtonProps>;
    const mockFn = jest.fn();

    beforeEach(() => (setup = mount(<Button />, { wrappingComponent: GeneUIProvider })));

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders disabled prop correctly', () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find('.button').props().disabled).toBeTruthy();
    });

    it('renders fullWidth prop correctly', () => {
        const wrapper = setup.setProps({ fullWidth: true });
        expect(wrapper.find('.button_full_width').exists()).toBeTruthy();
    });
    it('renders name prop correctly', () => {
        const name = 'test';
        const wrapper = setup.setProps({ name });
        expect(wrapper.find('button').props().name).toBe(name);
    });
    it('renders  onClick prop correctly', () => {
        const wrapper = setup.setProps({ onClick: mockFn });
        const event = {
            currentTarget: {
                innerHTML: 'test'
            }
        } as MouseEvent<HTMLButtonElement>;
        wrapper.find('button').props().onClick!(event);
        expect(mockFn).toHaveBeenCalledWith(event);
    });

    it.each<IButtonProps['size']>(['large', 'medium', 'small'])(
        'checking a component with a prop size : %p',
        (size) => {
            const wrapper = setup.setProps({ size });
            expect(wrapper.find(`.button_size_${size}`).exists()).toBeTruthy();
        }
    );

    it.each<IButtonProps['appearance']>(['primary', 'secondary', 'danger', 'success', 'inverse', 'transparent'])(
        'checking a component with a prop loaderColor : %p ',
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find(`.button_color_${appearance}`).exists()).toBeTruthy();
        }
    );

    it.each<IButtonProps['state']>(['fill', 'outline', 'text'])(
        'checking a component with a prop type : %p ',
        (state) => {
            const wrapper = setup.setProps({ state });
            expect(wrapper.find(`.button_type_${state}`).exists()).toBeTruthy();
        }
    );
});
