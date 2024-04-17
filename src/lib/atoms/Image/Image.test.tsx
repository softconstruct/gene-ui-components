import React from 'react';
import { ReactWrapper, mount } from 'enzyme';

// Components
import Image from './';
import Tooltip from '../../molecules/Tooltip';
import Empty from '../Empty';
import Checkbox from '../../molecules/Checkbox';

// Types
import { IImageProps } from '.';
import GeneUIProvider from '../../providers/GeneUIProvider';

describe('Image', () => {
    let setup: ReactWrapper<IImageProps>;

    beforeEach(() => {
        setup = mount(
            <Image
                src={
                    'data:image/jpeg;base64,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'
                }
                withBorder={false}
                selectMode={false}
                isValid={false}
            />,
            {
                wrappingComponent: GeneUIProvider
            }
        );
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('renders className prop correctly', () => {
        const className = 'test';
        setup.setProps({ isValid: true });
        const wrapper = setup.setProps && setup.setProps({ isValid: true });
        expect(wrapper.find('.test').exists()).toBeTruthy();
        expect(setup.exists()).toBeTruthy();
    });

    it('renders src prop correctly', () => {
        const src = 'test-img';
        const wrapper = setup.setProps({ src });
        expect(wrapper.find(`[src="${src}"]`).exists()).toBeTruthy();
    });

    it('checking with prop "selectMode" and "src" and check rendering component "Checkbox"', () => {
        const wrapper = setup.setProps({ selectMode: true, src: 'test-data' });

        expect(wrapper.find('.image-content').exists()).toBeTruthy();
        expect(wrapper.find('.image-label-holder').exists()).toBeTruthy();
        expect(wrapper.find(Checkbox).exists()).toBeTruthy();
    });

    it('checking component  "Checkbox" without prop "src"', () => {
        expect(setup.find(Checkbox).exists()).toBeFalsy();
    });

    it('checking component "Empty" without prop "src"', () => {
        const wrapper = setup.setProps({ src: '' });

        expect(wrapper.find(Empty).exists()).toBeTruthy();
    });

    it('checking ToolTip inside of component', () => {
        expect(setup.find(Tooltip).exists()).toBeTruthy();
    });

    it('checking component "Empty" with prop "src"', () => {
        const wrapper = setup.setProps({ src: 'test-data' });
        expect(wrapper.find(Empty).exists()).toBeFalsy();
    });
});
