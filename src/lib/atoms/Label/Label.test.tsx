import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Label, { ILabelProps } from './index';
import { Icon } from '../../../index';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('Label ', () => {
    let setup: ReactWrapper<ILabelProps>;
    const children = 'label';
    const htmlFor = 'input';

    beforeEach(
        () =>
            (setup = mount(<Label htmlFor={htmlFor}>{children}</Label>, {
                wrappingComponent: GeneUIProvider
            }))
    );

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders htmlFor prop correctly', () => {
        expect(setup.find('label').prop('htmlFor')).toStrictEqual(htmlFor);
    });

    it.each<ILabelProps['size']>(['medium', 'small'])('should have "%s" size', (size) => {
        const wrapper = setup.setProps({ size });

        expect(wrapper.find('.label__text').hasClass(`label__text_size_${size}`)).toBeTruthy();
    });

    it('renders children prop correctly', () => {
        expect(setup.find('label').text()).toStrictEqual(children);
    });

    it('renders required prop correctly', () => {
        const wrapper = setup.setProps({ required: true });
        expect(wrapper.find('span').text()).toStrictEqual('*');
    });

    it('renders infoText prop correctly', () => {
        const wrapper = setup.setProps({ infoText: 'text' });
        expect(wrapper.find(Icon)).toBeTruthy();
    });

    it('renders disabled prop correctly', () => {
        const wrapper = setup.setProps({ disabled: true });
        expect(wrapper.find('.label__text').hasClass('label__text_disabled')).toBeTruthy();
    });

    it('renders isLoading prop correctly', () => {
        const wrapper = setup.setProps({ isLoading: true });
        expect(wrapper.find('.label').hasClass('label__text')).toBeFalsy();
    });
});
