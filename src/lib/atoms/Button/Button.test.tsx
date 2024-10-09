import React, { MouseEvent } from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { Globe } from '@geneui/icons';

//@ts-ignore
// Helpers
import { noop } from 'utils';
// Components
import Button, { IButtonProps } from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('Button ', () => {
    let setup: ReactWrapper<IButtonProps>;
    const mockFn = jest.fn();

    beforeEach(() => (setup = mount(<Button onClick={noop} />, { wrappingComponent: GeneUIProvider })));

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
        expect(wrapper.find('.button').hasClass('button_fullWidth')).toBeTruthy();
    });

    it('renders Icon prop correctly', () => {
        const wrapper = setup.setProps({ Icon: <Globe /> });
        expect(wrapper.find(Globe).exists()).toBeTruthy();
    });

    it('renders name prop correctly', () => {
        const name = 'test';
        const wrapper = setup.setProps({ name });
        expect(wrapper.find('button').props().name).toBe(name);
    });
    it('renders onClick prop correctly', () => {
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
            expect(wrapper.find('.button').hasClass(`button_size_${size}`)).toBeTruthy();
        }
    );

    it.each<IButtonProps['appearance']>(['primary', 'secondary', 'danger', 'success', 'inverse', 'transparent'])(
        'checking a component with a prop loaderColor : %p ',
        (appearance) => {
            const wrapper = setup.setProps({ appearance });
            expect(wrapper.find('.button').hasClass(`button_color_${appearance}`)).toBeTruthy();
        }
    );

    it.each<IButtonProps['type']>(['fill', 'outline', 'text'])(
        'checking a component with a prop type : %p ',
        (type) => {
            const wrapper = setup.setProps({ type });
            expect(wrapper.find('.button').hasClass(`button_type_${type}`)).toBeTruthy();
        }
    );
});
