import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Button, { IButtonProps } from './index';
import GeneUIProvider from '../../providers/GeneUIProvider';
import Icon from '../Icon';

describe('Button ', () => {
    let setup: ReactWrapper<IButtonProps>;
    beforeEach(() => (setup = mount(<Button />, { wrappingComponent: GeneUIProvider })));

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('disabled1', () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find('.button').props().disabled).toBeTruthy();
    });

    it.each<IButtonProps['color']>(['primary', 'secondary', 'danger', 'success', 'inverse', 'transparent'])(
        'size',
        (color) => {
            const wrapper = setup.setProps({ color });
            expect(wrapper.find(`.button_color_${color}`).exists()).toBeTruthy();
        }
    );
    it.each<IButtonProps['size']>(['large', 'medium', 'small'])('size', (size) => {
        const wrapper = setup.setProps({ size });
        expect(wrapper.find(`.button_size_${size}`).exists()).toBeTruthy();
    });

    it.each<IButtonProps['type']>(['fill', 'outline', 'text'])('type', (type) => {
        const wrapper = setup.setProps({ type });
        expect(wrapper.find(`.button_type_${type}`).exists()).toBeTruthy();
    });
});
